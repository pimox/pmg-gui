Ext.define('PMG.QuarantineNavigationTree', {
    extend: 'Ext.list.Tree',
    xtype: 'quarantinenavigationtree',

    select: function(path) {
	var me = this;
	var item = me.getStore().findRecord('path', path, 0, false, true, true);
	me.setSelection(item);
    },

    store: {
	xcalss: 'Ext.data.TreeStore',
	root: {
	    expanded: true,
	    children: [
		{
		    text: gettext('Spam Quarantine'),
		    iconCls: 'fa fa-cubes',
		    path: 'pmgSpamQuarantine',
		    expanded: true,
		    children: [
			{
			    text: gettext('Whitelist'),
			    //iconCls: 'fa fa-cubes',
			    path: 'pmgUserWhitelist',
			    leaf: true,
			},
			{
			    text: gettext('Blacklist'),
			    //iconCls: 'fa fa-cubes',
			    path: 'pmgUserBlacklist',
			    leaf: true,
			}
		    ]
		}
	    ]
	}
    },

    animation: false,
    expanderOnly: true,
    expanderFirst: false,
    ui: 'nav'
});

Ext.define('PMG.QuarantineView', {
    extend: 'Ext.container.Container',
    xtype: 'quarantineview',

    title: 'Proxmox Mail Gateway Quarantine',

    controller: {
	xclass: 'Ext.app.ViewController',
	routes: {
	    ':path:subpath': {
		action: 'changePath',
		before: 'beforeChangePath',
                conditions : {
		    ':path'    : '(?:([%a-zA-Z0-9\-\_\s,]+))',
		    ':subpath' : '(?:(?::)([%a-zA-Z0-9\-\_\s,]+))?'
		}
	    }
	},

	beforeChangePath: function(path, subpath, action) {
	    var me = this;

	    if (!Ext.ClassManager.getByAlias('widget.'+ path)) {
		console.warn('xtype "'+path+'" not found');
		action.stop();
		return;
	    }

	    var lastpanel = me.lookupReference('contentpanel').getLayout().getActiveItem();
	    if (lastpanel && lastpanel.xtype === path) {
		// we have the right component already,
		// we just need to select the correct tab
		// default to the first
		subpath = subpath || 0;
		if (lastpanel.getActiveTab) {
		    // we assume lastpanel is a tabpanel
		    if (lastpanel.getActiveTab().getItemId() === subpath) {
			// we are already there
		    } else {
			// set the active tab
			lastpanel.setActiveTab(subpath);
		    }
		}
		action.stop();
		return;
	    }

	    action.resume();
	},

	changePath: function(path,subpath) {
	    var me = this;
	    var contentpanel = me.lookupReference('contentpanel');
	    var lastpanel = contentpanel.getLayout().getActiveItem();

	    var obj = contentpanel.add({ xtype: path });
	    var treelist = me.lookupReference('navtree');

	    treelist.suspendEvents();
	    treelist.select(path);
	    treelist.resumeEvents();

	    if (Ext.isFunction(obj.setActiveTab)) {
		obj.setActiveTab(subpath || 0);
		obj.addListener('tabchange', function(tabpanel, newc, oldc) {
		    var newpath = path;

		    // only add the subpath part for the
		    // non-default tabs
		    if (tabpanel.items.findIndex('id', newc.id) !== 0) {
			newpath += ":" + newc.getItemId();
		    }

		    me.redirectTo(newpath);
		});
	    }

	    contentpanel.setActiveItem(obj);

	    if (lastpanel) {
		contentpanel.remove(lastpanel, { destroy: true });
	    }
	},

	logout: function() {
	    var me = this;
	    Proxmox.Utils.authClear();
	    me.getView().destroy();
	    Ext.create({ xtype: 'loginview'});
	},

	navigate: function(treelist, item) {
	    this.redirectTo(item.get('path'));
	},

	init: function(view) {
	    var me = this;

	    // load username
	    me.lookupReference('usernameinfo').update({username:Proxmox.UserName});

	    // show login on requestexception
	    // fixme: what about other errors
	    Ext.Ajax.on('requestexception', function(conn, response, options) {
		if (response.status == 401) { // auth failure
		    me.logout();
		}
	    });

	    // select treeitem and load page from url fragment
	    var token = Ext.util.History.getToken();
	    this.redirectTo(token, true);
	}
    },

    plugins: 'viewport',

    layout: 'border',

    items: [
	{
	    region: 'north',
	    xtype: 'container',
	    layout: {
		type: 'hbox',
		align: 'middle'
	    },
	    margin: '4 5 4 5',
	    items: [
		{
		    xtype: 'proxmoxlogo'
		},
		{
		    xtype: 'versioninfo'
		},
		{
		    flex: 1
		},
		{
		    baseCls: 'x-plain',
		    reference: 'usernameinfo',
		    padding: '0 5',
		    tpl: Ext.String.format(gettext("You are logged in as '{0}'"), '{username}')
		}
	    ]
	},
	{
	    xtype: 'quarantinenavigationtree',
	    reference: 'navtree',
	    minWidth: 177,
	    border: false,
	    region: 'west',
	    // we have to define it here until extjs 6.2
	    // because of a bug where a viewcontroller does not detect
	    // the selectionchange event of a treelist
	    listeners: {
		selectionchange: 'navigate'
	    }
	},
	{
	    xtype: 'panel',
	    layout: 'card',
	    region: 'center',
	    border: false,
	    reference: 'contentpanel',
	}
    ]
});