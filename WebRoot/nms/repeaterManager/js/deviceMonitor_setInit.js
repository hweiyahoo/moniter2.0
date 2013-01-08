/**
 * 命令策略管理
 * 
 * @author huangwei
 * @since 2011-07-22
 */
Ext.onReady(function() {

   var root = new Ext.tree.TreeNode({
      id       : '0',
      text     : '设备监控信息',
      expanded : true
   });
   var node1 = new Ext.tree.TreeNode({
      id        : '1',
      text      : '状态信息',
      listeners : {
         'click' : function() {
            doClickFunc(this, 'devicemnt.ered?reqCode=statusInfoInit&paramclass=03');
         }
      }
   });
   var node2 = new Ext.tree.TreeNode({
      id        : '2',
      text      : '参数信息',
      listeners : {
         'click' : function() {
            doClickFunc(this, 'devicemnt.ered?reqCode=paramsInfoInit&paramclass=00,01');
         }
      }
   });
   var node3 = new Ext.tree.TreeNode({
      id        : '3',
      text      : '基本信息',
      listeners : {
         'click' : function() {
            doClickFunc(this, 'devicemnt.ered?reqCode=baseInfoInit&paramclass=04,05');
         }
      }
   });

   root.appendChild(node1);
   root.appendChild(node2);
   root.appendChild(node3);

   // 定义一个树面板
   var tree = new Ext.tree.TreePanel({
      // useArrows : true, // 箭头节点图标
      root       : root,
      animate    : false,
      title      : '<span style="font-weight:normal">直放站站点</span>',
      iconCls    : 'layout_contentIcon',
      // collapsible : true,
      width      : 110,
      // minSize : 160,
      // maxSize : 220,
      region     : 'west',
      layout     : 'fit',
      // split : true,
      frame      : false,
      border     : true, 
      autoScroll : true
   });

   function doClickFunc(node, url) {
      url =
            url + "&protype=" + protype_ + "&repeaterid=" + repeaterid_ + "&wh="
               + contentPanel_width + "," + contentPanel_height;
      contentPanel.load({
         url        : url,
         discardUrl : false,
         nocache    : false,
         scripts    : true
      });
   }

   var contentPanel = new Ext.Panel({
      id         : 'contentPanel_id',
      iconCls    : 'layout_contentIcon',
      layout     : 'fit',
      region     : 'center',
      frame      : false,
      border     : false,
      autoScroll : true
   });

   var cmpPanel = Ext.get("selectRepeaterWindow");//
   var setPanel = new Ext.Panel({
      renderTo : 'repeaterGridTable',
      layout   : 'border',
      frame    : false,
      border   : false,
      width    : cmpPanel.getComputedWidth(),
      height   : cmpPanel.getComputedHeight(),
      items    : [tree, contentPanel]
   });

   var contentPanel_width = Ext.get("contentPanel_id").getComputedWidth() - 18;
   var contentPanel_height = Ext.get("contentPanel_id").getComputedHeight() - 35;
});