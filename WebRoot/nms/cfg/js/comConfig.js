/**
 * 通讯参数设置
 * 
 * @author gezhidong
 * @since 2011-07-28
 */

Ext.onReady(function() {

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
      name          : 'comport',
      mode          : 'remote',
      store         : comportdataStore,
      valueField    : 'value',
      displayField  : 'text',
      fieldLabel    : 'COM口',
      labelStyle    : 'color:A62017;',
      emptyText     : '请选择COM口...',
      editable      : false,
      typeAhead     : true,
      triggerAction : 'all',
      lazyRender    : true,
      anchor        : '100%'// 宽度百分比
   });

   var baudRateCombo = new Ext.form.ComboBox({
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['9600', 'br9600'], ['14400', 'br14400'], ['19200', 'br19200'],
                   ['38400', 'br38400'], ['56000', 'br56000'], ['57600', 'br57600'],
                   ['115200', 'br115200'], ['128000', 'br128000'], ['256000', 'br256000']]
      }),
      mode           : 'local',
      hiddenName     : 'baudrate',
      name           : 'baudrate',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '波特率',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择波特率...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   // ---
   var dataBitsCombo = new Ext.form.ComboBox({
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['5', 'DATABITS_5'], ['6', 'DATABITS_6'], ['7', 'DATABITS_7'],
                   ['8', 'DATABITS_8']]
      }),
      mode           : 'local',
      hiddenName     : 'databits',
      name           : 'databits',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '数据位',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择数据位...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

    // ---
   var parityCombo = new Ext.form.ComboBox({
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['0', 'paNone'], ['1', 'paOdd'], ['2', 'paEven'], ['3', 'paMark'],
                   ['4', 'paSpace']]
      }),
      mode           : 'local',
      hiddenName     : 'parity',
      name           : 'parity',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '奇偶校验',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择奇偶校验...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   // ---
   var stopBitsCombo = new Ext.form.ComboBox({
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['1', 'STOPBITS_1'], ['2', 'STOPBITS_2'], ['1.5', 'STOPBITS_1_5']]
      }),
      mode           : 'local',
      hiddenName     : 'stopbits',
      name           : 'stopbits',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '停止位',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择停止位...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   // ---
   var flowControlInCombo = new Ext.form.ComboBox({
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['0', 'fcNone'], ['1', 'fcCTS_IN'], ['2', 'fcCTS_OUT'], ['4', 'fcXOFF_IN'],
                   ['8', 'fcOXFF_OUT']]
      }),
      mode           : 'local',
      hiddenName     : 'flowcontrolin',
      name           : 'flowcontrolin',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '接收流控制',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择流控制...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   // ---
   var flowControlOutCombo = new Ext.form.ComboBox({
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['0', 'fcNone'], ['1', 'fcCTS_IN'], ['2', 'fcCTS_OUT'], ['4', 'fcXOFF_IN'],
                   ['8', 'fcXOFF_OUT']]
      }),
      mode           : 'local',
      hiddenName     : 'flowcontrolout',
      name           : 'flowcontrolout',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '发送流控制',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择流控制...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var formPanel;
   var comConfigWindow;

   formPanel = new Ext.form.FormPanel({
      region     : 'center',
      labelAlign : 'right',
      frame      : true,
      id         : 'configForm',
      name       : 'configForm',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [baudRateCombo, dataBitsCombo, parityCombo, stopBitsCombo,
            flowControlInCombo, flowControlOutCombo, {
               name  : 'objectid',
               xtype : 'hidden',
               value : 'comminfoid'
            }]
         }]
      }]
   });

   comConfigWindow = new Ext.Window({
      layout        : 'fit',
      width         : 300, // 窗口宽度
      height        : 270, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '通讯参数设置',
      iconCls       : 'configIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 650 / 2, // 页面定位X坐标
      items         : [formPanel],
      listeners     : {
         'hide' : {
            fn : function() {

            }
         }
      },
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (comConfigWindow.getComponent('configForm').form.isValid()) {
               comConfigWindow.getComponent('configForm').form.submit({
                  url       : './comconfig.ered?reqCode=setComConfig',
                  waitTitle : '提示',
                  method    : 'POST',
                  waitMsg   : '正在处理数据,请稍候...',
                  success   : function(form, action) {
                     Ext.MessageBox.alert('提示', action.result.msg);
                  },
                  failure   : function(form, action) {
                     var msg = action.result.msg;
                     Ext.MessageBox.alert('提示', '设置失败:<br>' + msg);
                  }
               });
            }
            else {
               // 表单验证失败
               Ext.MessageBox.alert('提示', '表单验证失败！<br>请确认表单是否正确填写！');
            }
         }
      }]
   });

   comConfigWindow.show();

   // 加载form
   // formPanel.form.findField('comport').setValue(comport);
   formPanel.form.findField('baudrate').setValue(baudrate);
   formPanel.form.findField('parity').setValue(parity);
   formPanel.form.findField('stopbits').setValue(stopbits);
   formPanel.form.findField('flowcontrolin').setValue(flowcontrolin);
   formPanel.form.findField('flowcontrolout').setValue(flowcontrolout);
   formPanel.form.findField('databits').setValue(databits);
});