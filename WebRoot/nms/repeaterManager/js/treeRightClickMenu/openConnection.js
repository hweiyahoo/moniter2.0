Ext.namespace("openConnection");

openConnection.createWindow = function() {
   var tel;
   var nodeId = Ext.getCmp('tree').getSelectionModel().getSelectedNode().id;
   Ext.Ajax.request({
      url     : 'repeaterInformation.ered?reqCode=information',
      success : function(response) {
         var json = Ext.decode(response.responseText);
         tel = json.tel;
         channelcode = json.channelcode;
         channelname = json.channelname;
         comPortCombo.setValue(channelname);
         Ext.getCmp('connMethod').setValue(channelcode);
         Ext.getCmp('connMethod').setDisabled(false);
         Ext.getCmp('stattel').setValue(tel);
      },
      params  : {
         repeaterid : nodeId
      }
   });

   var comportdataStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=loadCommSerialPorts'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var comPortCombo = new Ext.form.ComboBox({
      hiddenName    : 'comport',
      name          : 'comportText',
      mode          : 'remote',
      store         : comportdataStore,
      valueField    : 'value',
      displayField  : 'text',
      fieldLabel    : 'COM口',
      labelStyle    : 'color:A62017;',
      emptyText     : '请选择COM口...',
      disabled      : true,
      editable      : false,
      typeAhead     : true,
      triggerAction : 'all',
      lazyRender    : true,
      anchor        : '80%'// 宽度百分比
   });

   var telField = new Ext.form.TextField({
      fieldLabel : '站点电话',
      name       : 'stattel',
      id         : 'stattel',
      disabled   : true
   });

   var form = new Ext.form.FormPanel({
      labelAlign  : 'right',
      region      : 'center',
      labelWidth  : 100,
      buttonAlign : 'center',
      width       : 400,
      items       : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype         : 'combo',
               fieldLabel    : '连接方式',
               store         : connTypeStore,
               id            : 'connMethod',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               anchor        : '80%',
               disabled      : false,
               editable      : false,
               listeners     : {
                  select : function(cb) {
                     var id = cb.getValue();
                     if (id == '01') {
                        comPortCombo.setDisabled(false);
                        telField.setDisabled(true);
                     }
                     else if (id == '02' || id == '03' || id == '04') {
                        comPortCombo.setDisabled(false);
                        telField.setDisabled(false);
                     }
                     else if (id == '06' || id == '13') {
                        comPortCombo.setDisabled(true);
                        telField.setDisabled(true);
                     }
                  },
                  enable : function(cb) {
                     var id = cb.getValue();
                     if (id == '01') {
                        comPortCombo.setDisabled(false);
                        telField.setDisabled(true);
                     }
                     else if (id == '02' || id == '03' || id == '04') {
                        comPortCombo.setDisabled(false);
                        telField.setDisabled(false);
                     }
                     else if (id == '06' || id == '13') {
                        comPortCombo.setDisabled(true);
                        telField.setDisabled(true);
                     }
                  }
               }
            }, comPortCombo]
         }]
      }],
      buttons     : [{
         text    : '确定',
         width   : 40,
         handler : function() {
            var selectModel = Ext.getCmp('tree').getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            if (Ext.isEmpty(selectNode)) {
               Ext.Msg.alert('提示', '没有选中任何节点!');
            }
            var nodeId = selectNode.id;
            var nodeInfo = formatNodeId(nodeId);
            var repeaterId = nodeInfo.id;
            Ext.Ajax.request({
               url     : './btnConnectClick.ered?reqCode=connBtnConfirm',
               success : function(res) {
                  var json = Ext.decode(res.responseText);
                  Ext.Msg.alert(json.msg);
                  connectionWindow.close();
                  selectNode.parentNode.reload();
               },
               params  : {
                  repeaterid : repeaterId,
                  conntype   : Ext.getCmp('connMethod').getValue(),
                  comm       : comPortCombo.getValue()
                  // tel : Ext.getCmp('stattel').getValue()
               }
            });
         }
      }, {
         text    : '取消',
         width   : 40,
         handler : function() {
            connectionWindow.close();
         }
      }]
   });

   var connectionWindow = new Ext.Window({
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '通讯连接', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 400, // 窗口宽度
      height        : 160, // 窗口高度
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
   return connectionWindow;
}