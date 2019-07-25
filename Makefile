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
	logo-128.png		\
	proxmox_logo.png

CSSFILES = ext6-pmg.css ext6-pmg-mobile.css

all:

.PHONY: deb
deb ${DEB}:
	rm -rf build
	rsync -a * build
	cd build; dpkg-buildpackage -b -us -uc
	lintian ${DEB}

js/pmgmanagerlib.js:
	make -C js pmgmanagerlib.js

js/pmgmanagerlib-mobile.js:
	make -C js pmgmanagerlib-mobile.js

install: pmg-index.html.tt js/pmgmanagerlib.js js/pmgmanagerlib-mobile.js
	install -d -m 755 ${WWWCSSDIR}
	install -d -m 755 ${WWWIMAGESDIR}
	install -d -m 755 ${WWWJSDIR}
	install -m 0644 pmg-index.html.tt ${WWWBASEDIR}
	install -m 0644 pmg-mobile-index.html.tt ${WWWBASEDIR}
	install -m 0644 js/pmgmanagerlib.js ${WWWJSDIR}
	install -m 0644 js/pmgmanagerlib-mobile.js ${WWWJSDIR}
	for i in ${IMAGES}; do install -m 0644 images/$$i ${WWWIMAGESDIR}; done
	for i in ${CSSFILES}; do install -m 0644 css/$$i ${WWWCSSDIR}; done

.PHONY: upload
upload: ${DEB}
	tar cf - ${DEB} | ssh -X repoman@repo.proxmox.com -- upload --product pmg --dist stretch

distclean: clean
	rm -f examples/simple-demo.pem

clean:
	make -C js clean
	rm -rf ./build *.deb *.changes *.buildinfo
	find . -name '*~' -exec rm {} ';'

.PHONY: dinstall
dinstall: ${DEB}
	dpkg -i ${DEB}
