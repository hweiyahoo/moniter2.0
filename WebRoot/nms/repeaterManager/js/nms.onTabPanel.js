Ext.namespace("TabPanelOn");

TabPanelOn.createTabPanel = function() {

   var contextMenu = new Ext.menu.Menu({
      id    : 'tabPanelContextMenu',
      items : [{
         text    : '基本参数',
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
         text    : '新增直放站',
         handler : function() {
            var window = AddRepeater.createWindow();
            window.show();
         }
      }, '-', {
         text    : '设置站点编号',
         handler : function() {
            var window = SetRepeaterID.createWindow();
            window.show();
         }
      }, {
         text    : '读监控量列表',
         handler : function() {
            var window = monitorParamList.createWindow();
            window.show();
         }
      }, {
         text    : '监控板初始化',
         handler : function() {
            var window = initMonitorboard.createWindow();
            window.show();
         }
      }
      // , {
      // text : '设置上报',
      // handler:function(){
      // var window=setReporting.createWindow();
      // window.show();
      // }
      // }
      ]
   });

   var tabPanel = new Ext.TabPanel({
      activeTab      : 0,
      deferredRender : false,
      height         : 500,
      bbar           : new Ext.Toolbar([new Ext.form.Checkbox({
         id       : 'checkFlag',
         name     : 'checkFlag',
         boxLabel : '操作允许'
      }), '-', {
         text    : '实时查询',
         id      : 'query',
         iconCls : 'page_findIcon',
         handler : function() {
            if (Ext.getCmp('checkFlag').getValue() != true) {
               Ext.Msg.alert('提示', '请打开操作允许开关!');
            }
            else {
               var selectModel = Ext.getCmp('tree').getSelectionModel();
               var selectNode = selectModel.getSelectedNode();
               if (Ext.isEmpty(selectNode)) {
                  Ext.Msg.alert('提示', '没有选中任何节点!');
               }
               var repeaterId = selectNode.id;// 获得repeaterId
               Ext.Ajax.request({// 判断站点是否连接成功
                  url     : './repeaterInforamtion1.ered?reqCode=queryConnFlag',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     if (json.connectflag == '0') {// 未连接
                        var queryWindow = openConnection.createWindow();
                        queryWindow.show();
                     }
                     else {// 连接成功
                        var activeTabPanel = tabPanel.getActiveTab();
                        // ------------
                        var rows = activeTabPanel.getSelectionModel().getSelections();
                        var paramcode = jsArray2JsString(rows, 'paramcode');
                        // ------------
                        if (paramcode != null && paramcode != '') {
                           var tempStore = activeTabPanel.getStore();
                           // var paramcode =
                           // tempStore.getAt(0).get('paramcode');
                           saveRow(tempStore);// 保存本地值到数据库
                           Ext.Ajax.request({
                              url     : './repeaterInforamtion1.ered?reqCode=sendCommondReturn',
                              success : function(res) {
                                 var json2 = Ext.decode(res.responseText);
                                 var themsg = json2.msg;
                                 tempStore.reload();// 刷新页面的远程值
                                 alert(themsg);
                              },
                              params  : {
                                 repeaterid : repeaterId,
                                 pcmd       : '02',
                                 paramcode  : paramcode
                              }
                           });
                        }
                        else {
                           Ext.Msg.alert('提示', '请选中监控标识号!');
                        }

                     }
                  },
                  params  : {
                     repeaterid : repeaterId
                  }
               });
            }
         }
      }, '-', {
         text    : '实时设置',
         id      : 'setup',
         iconCls : 'page_settingIcon',
         handler : function() {
            if (Ext.getCmp('checkFlag').getValue() != true) {
               Ext.Msg.alert('提示', '请打开操作允许开关!');
            }
            else {
               var selectModel = Ext.getCmp('tree').getSelectionModel();
               var selectNode = selectModel.getSelectedNode();
               if (Ext.isEmpty(selectNode)) {
                  Ext.Msg.alert('提示', '没有选中任何节点!');
               }
               var repeaterId = selectNode.id;// 获得repeaterId
               Ext.Ajax.request({
                  url     : './repeaterInforamtion1.ered?reqCode=queryConnFlag',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     if (json.connectflag == '0') {
                        var setWindow = openConnection.createWindow();
                        setWindow.show();
                     }
                     else {
                        var activeTabPanel = tabPanel.getActiveTab();
                        // ------------
                        var rows = activeTabPanel.getSelectionModel().getSelections();
                        var paramcode = jsArray2JsString(rows, 'paramcode');
                        if (paramcode != null && paramcode != '') {
                           // ------------
                           var tempStore = activeTabPanel.getStore();
                           // var paramcode =
                           // tempStore.getAt(0).get('paramcode');
                           saveRow(tempStore);

                           Ext.Ajax.request({
                              url     : './repeaterInforamtion1.ered?reqCode=sendCommondReturn',
                              success : function(res) {
                                 alert(res.responseText);
                                 var json2 = Ext.decode(res.responseText);
                                 Ext.Msg.alert(josn2.msg);
                              },
                              params  : {
                                 repeaterid : repeaterId,
                                 pcmd       : '03',
                                 paramcode  : paramcode
                              }
                           });
                        }
                        else {
                           Ext.Msg.alert('提示', '请选中监控标识号!');
                        }

                     }
                  },
                  params  : {
                     repeaterid : repeaterId
                  }
               });
            }
         }
      }])
   });

   tabPanel.render('panel1');

   var statusSm = new Ext.grid.CheckboxSelectionModel({
      handleMouseDown : Ext.emptyFn()
   }, {
      singleSelect : true
   });

   var parameterSm = new Ext.grid.CheckboxSelectionModel({
      handleMouseDown : Ext.emptyFn()
   }, {
      singleSelect : true
   });

   var editSm = new Ext.grid.CheckboxSelectionModel({
      handleMouseDown : Ext.emptyFn()
   }, {
      singleSelect : true
   });

   var comboSm = new Ext.grid.CheckboxSelectionModel({
      handleMouseDown : Ext.emptyFn()
   }, {
      singleSelect : true
   });

   var comboData = [['0', '禁止'], ['1', '允许']];

   var comboBoxData = new Ext.data.Store({
      proxy  : new Ext.data.MemoryProxy(comboData),
      reader : new Ext.data.ArrayReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   comboBoxData.load();

   var comboBox = new Ext.form.ComboBox({
      store         : comboBoxData,
      emptyText     : '请选择',
      valueField    : 'value',
      displayField  : 'text',
      mode          : 'local',
      triggerAction : 'all'
   });

   var statusCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), statusSm, {
      header    : '监控对象标号',
      dataIndex : 'paramcode',
      hidden    : true
   }, {
      header    : '参数名称',
      dataIndex : 'paramname'
      // }, {
   // header : '当前状态',
   // dataIndex : 'val1'
}  , {
      header    : '告警使能',
      dataIndex : 'val1',
      editor    : new Ext.grid.GridEditor(comboBox),
      renderer  : function(value) {
         if (value == 0)
            return '禁止';
         else
            return '允许';
      }
   }, {
      header    : '远程值',
      dataIndex : 'rval1'
   }, {
      header    : '更新时间',
      dataIndex : 'uptime'
   }]);

   var parameterCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), parameterSm, {
      header    : '监控对象标号',
      dataIndex : 'paramcode',
      hidden    : true
   }, {
      header    : '参数名称',
      dataIndex : 'paramname'
   }, {
      header    : '本地值',
      dataIndex : 'val1',
      editor    : new Ext.grid.GridEditor(new Ext.form.TextField()),
      renderer  : function(value) {
         return value;
      }
   }, {
      header    : '远程值',
      dataIndex : 'rval1'
   }, {
      header    : '更新时间',
      dataIndex : 'uptime'
   }]);

   var editCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), editSm, {
      header    : '监控对象标号',
      dataIndex : 'paramcode',
      hidden    : true
   }, {
      header    : '参数名称',
      dataIndex : 'paramname'
   }, {
      header    : '本地值',
      dataIndex : 'val1',
      editor    : new Ext.grid.GridEditor(new Ext.form.TextField()),
      renderer  : function(value) {
         return value;
      }
   }, {
      header    : '单位',
      dataIndex : 'dataunit'
   }, {
      header    : '远程值',
      dataIndex : 'rval1'
   }, {
      header    : '更新时间',
      dataIndex : 'uptime'
   }]);

   var comboCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), editSm, {
      header    : '监控对象标号',
      dataIndex : 'paramcode',
      hidden    : true
   }, {
      header    : '参数名称',
      dataIndex : 'paramname'
   }, {
      header    : '本地值',
      dataIndex : 'val1',
      editor    : new Ext.grid.GridEditor(combo1),// 定义在 nms.store.js中
      renderer  : function(value) {
         // alert(store.getById(value));
         // return value;
         var text = null;
         store.each(function(record) {
            if (record.get('value') == value) {
               text = record.get('text');
               // return;
            }
         });
         return text;
      }
   }, {
      header    : '远程值',
      dataIndex : 'rval1'
   }, {
      header    : '更新时间',
      dataIndex : 'uptime'
   }]);

   var statusGrid = new Ext.grid.EditorGridPanel({
      enableColumnMove : false,
      cm               : statusCm,
      sm               : statusSm,
      store            : statusStore,
      title            : '状态信息',
      clicksToEdit     : 1
   });

   statusGrid.on('contextmenu', function(e) {
      e.preventDefault();
      contextMenu.showAt(e.getXY());
   });

   var parameterGrid = new Ext.grid.GridPanel({
      enableColumnMove : false,
      cm               : parameterCm,
      sm               : parameterSm,
      store            : parameterStore,// 定义在nms.store.js中
      title            : '参数信息'
   });

   parameterGrid.on('contextmenu', function(e) {
      e.preventDefault();
      contextMenu.showAt(e.getXY());
   });

   var editGrid = new Ext.grid.EditorGridPanel({
      enableColumnMove : false,
      cm               : editCm,
      sm               : editSm,
      store            : editStore,
      clicksToEdit     : 1,
      title            : '基本信息'
   });
   editGrid.on('contextmenu', function(e) {
      e.preventDefault();
      contextMenu.showAt(e.getXY());
   });

   var comboGrid = new Ext.grid.EditorGridPanel({
      enableColumnMove : false,
      cm               : comboCm,
      sm               : comboSm,
      store            : comboStore,
      clicksToEdit     : 1,
      title            : '可变信息',
      listeners        : {
         beforeedit : function(e) {
            // alert(e.record.get('reflagtype'));
            // e.cancel=true;
            store.load({
               params   : {
                  typeid : e.record.get('reflagtype')
               },
               callback : function() {
                  combo1.setValue(e.value);
               }
            });
         },
         afteredit  : function(e) {
            store.load({
               params   : {
                  typeid : e.record.get('reflagtype')
               },
               callback : function() {
                  combo1.setValue(e.value);
               }
            });
         }

      }
   });

   // 保存
   function saveRow(activeTempStore) {
      var m = activeTempStore.modified.slice(0); // 获取修改过的record数组对象
      if (Ext.isEmpty(m)) {
         Ext.MessageBox.alert('提示', '没有数据需要保存!');
         return;
      }
      var jsonArray = [];
      // 将record数组对象转换为简单Json数组对象
      Ext.each(m, function(item) {
         jsonArray.push(item.data);
         // jsonArray.push('{ub_task_id:'+item.get("ub_task_id"));
   }  );
      Ext.Ajax.request({
         url     : './repeaterInforamtion1.ered?reqCode=updateVal1Item',
         success : function(response) {
            var resultArray = Ext.util.JSON.decode(response.responseText);
            Ext.Msg.alert('提示', resultArray.msg);
            activeTempStore.reload();
         },
         failure : function(response) {
            Ext.MessageBox.alert('提示', '系统繁忙，请稍后再试');
         },
         params  : {
            dirtydata : Ext.encode(jsonArray)
         }
      });
   }

   comboGrid.on('contextmenu', function(e) {
      e.preventDefault();
      contextMenu.showAt(e.getXY());
   });

   tabPanel.add(statusGrid);
   tabPanel.activate(statusGrid);

   tabPanel.add(parameterGrid);
   tabPanel.add(editGrid);
   tabPanel.add(comboGrid)
   return tabPanel;

};