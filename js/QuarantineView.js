/*global Proxmox*/
Ext.define('PMG.QuarantineNavigationTree', {
    extend: 'Ext.list.Tree',
    xtype: 'quarantinenavigationtree',

    select: function(path) {
	var me = this;
	var item = me.getStore().findRecord('path', path, 0, false, true, true);
	me.setSelection(item);
    },

    store: {
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
			    iconCls: 'fa fa-file-o',
			    path: 'pmgUserWhitelist',
			    leaf: true
			},
			{
			    text: gettext('Blacklist'),
			    iconCls: 'fa fa-file',
			    path: 'pmgUserBlacklist',
			    leaf: true
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
		    ':path'    : '(?:([%a-zA-Z0-9\\-\\_\\s,]+))',
		    ':subpath' : '(?:(?::)([%a-zA-Z0-9\\-\\_\\s,]+))?'
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
		    if (lastpanel.getActiveTab().getItemId() !== subpath) {
			// set the active tab
			lastpanel.setActiveTab(subpath);
		    }
		    // else we are already there
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

	    var obj = contentpanel.add({ xtype: path, cselect: subpath });
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
	    PMG.app.logout();
	},

	changeLanguage: function() {
	    Ext.create('Ext.window.Window', {
		title: gettext('Language'),
		bodyPadding: 10,
		items: [
		    {
			xtype: 'proxmoxLanguageSelector',
			fieldLabel: gettext('Language'),
			value: Ext.util.Cookies.get('PMGLangCookie') || 'en',
		    },
		],

		buttons: [
		    {
			text: gettext('OK'),
			handler: function() {
			    let me = this;
			    let win = this.up('window');
			    let value = win.down('proxmoxLanguageSelector').getValue();
			    var dt = Ext.Date.add(new Date(), Ext.Date.YEAR, 10);
			    Ext.util.Cookies.set('PMGLangCookie', value, dt);
			    win.mask(gettext('Please wait...'), 'x-mask-loading');
			    window.location.reload();
			},
		    }
		]
	    }).show();
	},

	navigate: function(treelist, item) {
	    this.redirectTo(item.get('path'));
	},

	execQuarantineAction: function(qa) {
	    PMG.Utils.doQuarantineAction(qa.action, qa.cselect);
	},

	control: {
	    '[reference=logoutButton]': {
		click: 'logout'
	    },
	    '[reference=languageButton]': {
		click: 'changeLanguage',
	    },
	},

	init: function(view) {
	    var me = this;

	    // load username
	    var username = Proxmox.UserName.replace(/\@quarantine$/, '');
	    me.lookupReference('usernameinfo').setText(username);

	    // show login on requestexception
	    // fixme: what about other errors
	    Ext.Ajax.on('requestexception', function(conn, response, options) {
		if (response.status == 401) { // auth failure
		    me.logout();
		}
	    });

	    var qa = PMG.Utils.extractQuarantineAction();
	    var token;
	    if (qa) {
		token = 'pmgSpamQuarantine';
		if (qa.action === 'blacklist') { token = 'pmgUserBlacklist'; }
		if (qa.action === 'whitelist') { token = 'pmgUserWhitelist'; }
		if (qa.cselect) {
		    token += ':' + qa.cselect;
		}
		this.redirectTo(token, true);
		if (qa.action) {
		    me.execQuarantineAction(qa);
		}
	    } else {
		// select treeitem and load page from url fragment
		
		token = Ext.util.History.getToken() || 'pmgSpamQuarantine';
		this.redirectTo(token, true);
	    }
	}
    },

    plugins: 'viewport',

    layout: {
	type: 'border'
    },

    items: [
	{
	    region: 'north',
	    xtype: 'container',
	    layout: {
		type: 'hbox',
		align: 'middle'
	    },
	    margin: '2 0 2 5',
	    height: 38,
	    items: [
		{
		    xtype: 'proxmoxlogo'
		},
		{
		    padding: '0 0 0 5',
		    xtype: 'versioninfo'
		},
		{
		    flex: 1
		},
		{
		    xtype: 'button',
		    reference: 'usernameinfo',
		    style: {
			// proxmox dark grey p light grey as border
			backgroundColor: '#464d4d',
			borderColor: '#ABBABA'
		    },
		    margin: '0 5 0 0',
		    iconCls: 'fa fa-user',
		    menu: [
			{
			    iconCls: 'fa fa-language',
			    text: gettext('Language'),
			    reference: 'languageButton',
			},
			'-',
			{
			    reference: 'logoutButton',
			    iconCls: 'fa fa-sign-out',
			    text: gettext('Logout')
			},
		    ],
		},
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
	    layout: {
		type: 'card'
	    },
	    region: 'center',
	    border: false,
	    reference: 'contentpanel'
	}
    ]
});
