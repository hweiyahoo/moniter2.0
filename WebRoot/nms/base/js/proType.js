/**
 * 协议类型
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'proid',
      header    : '协议ID',
      dataIndex : 'proid',
      type      : 'string',
      hidden    : true
   }, {
      id        : 'protype',
      header    : '协议编号',
      dataIndex : 'protype',
      type      : 'string'
   }, {
      id        : 'proname',
      header    : '协议类型',
      dataIndex : 'proname',
      type      : 'string'
   }, {
      id        : 'note',
      header    : '说明',
      dataIndex : 'note',
      type      : 'string'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './proType.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'proid',
         type : 'string'
      }, {
         name : 'protype',
         type : 'string'
      }, {
         name : 'proname',
         type : 'string'
      }, {
         name : 'note',
         type : 'string'
      }])
   });
   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = {
                        // protype : Ext.getCmp('protype').getValue()
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
      renderTo         : 'proTypeTableGrid',
      height           : 510,
      store            : store,
      region           : 'center',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      viewConfig       : {
         forceFit : true
      },
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
            ininEditWindow();
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
      }],
      bbar             : bbar
   });
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   // grid.addListener('rowdblclick', ininEditWindow);
   /**
    * 新增
    */
   var addWindow;
   var formPanel;
   formPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 60,
      frame      : true,
      id         : 'addForm',
      name       : 'addForm',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议ID',
               name       : 'proid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议编号', // 标签
               name       : 'protype', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               regex      : /^[0-9]+$/,
               regexText  : '只允许输入数字！',
               maxLength  : 5,
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .67,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议类型', // 标签
               name       : 'proname', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               maxLength  : 25,
               anchor     : '99%'// 宽度百分比
            }]
         }]
      }, {
         fieldLabel : '说明',
         name       : 'note',
         xtype      : 'textarea',
         maxLength  : 100,
         anchor     : '99%'
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 480,
      height        : 190,
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增协议类型',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      listeners     : {
         'hide' : {
            fn : function() {
               clearForm(formPanel.getForm());
               // enabledCombo.setValue('1');
            }
         }
      },
      items         : [formPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            // alert(Ext.getCmp('note').getRawValue());
            // if (Ext.getCmp('note').getValue() == '') {
            // Ext.getCmp('note').setRawValue('');
            // }
            if (runMode == '0') {
               Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
               return;
            }
            if (addWindow.getComponent('addForm').form.isValid()) {
               addWindow.getComponent('addForm').form.submit({
                  url       : './proType.ered?reqCode=insertItem',
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
                     // addWindow.getComponent('addForm').form.reset();
                  }
               });
            }
            else {
               // 表单验证失败
            }
         }
      }, {
         text    : '重置',
         id      : 'btnReset',
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
   var editWindow, editFormPanel;
   editFormPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 60,
      frame      : true,
      id         : 'editFormPanel',
      name       : 'editFormPanel',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议ID',
               id         : 'proid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议编号', // 标签
               name       : 'protype', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               regex      : /^[0-9]+$/,
               regexText  : '只允许输入数字！',
               maxLength  : 5,
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .67,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议类型', // 标签
               name       : 'proname', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               maxLength  : 25,
               anchor     : '99%'// 宽度百分比
            }]
         }]
      }, {
         fieldLabel : '说明',
         name       : 'note',
         xtype      : 'textarea',
         maxLength  : 100,
         anchor     : '99%'
      }, {
         name  : 'proid',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 480, // 窗口宽度
      height        : 190, // 窗口高度
      resizable     : true,
      draggable     : true,
      title         : '修改协议类型',
      iconCls       : 'page_editICon',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      maximizable   : true,
      buttonAlign   : 'right',
      border        : false,
      animCollapse  : true,
      closeAction   : 'hide',
      animateTarget : Ext.getBody(),
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
               url       : './proType.ered?reqCode=updateItem',
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
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [grid]
   });

   /**
    * 初始化代码修改出口
    */
   function ininEditWindow() {
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
      Ext.getCmp('proid_').setValue(record.get('proid'));
      // editFormPanel.getForm().findField('cmdmainid_').setValue(record.get('cmdmainid'));
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的协议类型!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'proid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './proType.ered?reqCode=deleteItem',
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
            start : 0,
            limit : bbar.pageSize
            // protype : Ext.getCmp('protype').getValue()
         }
      });
   }

   /**
    * 刷新代码表格
    */
   function refreshCodeTable() {
      store.load({
         params : {
            start : 0,
            limit : bbar.pageSize
         }
      });
   }
});