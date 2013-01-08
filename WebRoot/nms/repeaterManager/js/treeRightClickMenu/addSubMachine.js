Ext.namespace("addSubMachine");

addSubMachine.createWindow = function(id) {
   var deviceTypeStore = new Ext.data.Store({

      proxy  : new Ext.data.HttpProxy({
         url : 'deviceStore.ered?reqCode=getDevices'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   deviceTypeStore.load({
      params : {
         repeaterid : id
      }
   });

   // 通讯口 deviceTypeCombox
   var deviceTypeCombox = new Ext.form.ComboBox({
      fieldLabel    : '设备类型', // 标签
      name          : 'deviceTypeText',
      id            : 'deviceType-id',
      hiddenName    : 'deviceType',
      triggerAction : 'all',
      mode          : 'local',
      store         : deviceTypeStore,
      valueField    : 'value',
      displayField  : 'text',
      editable      : false,
      emptyText     : '请选择'
   });

   var deviceTypeForm = new Ext.form.FormPanel({
      region      : 'center',
      // renderTo : 'bb', // 和JSP页面的DIV元素ID对应
      collapsible : false,
      border      : true,
      autoScroll  : true,
      labelWidth  : 60, // 标签宽度
      labelAlign  : 'right', // 标签对齐方式
      bodyStyle   : 'padding:5 5 0', // 表单元素和表单面板的边距
      buttonAlign : 'center',
      height      : 250,
      items       : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            border      : false,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            items       : [deviceTypeCombox]
         }]
      }],
      buttons     : [{
         text    : '确定',
         width   : 40,
         handler : function() {

            Ext.Ajax.request({
               url     : 'saveRepeater.ered?reqCode=addSub',
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  if (json.success) {
                        Ext.Msg.alert('信息', json.msg);
                        deviceTypeWindow.close();
                        Ext.getCmp('tree').getRootNode().reload();
                  }
                  else {
                     var Result = Ext.decode(response.responseText);
                     Ext.Msg.alert('信息error', Result.msg);
                     // Ext.Msg.alert('错误', "删除失败");
                  }	
               },
               params  : {
                  parentrepid : id,
                  devicetype  : Ext.getCmp('deviceType-id').getValue()

               }
            });
         }
      }, {
         text    : '取消',
         width   : 40,
         handler : function() {
            deviceTypeWindow.close();
         }
      }]
   });
   var deviceTypeWindow = new Ext.Window({
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '选择设备类型', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 300, // 窗口宽度
      height        : 120, // 窗口高度
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
      items         : [deviceTypeForm],
      // 设置窗口是否可以溢出父容器
      buttonAlign   : 'center'
   });

   return deviceTypeWindow;
}