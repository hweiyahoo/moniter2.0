Ext.namespace('SiteTree');

SiteTree.createTreePanel = function() {

   var contextMenu = new Ext.menu.Menu({
      id    : 'siteContextMenu',
      items : [{
         text    : '连接站点',
         handler : function(node) {
            var sitewindow = openConnection.createWindow();
            sitewindow.show();
         }
      }, {
         text : '关闭站点'
      }, '-', {
         text : '撤销轮询'
      }, '-', {
         text    : '新增站点',
         handler : function(node) {
            var window = AddRepeater.createWindow();
            window.show();
         }
      }, {
         text    : '添加子机',
         handler : function(node) {
            var selectModel = tree.getSelectionModel(); // 获取树选择模型
            var selectNode = selectModel.getSelectedNode(); // 获取当前树选中节点对象

            var nodeId = selectNode.id;
            Ext.Ajax.request({
               url     : 'repeaterStatus.ered?reqCode=getSubCount',
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  if (json.success) {
                     if (!json.nohint) {
                        Ext.Msg.confirm('信息', json.msg, function(btn) {
                           if (btn == 'yes') {
                              var deviceTypeWindow = addSubMachine.createWindow(nodeId);
                              deviceTypeWindow.show();
                           }
                        });
                     }
                     else {
                        var deviceTypeWindow = addSubMachine.createWindow(nodeId);
                        deviceTypeWindow.show();
                     }
                  }
                  else {
                     Ext.Msg.alert('信息', json.msg);
                  }
               },
               params  : {
                  parentrepid : nodeId
               }
            });
         }
      }, {
         text    : '站点复制',
         handler : function(node) {
            var node = tree.getSelectionModel().getSelectedNode();
            var flag = node.attributes.flag;
            var nodeId = node.id;
            if (flag == 'host') {
               Ext.Ajax.request({
                  url     : 'saveRepeater.ered?reqCode=copyHost',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     Ext.Msg.alert('信息', json.msg);
                     tree.getRootNode().reload();
                  },
                  params  : {
                     repeaterid : nodeId
                  }
               });// 复制主机
            }
            else if (flag == 'sub') {// 复制子机
               Ext.Ajax.request({
                  url     : 'saveRepeater.ered?reqCode=copySub',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     Ext.Msg.alert('信息', json.msg);
                     tree.getRootNode().reload();
                  },
                  params  : {
                     repeaterid : nodeId
                  }
               });
            }
         }
      }, {
         text    : '删除站点',
         handler : function() {
            var node = tree.getSelectionModel().getSelectedNode();
            var flag = node.attributes.flag;
            var nodeId = node.id;
            if (flag == 'host') {// 删除主机
               Ext.Ajax.request({
                  url     : 'saveRepeater.ered?reqCode=deleHost',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     Ext.Msg.alert('信息', json.msg);
                     tree.getRootNode().reload();
                  },
                  params  : {
                     repeaterid : nodeId,
                     flag       : 'host'// 标示是主机还是子机
                  }
               });
            }
            else if (flag == 'sub') {
               Ext.Ajax.request({
                  url     : 'saveRepeater.ered?reqCode=deleHost',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     Ext.Msg.alert('信息', json.msg);
                     tree.getRootNode().reload();
                  },
                  params  : {
                     repeaterid : nodeId,
                     flag       : 'sub'
                  }
               });
            }
         }
      }, '-', {
         text    : '站点基本参数',
         handler : function() {
            var record = Ext.data.Record.create([{ // 定义 弹出框里的数据结构
               name : 'protype'
            }, {
               name : 'stationname'
            }, {
               name : 'devicetype'
            }, {
               name : 'province'
            }, {
               name : 'city'
            }, {
               name : 'stationid'
            }, {
               name : 'statsubid'
            }, {
               name : 'stattel'
            }, {
               name : 'ip'
            }, {
               name : 'setdate'
            }, {
               name : 'basestatcode'
            }, {
               name : 'site'
            }, {
               name : 'serid'
            }, {
               name : 'channelname'
            }, {
               name : 'x'
            }, {
               name : 'y'
            }, {
               name : 'note'
            }]);
            var nodeID = Ext.getCmp('tree').getSelectionModel().getSelectedNode().id;// 获得树节点
            var temp;
            Ext.Ajax.request({
               url     : 'repeaterInforamtion1.ered?reqCode=getAllFields&id=' + nodeID,
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  temp = new record(json); // 装载弹出框数据
                  var window = ModStation.createWindow(temp, nodeID);
                  window.show();
               }
            });

         }
      }, {
         text    : '站点查询',
         handler : function() {
            var window = queryRepeater.createWindow();
            window.show();
         }
      }]

   });

   var tree = new Ext.tree.TreePanel({
      title    : '站点信息',
      region : 'center',
      //width    : 200,
      id       : 'tree',
      loadMask : true,
      // layout : 'fit',
      loader   : new Ext.tree.TreeLoader({
         dataUrl : 'repeaterTree.ered?reqCode=createTree'
      })
   });

   var root = new Ext.tree.AsyncTreeNode({
      text : '站点信息',
      id   : '0'
   });

   tree.setRootNode(root);

   tree.on('contextmenu', function(node, e) {
      e.preventDefault();
      node.select();
      contextMenu.showAt(e.getXY());
   });

   var panel = new Ext.Panel({
   	renderTo:'tree',
      items  : [tree],
      height : 500,
      layout : 'border',
      autoScroll : true
   });
   // panel.render('tree');

   return panel;
};
