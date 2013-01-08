Ext.onReady(function() {

   var tree = SiteTree.createTreePanel();

   var tabPanelOn = TabPanelOn.createTabPanel();

   Ext.getCmp('tree').on('click', function(node) {
      var id = node.id;

      statusStore.load({
         params : {
            start : 0,
            limit : 10000,
            id    : id,
            flag  : '2'
         }
      });

      parameterStore.load({
         params : {
            start : 0,
            limit : 10000,
            id    : id,
            flag  : '1'
         }
      });

      editStore.load({
         params : {
            start : 0,
            limit : 10000,
            id    : id,
            flag  : '3'
         }
      });
      
      store.load();

      comboStore.load({
         params : {
            start : 0,
            limit : 10000,
            id    : id,
            flag  : '4'
         }
      });

   });
});