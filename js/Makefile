JSSRC=							\
	Utils.js					\
	FilterProxy.js					\
	LoginView.js					\
	RoleSelector.js					\
	ServerStatus.js					\
	ServerAdministration.js				\
	LDAPProfileSelector.js				\
	LDAPGroupSelector.js				\
	LDAPGroupEditor.js				\
	LDAPUserSelector.js				\
	LDAPUserEditor.js				\
	RegexTester.js					\
	ObjectGroupList.js				\
	ObjectGroup.js					\
	ObjectGroupSelector.js				\
	ObjectGroupConfiguration.js			\
	ActionList.js					\
	RuleInfo.js					\
	RuleEditor.js					\
	MainView.js					\
	QuarantineList.js				\
	SpamInfoGrid.js					\
	MailInfo.js					\
	SpamQuarantine.js				\
	UserBlackWhiteList.js				\
	QuarantineView.js				\
	Dashboard.js					\
	dashboard/MailProcessing.js			\
	dashboard/SubscriptionInfo.js			\
	dashboard/MiniGraph.js				\
	VersionInfo.js					\
	MailTracker.js					\
	NavigationTree.js				\
	RuleConfiguration.js				\
	SystemOptions.js				\
	Subscription.js					\
	BackupConfiguration.js				\
	BackupRestore.js				\
	PBSSnapshotView.js				\
	PBSRemoteEdit.js				\
	PBSConfig.js					\
	SystemConfiguration.js				\
	MailProxyRelaying.js				\
	MailProxyPorts.js				\
	MailProxyOptions.js				\
	MailProxyTLS.js					\
	MailProxyTLSPanel.js				\
	MailProxyTLSDestinations.js			\
	Transport.js					\
	MyNetworks.js					\
	RelayDomains.js					\
	DKIMSettings.js					\
	MailProxyDKIMPanel.js				\
	MailProxyConfiguration.js			\
	SpamDetectorLanguages.js			\
	SpamDetectorOptions.js				\
	SpamQuarantineOptions.js			\
	SpamDetectorStatus.js				\
	SpamDetectorConfiguration.js			\
	SpamDetectorCustom.js				\
	VirusDetectorOptions.js				\
	VirusQuarantineOptions.js			\
	VirusQuarantine.js				\
	AttachmentQuarantine.js				\
	AttachmentGrid.js				\
	ClamAVDatabase.js				\
	VirusDetectorConfiguration.js			\
	LDAPConfig.js					\
	UserEdit.js					\
	UserView.js					\
	FetchmailEdit.js				\
	FetchmailView.js				\
	UserManagement.js				\
	ViewMailHeaders.js				\
	PostfixQShape.js				\
	PostfixMailQueue.js				\
	QueueAdministration.js				\
	ClusterAdministration.js			\
	ConfigPanel.js					\
	StatTimeSelector.js				\
	StatStore.js					\
	MailStatGrid.js					\
	VirusCharts.js					\
	SpamScoreDistribution.js 			\
	GeneralMailStatistics.js			\
	RBLStatistics.js				\
	DomainStatistics.js				\
	SenderStatistics.js				\
	ReceiverStatistics.js				\
	ContactStatistics.js				\
	HourlyMailDistribution.js			\
	SpamContextMenu.js				\
	Certificates.js					\
	Application.js

OnlineHelpInfo.js: /usr/bin/asciidoc-pmg
	/usr/bin/asciidoc-pmg scan-extjs ${JSSRC} >$@.tmp
	mv $@.tmp $@

.lint-incremental: ${JSSRC}
	eslint $?
	touch "$@"

.PHONY: lint
lint: .lint-incremental

.PHONY: check
check: ${JSSRC}
	eslint --strict ${JSSRC}
	touch ".lint-incremental"

pmgmanagerlib.js: OnlineHelpInfo.js ${JSSRC}
	echo "// ${DEB_VERSION_UPSTREAM_REVISION}" > $@.tmp
	cat OnlineHelpInfo.js ${JSSRC} >> $@.tmp
	mv $@.tmp $@

all: pmgmanagerlib.js

.PHONY: clean
clean:
	$(MAKE) -C mobile clean
	find . -name '*~' -exec rm {} ';'	
	rm -rf pmgmanagerlib.js pmgmanagerlib.js.tmp OnlineHelpInfo.js



