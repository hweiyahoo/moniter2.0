Ext.namespace("AddRepeater");

// linxingyu

AddRepeater.createWindow = function() {
   var id = '00000001';

   Ext.QuickTips.init();

   // var protocolStore = new Ext.data.Store({ // 协议store
   // proxy : new Ext.data.HttpProxy({
   // url : 'protocol.ered?reqCode=protocol'
   // }),
   // reader : new Ext.data.ArrayReader({}, [{
   // name : 'value'
   // }, {
   // name : 'text'
   // }])
   // });
   //
   // protocolStore.load({
   // params : {
   // optype : 'qry'
   // }
   // });
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
               fieldLabel    : '协议类型',
               store         : protocolStore,
               editable      : false,
               hiddenName    : 'protype',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               allowBlank    : false,
               labelStyle    : 'color:A62017;',
               listeners     : {
                  select : function(cb) {
                     var proto = cb.getValue();
                     Ext.getCmp('mainDevice-id').setValue("");
                     Ext.getCmp('sonDevice-id').setValue("");
                     deviceStore.removeAll();
                     deviceStore.load({
                        params : {
                           pollployid : id,
                           protype    : proto
                        }
                     });
                  }
               }
            }]
         }, {
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [new Ext.form.ComboBox({
               fieldLabel    : '主机设备类型',
               id            : 'mainDevice-id',
               hiddenName    : 'mainDevice',
               editable      : false,
               store         : deviceStore,
               allowBlank    : false,
               labelStyle    : 'color:A62017;',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text'
            })]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype : 'hidden'
            }]
         }, {
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [new Ext.form.ComboBox({
               fieldLabel    : '子机设备类型',
               id            : 'sonDevice-id',
               hiddenName    : 'sonDevice',
               store         : deviceStore,
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               editable      : false
            })]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [new Ext.form.ComboBox({
               fieldLabel    : '省份',
               store         : siteStore,
               hiddenName    : 'province',
               id            : 'province-id',
               mode          : 'local',
               editable      : false,
               triggerAction : 'all',
               allowBlank    : false,
               labelStyle    : 'color:A62017;',
               valueField    : 'value',
               displayField  : 'text',
               hiddenName    : 'province',
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
                     id = parent + id.substring(2, 8);// 设置直放站编号
                     Ext.getCmp('repeaterID').setValue(id);
                  }
               }
            })]
         }, {
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [new Ext.form.ComboBox({
               fieldLabel    : '地市',
               id            : 'city-id',
               hiddenName    : 'city',
               store         : cityStore,
               allowBlank    : false,
               editable      : false,
               labelStyle    : 'color:A62017;',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               hiddenName    : 'city',
               listeners     : {
                  select : function(cb) {
                     var city = cb.getValue();
                     id = id.substring(0, 2) + city + '0001';// 设置直放站编号
                     // Ext.getCmp('repeaterID').setValue(id);
                     Ext.Ajax.request({// 获取当前省市下已有多少个主机
                        url     : 'repeaterCount.ered?reqCode=getCount',
                        success : function(response) {
                           var json = Ext.decode(response.responseText);
                           var count = json.num;
                           id = id.substring(0, 4) + count;
                           Ext.getCmp('repeaterID').setValue(id);
                        },
                        params  : {
                           province : Ext.getCmp('province-id').getValue(),
                           city     : city
                        }
                     });
                  }
               }
            })]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [new Ext.form.TextField({
               id         : 'repeaterID',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               fieldLabel : '直放站编号',
               readOnly   : true,
               name       : 'stationid'
            })]
         }, {
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [new Ext.form.NumberField({
               fieldLabel : '子机个数(0-4)',
               width      : 100,
               name       : 'child',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               minValue   : 0,
               maxValue   : 4,
               maskRe     : /\d/
            })]
         }]
      }],
      buttons     : [{
         text    : '确定',
         handler : function() {
            if (!form.getForm().isValid()) return;
            var proText = Ext.getCmp('province-id').getRawValue();
            var cityText = Ext.getCmp('city-id').getRawValue();
            Ext.lib.Ajax.request('POST', 'saveRepeater.ered?reqCode=insertItem', {
               success : function(resp) {
                  var json = Ext.decode(resp.responseText);
                  var success = json.success;
                  if (success == true) {
                     Ext.getCmp('tree').getRootNode().reload();
                     addRepeaterWindow.close();
                  }
                  else {
					Ext.Msg.alert('提示',json.msg);
                  }
               },
               failure : function() {
                  Ext.Msg.alert('错误', "保存失败");
               }
            }, form.getForm().getValues(true) + '&proText=' + proText + '&cityText=' + cityText
               + '&loginuserid=' + parent.userid);
         }
      }, {
         text    : '取消',
         handler : function() {
            addRepeaterWindow.close();
         }
      }]
   });

   var addRepeaterWindow = new Ext.Window({
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '新增直放站', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 800, // 窗口宽度
      height        : 200, // 窗口高度
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
   return addRepeaterWindow;

};