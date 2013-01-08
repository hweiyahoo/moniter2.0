
/**
 * 我的工作台 protal板块
 */
Ext.onReady(function() {
   Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

   var htmlSrc = '待开发中，敬请期待...';
   var portalHeight = Ext.getBody().getHeight() * 0.23
   var portal = {
      xtype  : 'portal',
      region : 'center',
      drop   : false,
      // margins : '2 5 5 2',
      items  : [{
         columnWidth : .36,
         style       : 'padding:2px 2px 2px 2px',
         defaults    : {
      // height : portalHeight
         },
         items       : [{
            title  : '万年历',
            layout : 'fit',
            height : 300,
            items  : [{
               layout   : 'fit',
               xtype    : 'panel',
               autoLoad : {
                  url        : 'portal.ered?reqCode=calendar',
                  discardUrl : false,
                  nocache    : false,
                  scripts    : true
               }
            }]
         }, {
            title  : '便签',
            layout : 'fit',
            height : 225,
            items  : [{
               id       : 'portal_first_p',
               layout   : 'fit',
               xtype    : 'panel',
               autoLoad : {
                  url        : 'portal.ered?reqCode=memo',
                  discardUrl : false,
                  nocache    : false,
                  scripts    : true
               }
            }]
         }]
      }, {
         columnWidth : .64,
         style       : 'padding:2px 2px 2px 2px',
         defaults    : {
         // height : portalHeight
         },
         items       : [{
            title  : '最新通告',
            layout : 'fit',
            tools  : [{
               id      : 'refresh',
               qtip    : '刷新',
               handler : function(e, target, panel) {
                  var contentPanel = Ext.getCmp('portal_panel_notice');
                  contentPanel.getUpdater().refresh();
               }
            }, {
               id      : 'gear',
               qtip    : '更多',
               handler : function() {
                  parent.showNoticeTabPanel();
               }
            }],
            items  : [{
               id       : 'portal_panel_notice',
               xtype    : 'panel',
               autoLoad : {
                  url        : 'portal.ered?reqCode=notice',
                  discardUrl : false,
                  nocache    : false,
                  scripts    : true
               }
            }]
         }, {
            title : '最新告警',
            tools : [{
               id      : 'refresh',
               qtip    : '刷新',
               handler : function(e, target, panel) {
                  var contentPanel = Ext.getCmp('portal_panel_alarm');
                  contentPanel.getUpdater().refresh();
               }
            }, {
               id      : 'gear',
               qtip    : '更多',
               handler : function() {
                  parent.showAlarmTabPanel('', '1', '');
               }
            }],
            items : [{
               id       : 'portal_panel_alarm',
               xtype    : 'panel',
               autoLoad : {
                  url        : 'portal.ered?reqCode=alarm',
                  discardUrl : false,
                  nocache    : false,
                  scripts    : true
               }
            }]
         }]
      }]
   }

   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [portal]
   });
});