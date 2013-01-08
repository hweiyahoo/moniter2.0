Ext.namespace("queryRepeater");

queryRepeater.createWindow = function() {
   var deviceStore = new Ext.data.Store({ // 设备类型store
      proxy  : new Ext.data.HttpProxy({
         url : 'deviceStore.ered?reqCode=device'
      }),
      reader : new Ext.data.ArrayReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var cityStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=site'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   })

   var repeaterCm = new Ext.grid.ColumnModel([{
      header    : '直放站ID号',
      dataIndex : 'repeaterid',
      width     : 100
   }, {
      header    : '直放站编号',
      dataIndex : 'stationid',
      width     : 100
   }, {
      header    : '设备编号',
      dataIndex : 'statsubid',
      width     : 80
   }, {
      header    : '直放站名称',
      dataIndex : 'stationname',
      width     : 150
   }, {
      header    : '地点',
      dataIndex : 'site',
      width     : 150
   }, {
      header    : '站点电话',
      dataIndex : 'stattel',
      width     : 100
   }, {
      header    : '站点时间',
      dataIndex : 'statustime',
      width     : 80
   }, {
      header    : '备注',
      dataIndex : 'note',
      width     : 300
   }]);

   var repeaterRecord = new Ext.data.Record.create([{
      name : 'repeaterid'
   }, {
      name : 'stationid'
   }, {
      name : 'statsubid'
   }, {
      name : 'stationname'
   }, {
      name : 'site'
   }, {
      name : 'stattel'
   }, {
      name : 'statustime'
   }, {
      name : 'note'
   }]);

   var repeaterStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : 'saveRepeater.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, repeaterRecord)
   });

   var grid = new Ext.grid.GridPanel({
      enableColumnMove : false,
      cm               : repeaterCm,
      store            : repeaterStore,
      height           : 350
   });

   var form = new Ext.form.FormPanel({
      labelAlign  : 'right',
      region      : 'center',
      labelWidth  : 100,
      buttonAlign : 'center',
      width       : 750,
      items       : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype         : 'combo',
               fieldLabel    : '省份',
               store         : siteStore,
               id            : 'province-id',
               hiddenName    : 'provinceName',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               listeners     : {
                  select : function(cb) {
                     var parent = cb.getValue();
                     Ext.getCmp('city-id').setValue("");
                     cityStore.removeAll();
                     cityStore.load({
                        params : {
                           parentsite : parent
                        }
                     });
                  }
               }
            }]
         }, {
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype         : 'combo',
               fieldLabel    : '城市',
               store         : cityStore,
               id            : 'city-id',
               hiddenName    : 'cityName',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text'
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype         : 'combo',
               fieldLabel    : '协议类型',
               store         : protocolStore,
               id            : 'protocol-id',
               hiddenName    : 'protocolName',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               listeners     : {
                  select : function(cb) {
                     var proto = cb.getValue();
                     Ext.getCmp('device-id').setValue("");
                     deviceStore.removeAll();
                     deviceStore.load({
                        params : {
                           protype : proto
                        }
                     });
                  }
               }
            }]
         }, {
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               columnWidth : .50,
               layout      : 'form',
               border      : false,
               items       : [{
                  xtype         : 'combo',
                  fieldLabel    : '设备类型',
                  store         : deviceStore,
                  id            : 'device-id',
                  hiddenName    : 'deviceName',
                  mode          : 'local',
                  triggerAction : 'all',
                  valueField    : 'value',
                  displayField  : 'text'
               }]
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype      : 'textfield',
               fieldLabel : '站点电话',
               id         : 'stattel'
            }]
         }]
      }, grid],
      buttons     : [{
         text    : '清空',
         handler : function() {
            form.getForm().reset();
         }
      }, {
         text    : '查找',
         handler : function() {
            repeaterStore.load({
               params : {
                  province : Ext.getCmp('province-id').getValue(),
                  city     : Ext.getCmp('city-id').getValue(),
                  protocol : Ext.getCmp('protocol-id').getValue(),
                  device   : Ext.getCmp('device-id').getValue(),
                  stattel  : Ext.getCmp('stattel').getValue(),
                  start    : 0,
                  limit    : 10000
               }
            });
         }
      }, {
         text : '选定'
      }, {
         text : '导出'
      }, {
         text    : '关闭',
         handler : function() {
            queryWindow.close();
         }
      }]
   });

   var queryWindow = new Ext.Window({
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '站点查询', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 800, // 窗口宽度
      height        : 500, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true,
      titleCollapse : true,
      resizable     : true,
      maximizable   : true, // 设置是否可以最大化
      modal         : true, // 模态窗口
      border        : false, // 边框线设置
      pageY         : 120, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
      constrain     : true,
      items         : [form],
      // 设置窗口是否可以溢出父容器
      buttonAlign   : 'center'
   });

   return queryWindow;
};