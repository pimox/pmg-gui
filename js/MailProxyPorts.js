Ext.define('PMG.MailProxyPorts', {
    extend: 'Proxmox.grid.ObjectGrid',
    alias: ['widget.pmgMailProxyPorts'],

    url: '/api2/json/config/mail',

    editorConfig: {
	url: '/api2/extjs/config/mail',
    },

    interval: 5000,

    cwidth1: 200,

    controller: {

	xclass: 'Ext.app.ViewController',

	onEdit: function() {
	    this.getView().run_editor();
	}
    },

    listeners: {
	itemdblclick: 'onEdit',
    },

    tbar: [
	{
	    text: gettext('Edit'),
	    xtype: 'proxmoxButton',
	    disabled: true,
	    handler: 'onEdit'
	}
    ],

    initComponent : function() {
	var me = this;

	me.add_integer_row('ext_port', gettext('External SMTP Port'),
			   { defaultValue: 26, deleteEmpty: true,
			     minValue: 1, maxValue: 65535 });

	me.add_integer_row('int_port', gettext('Internal SMTP Port'),
			   { defaultValue: 25, deleteEmpty: true,
			     minValue: 1, maxValue: 65535 });

	me.callParent();

	me.rstore.startUpdate();
	me.on('destroy', me.rstore.stopUpdate);
    }
});
