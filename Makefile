include /usr/share/dpkg/pkg-info.mk

PACKAGE=pmg-gui

DEB=${PACKAGE}_${DEB_VERSION_UPSTREAM_REVISION}_all.deb

DESTDIR=
DOCDIR=${DESTDIR}/usr/share/doc/${PACKAGE}
WWWBASEDIR=${DESTDIR}/usr/share/javascript/${PACKAGE}
WWWCSSDIR=${WWWBASEDIR}/css
WWWIMAGESDIR=${WWWBASEDIR}/images
WWWJSDIR=${WWWBASEDIR}/js

IMAGES=				\
	images/logo-128.png		\
	images/proxmox_logo.png

CSSFILES = css/ext6-pmg.css css/ext6-pmg-mobile.css

export DEB_VERSION_UPSTREAM_REVISION

all:

.PHONY: deb
deb ${DEB}:
	rm -rf build
	rsync -a * build
	cd build; dpkg-buildpackage -b -us -uc
	lintian ${DEB}

.PHONY: js/pmgmanagerlib.js js/mobile/pmgmanagerlib-mobile.js
js/pmgmanagerlib.js:
	make -C js pmgmanagerlib.js
js/mobile/pmgmanagerlib-mobile.js:
	make -C js/mobile pmgmanagerlib-mobile.js

install: pmg-index.html.tt pmg-mobile-index.html.tt js/pmgmanagerlib.js js/mobile/pmgmanagerlib-mobile.js ${IMAGES} ${CSSFILES}
	install -d -m 755 ${WWWBASEDIR}
	install -d -m 755 ${WWWCSSDIR}
	install -d -m 755 ${WWWIMAGESDIR}
	install -d -m 755 ${WWWJSDIR}
	install -m 0644 pmg-index.html.tt ${WWWBASEDIR}
	install -m 0644 pmg-mobile-index.html.tt ${WWWBASEDIR}
	install -m 0644 js/pmgmanagerlib.js ${WWWJSDIR}
	install -m 0644 js/mobile/pmgmanagerlib-mobile.js ${WWWJSDIR}
	for f in ${IMAGES}; do install -m 0644 "$$f" ${WWWIMAGESDIR}; done
	for f in ${CSSFILES}; do install -m 0644 "$$f" ${WWWCSSDIR}; done

.PHONY: upload
upload: ${DEB}
	tar cf - ${DEB} | ssh -X repoman@repo.proxmox.com -- upload --product pmg --dist stretch

distclean: clean
	rm -f examples/simple-demo.pem

.PHONY: lint
check:
	$(MAKE) -C js/ check
	$(MAKE) -C js/mobile check

clean:
	make -C js clean
	rm -rf ./build *.deb *.changes *.buildinfo
	find . -name '*~' -exec rm {} ';'

.PHONY: dinstall
dinstall: ${DEB}
	dpkg -i ${DEB}
