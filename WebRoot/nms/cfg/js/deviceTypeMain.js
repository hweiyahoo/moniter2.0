/**
 * 设备类型管理
 * 
 * @author gezhidong
 * @since 2011-07-22
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : '设备ID',
      width     : 60,
      dataIndex : 'devid' // 与Store模型对应
   }, {
      header    : '协议类型编号',
      dataIndex : 'protype',
      hidden    : true
   }, {
      header    : '协议类型',
      width     : 130,
      dataIndex : 'proname'
   }, {
      header    : '设备类型编号',
      width     : 80,
      dataIndex : 'devicetype'
   }, {
      header    : '设备类型名称',
      width     : 180,
      dataIndex : 'hardname'
   }, {
      id        : 'note',
      header    : '备注',
      dataIndex : 'note'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './devicetype.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'devid'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'devicetype'
      }, {
         name : 'hardname'
      }, {
         name : 'note'
      }])
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = {
         protype : Ext.getCmp('protype').getValue()
      };
   });

   var pagesize_combo = new Ext.form.ComboBox({
      name          : 'pagesize',
      hiddenName    : 'pagesize',
      typeAhead     : true,
      triggerAction : 'all',
      lazyRender    : true,
      mode          : 'local',
      store         : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'], [100, '100条/页'], [250, '250条/页'],
                   [500, '500条/页']]
      }),
      valueField    : 'value',
      displayField  : 'text',
      value         : '20',
      editable      : false,
      width         : 85
   });
   var number = parseInt(pagesize_combo.getValue());
   pagesize_combo.on("select", function(comboBox) {
      bbar.pageSize = parseInt(comboBox.getValue());
      number = parseInt(comboBox.getValue());
      store.reload({
         params : {
            start : 0,
            limit : bbar.pageSize
         }
      });
   });

   var bbar = new Ext.PagingToolbar({
      pageSize    : number,
      store       : store,
      displayInfo : true,
      displayMsg  : '显示{0}条到{1}条,共{2}条',
      plugins     : new Ext.ux.ProgressBarPager(), // 分页进度条
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_combo]
   })

   var grid = new Ext.grid.GridPanel({
      renderTo         : 'deviceTypeTableGrid',
      region           : 'center',
      width            : (document.body.clientWidth + 100) / 2,
      height           : document.body.clientHeight,
      store            : store,
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      viewConfig       : {
         forceFit : true
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'note',
      cm               : cm,
      sm               : sm,
      tbar             : [{
         id      : 'new_btn',
         text    : '新增',
         iconCls : 'page_addIcon',
         handler : function() {
            addWindow.show();
         }
      }, '-', {
         id      : 'edit_btn',
         text    : '修改',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            initEditWindow();
         }
      }, '-', {
         id      : 'del_btn',
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteItems();
         }
      }, '-', {
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            store.reload();
         }
      }, '->', new Ext.form.ComboBox({
         id             : 'protype',
         store          : protocolStore,
         mode           : 'local',
         triggerAction  : 'all',
         valueField     : 'value',
         displayField   : 'text',
         fieldLabel     : '协议类型',
         emptyText      : '请选择协议类型查询...',
         forceSelection : true,
         editable       : false,
         typeAhead      : true,
         anchor         : '100%'// 宽度百分比
      }), {
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            queryCodeItem();
         }
      }, '-', {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            cleanUpQueryParams();
         }
      }],
      bbar             : bbar
   });
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   // grid.addListener('rowdblclick', initEditWindow);

   /**
    * 新增
    */
   var protocolCombo_add = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });
   var addWindow;
   var formPanel;
   formPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      id         : 'addForm',
      name       : 'addForm',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .3,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '设备ID',
               name       : 'devid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .7,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [protocolCombo_add]
         }, {
            columnWidth : .3,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '设备类型编号',
               name       : 'devicetype',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .7,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '设备类型名称', // 标签
               name       : 'hardname', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }]
      }, {
         fieldLabel : '备注',
         name       : 'note',
         xtype      : 'textarea',
         maxLength  : 100,
         emptyText  : '备注信息...',
         anchor     : '99%'
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 500, // 窗口宽度
      height        : 200, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增设备类型',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 650 / 2, // 页面定位X坐标
      listeners     : {
         'hide' : {
            fn : function() {
               clearForm(formPanel.getForm());
            }
         }
      },
      items         : [formPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (runMode == '0') {
               Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
               return;
            }
            if (addWindow.getComponent('addForm').form.isValid()) {
               addWindow.getComponent('addForm').form.submit({
                  url       : './devicetype.ered?reqCode=insertItem',
                  waitTitle : '提示',
                  method    : 'POST',
                  waitMsg   : '正在处理数据,请稍候...',
                  success   : function(form, action) {
                     store.reload();
                     var msg = action.result.msg;
                     Ext.Msg.confirm('请确认', msg + '是否继续添加?', function(btn, text) {
                        if (btn == 'yes') {
                           addWindow.getComponent('addForm').form.reset();
                        }
                        else {
                           addWindow.hide();
                        }
                     });
                  },
                  failure   : function(form, action) {
                     var msg = action.result.msg;
                     Ext.MessageBox.alert('提示', '出错啦:<br>' + msg);
                  }
               });
            }
            else {
               // 表单验证失败
               Ext.MessageBox.alert('提示', '表单验证失败！<br>请确认表单是否正确填写！');
            }
         }
      }, {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(formPanel.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            addWindow.hide();
         }
      }]
   });

   /** *****************修改*********************** */
   var protocolCombo_edit = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });
   var editWindow, editFormPanel;
   editFormPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      name       : 'editFormPanel',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .3,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '设备ID',
               id         : 'devid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .7,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [protocolCombo_edit]
         }, {
            columnWidth : .3,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '设备类型编号',
               name       : 'devicetype',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : 0.7,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '设备类型名称', // 标签
               name       : 'hardname', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }]
      }, {
         fieldLabel : '备注',
         name       : 'note',
         xtype      : 'textarea',
         maxLength  : 100,
         emptyText  : '备注信息...',
         anchor     : '99%'
      }, {
         name  : 'devid',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 500, // 窗口宽度
      height        : 200, // 窗口高度
      resizable     : true,
      draggable     : true,
      closable      : true,
      closeAction   : 'hide',
      title         : '修改设备类型',
      iconCls       : 'page_editICon',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      maximizable   : true,
      buttonAlign   : 'right',
      border        : false,
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 650 / 2, // 页面定位X坐标
      constrain     : true,
      items         : [editFormPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (!editFormPanel.form.isValid()) {
               return;
            }
            editFormPanel.form.submit({
               url       : './devicetype.ered?reqCode=updateItem',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  editWindow.hide();
                  store.reload();
                  Ext.MessageBox.alert('提示', action.result.msg);
               },
               failure   : function(form, action) {
                  var msg = action.result.msg;
                  Ext.MessageBox.alert('提示', '保存失败:<br>' + msg);
               }
            });
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            editWindow.hide();
         }
      }]

   });

   /**
    * 初始化代码修改出口
    */
   function initEditWindow() {
      var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      var rows = grid.getSelectionModel().getSelections();
      if (rows.length > 1) {
         Ext.Msg.alert('提示', '只允许选择一条数据进行修改!');
         return;
      }
      editWindow.show();
      editFormPanel.getForm().loadRecord(record);
      Ext.getCmp('devid_').setValue(record.get('devid'));
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的记录!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'devid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './devicetype.ered?reqCode=deleteItem',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  strChecked : strChecked
               }
            });
         }
      });
   }

   /**
    * 根据条件查询代码表
    */
   function queryCodeItem() {
      store.load({
         params : {
            start   : 0,
            limit   : bbar.pageSize,
            protype : Ext.getCmp('protype').getValue()
         }
      });
   };

   function cleanUpQueryParams() {
      Ext.getCmp('protype').setValue('');
   };

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [grid]
   });
});