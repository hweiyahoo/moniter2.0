Ext.namespace("setReporting");

setReporting.createWindow = function() {

   var data = [['开始上报', '1'], ['巡检上报', '2'], ['故障修复上报', '3'], ['配置变更上报', '4']];
   var methodStore = new Ext.data.Store({
      proxy  : new Ext.data.MemoryProxy(data),
      reader : new Ext.data.ArrayReader({}, [{
         name : 'text'
      }, {
         name : 'value'
      }])
   });

   methodStore.load();

   var password = new Ext.form.TextField({
      fieldLabel : '超级密码',
      minLength  : 6,
      maxLength  : 30,
      inputType  : 'password', // 密码
      allowBlank : false
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
               id            : 'method',
               fieldLabel    : '上报方式',
               hiddenName    : 'methodName',
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               store         : methodStore,
               displayField  : 'text'
            }, password]
         }]
      }]
   });

   var reportWindow = new Ext.Window({
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '新增直放站', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 400, // 窗口宽度
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
   return reportWindow;
};