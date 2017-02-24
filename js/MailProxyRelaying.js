Ext.define('PMG.MailProxyRelaying', {
    extend: 'Proxmox.grid.ObjectGrid',
    alias: ['widget.pmgMailProxyRelaying'],

    initComponent : function() {
	var me = this;

	var rows = {
	    relay: {
		required: true,
		defaultValue: Proxmox.Utils.noneText,
		header: gettext('Default Relay'),
		editor: {
		    xtype: 'proxmoxWindowEdit',
		    subject: gettext('Default Relay'),
		    items: {
			xtype: 'proxmoxtextfield',
			name: 'relay',
			deleteEmpty: true,
			fieldLabel: gettext('Default Relay')
		    }
		}
	    },
	    relayport: {
		required: true,
		defaultValue: 25,
		header: gettext('SMTP port'),
		editor: {
		    xtype: 'proxmoxWindowEdit',
		    subject: gettext('SMTP Port'),
		    items: {
			xtype: 'proxmoxintegerfield',
			name: 'relayport',
			minValue: 1,
			maxValue: 65535,
			deleteEmpty: true,
			value: 25,
			fieldLabel: gettext('SMTP port')
		    }
		}
	    },
	    relaynomx: {
		required: true,
		defaultValue: 0,
		header: gettext('Disable MX lookup'),
		renderer: Proxmox.Utils.format_boolean,
		editor: {
		    xtype: 'proxmoxWindowEdit',
		    subject: gettext('Disable MX lookup'),
		    items: {
			xtype: 'proxmoxcheckbox',
			name: 'relaynomx',
			uncheckedValue: 0,
			defaultValue: 0,
			deleteDefaultValue: true,
			fieldLabel: gettext('Disable MX lookup')
		    }
		}
	    },
	    smarthost: {
		required: true,
		defaultValue: Proxmox.Utils.noneText,
		header: gettext('Smarthost'),
		editor: {
		    xtype: 'proxmoxWindowEdit',
		    subject: gettext('Smarthost'),
		    items: {
			xtype: 'proxmoxtextfield',
			name: 'smarthost',
			deleteEmpty: true,
			fieldLabel: gettext('Smarthost')
		    }
		}
	    },

	};

	var baseurl = '/config/mail';

	Ext.apply(me, {
	    url: '/api2/json' + baseurl,
	    editorConfig: {
		url: '/api2/extjs' + baseurl,
	    },
	    interval: 5000,
	    cwidth1: 200,
	    rows: rows,
	    listeners: {
		itemdblclick: me.run_editor
	    }
	});

	me.callParent();

	me.on('activate', me.rstore.startUpdate);
	me.on('destroy', me.rstore.stopUpdate);
    }
});
