Ext.define('PMG.CertificateConfiguration', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.pmgCertificateConfiguration',

    title: gettext('Certificates'),

    border: false,
    defaults: { border: false },

    items: [
	{
	    itemId: 'certificates',
	    xtype: 'pmgCertificatesView',
	},
	{
	    itemId: 'acme',
	    xtype: 'pmgACMEConfigView',
	},
    ],
});

Ext.define('PMG.CertificateView', {
    extend: 'Ext.container.Container',
    alias: 'widget.pmgCertificatesView',

    title: gettext('Certificates'),

    items: [
	{
	    xtype: 'pmxCertificates',
	    border: 0,
	    infoUrl: '/nodes/' + Proxmox.NodeName + '/certificates/info',
	    uploadButtons: [
		{
		    name: 'API',
		    id: 'pmg-api.pem',
		    url: `/nodes/${Proxmox.NodeName}/certificates/custom/api`,
		    deletable: false,
		    reloadUi: true,
		},
		{
		    name: 'SMTP',
		    id: 'pmg-tls.pem',
		    url: `/nodes/${Proxmox.NodeName}/certificates/custom/smtp`,
		    deletable: true,
		},
	    ],
	},
	{
	    xtype: 'pmxACMEDomains',
	    border: 0,
	    url: `/nodes/${Proxmox.NodeName}/config`,
	    nodename: Proxmox.NodeName,
	    acmeUrl: '/config/acme',
	    domainUsages: [
		{
		    usage: 'api',
		    name: 'API',
		    url: `/nodes/${Proxmox.NodeName}/certificates/acme/api`,
		    reloadUi: true,
		},
		{
		    usage: 'smtp',
		    name: 'SMTP',
		    url: `/nodes/${Proxmox.NodeName}/certificates/acme/smtp`,
		},
	    ],
	},
    ],
});

Ext.define('PMG.ACMEConfigView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pmgACMEConfigView',

    title: gettext('ACME Accounts'),

    //onlineHelp: 'sysadmin_certificate_management',

    items: [
	{
	    region: 'north',
	    border: false,
	    xtype: 'pmxACMEAccounts',
	    acmeUrl: '/config/acme',
	},
	{
	    region: 'center',
	    border: false,
	    xtype: 'pmxACMEPluginView',
	    acmeUrl: '/config/acme',
	},
    ],
});


