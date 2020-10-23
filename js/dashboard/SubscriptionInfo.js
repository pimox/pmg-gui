Ext.define('PMG.dashboard.SubscriptionInfo', {
    extend: 'Ext.panel.Panel',
    xtype: 'pmgSubscriptionInfo',

    data: {
	icon: 'question-circle',
	message: gettext('Unknown'),
    },

    style: {
	cursor: 'pointer',
    },

    setSubStatus: function(status) {
	var me = this;
	var data = {};

	switch (status) {
	    case 2:
		data.icon = 'check green';
		data.message = gettext('Your subscription status is valid.');
		break;
	    case 1:
		data.icon = 'exclamation-triangle yellow';
		data.message = gettext('Warning: Your subscription levels are not the same.');
		break;
	    case 0:
		data.icon = 'times-circle red';
		data.message = gettext('You have at least one node without subscription.');
		break;
	    default:
		throw 'invalid subscription status';
	}
	me.update(data);
    },
    tpl: [
	'<table style="height: 100%;" class="dash">',
	'<tr><td class="center">',
	'<i class="fa fa-3x fa-{icon}"></i>',
	'</td><td class="center">{message}</td></tr>',
	'</table>',
    ],

    listeners: {
	click: {
	    element: 'body',
	    fn: function() {
		var mainview = this.component.up('mainview');
		mainview.getController().redirectTo('pmgSubscription');
	    },
	},
    },
});
