Ext.namespace("SetRepeaterID");

SetRepeaterID.createWindow = function() {
   var nodeID = Ext.getCmp('tree').getSelectionModel().getSelectedNode().id;
   Ext.Ajax.request({
      url     : 'repeaterInforamtion1.ered?reqCode=getAllFields&id=' + nodeID,
      success : function(response) {
         var json = Ext.decode(response.responseText);
         var stationid = json.stationid;
         var statsubid = json.statsubid;
         Ext.getCmp('stationid').setValue(stationid);
         Ext.getCmp('statsubid').setValue(statsubid);
      }
   });

   var data = new Array();
   for (var i = 0; i < 256; i++) {
      var temp = complete.complete((i.toString(16)).toUpperCase(), '0', 2);
      data[i] = new Array(temp, temp);// 赋值，从00-FF
   }
   var deviceStore = new Ext.data.Store({
      proxy  : new Ext.data.MemoryProxy(data),
      reader : new Ext.data.ArrayReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   deviceStore.load();

   var form = new Ext.form.FormPanel({
      labelAlign  : 'right',
      region      : 'center',
      labelWidth  : 100,
      buttonAlign : 'center',
      width       : 350,
      items       : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            items       : [{
               xtype      : 'textfield',
               fieldLabel : '新直放站编号',
               id         : 'stationid'
            }, {
               xtype         : 'combo',
               fieldLabel    : '新设备编号',
               hiddenName    : 'statsub-id',
               id            : 'statsubid',
               store         : deviceStore,
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text'
            }]
         }]
      }],
      buttons     : [{
         text    : '确定',
         handler : function() {
            alert(Ext.getCmp('stationid').getValue());
            Ext.Ajax.request({
               url    : 'repeaterCount.ered?reqCode=setStationid',
               params : {
                  repeaterid : nodeID,
                  stationid  : Ext.getCmp('stationid').getValue(),
                  statsubid  : Ext.getCmp('statsubid').getValue()
               }
            });
         }
      }, {
         text    : '取消',
         handler : function() {
            setRepeaterID.close();
         }
      }]
   });
   var setRepeaterID = new Ext.Window({
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '设置远程直放站编号', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 400, // 窗口宽度
      // autoHeight : true,
      height        : 150, // 窗口高度
      // tbar : tb, // 工具栏
      closable      : true, // 是否可关闭
      collapsible   : true,
      titleCollapse : true,
      resizable     : true,
      maximizable   : true, // 设置是否可以最大化
      modal         : true,
      border        : false, // 边框线设置
      pageY         : 120, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
      constrain     : true,
      items         : [form],
      // 设置窗口是否可以溢出父容器
      buttonAlign   : 'right'
   });
   return setRepeaterID;
};