/**
 * 厂家管理
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'factid',
      header    : '厂家ID',
      dataIndex : 'factid',
      type      : 'string',
      hidden    : true
   }, {
      header    : '协议编号',
      dataIndex : 'protype',
      hidden    : true
   }, {
      id        : 'proname',
      header    : '协议类型',
      dataIndex : 'proname',
      type      : 'string'
   }, {
      id        : 'factname',
      header    : '厂家名称',
      dataIndex : 'factname',
      type      : 'string'

   }, {
      id        : 'factflag',
      header    : '厂家标识',
      dataIndex : 'factflag',
      type      : 'string'
   }, {
      id        : 'factadd',
      header    : '厂家地址',
      dataIndex : 'factadd',
      type      : 'string'
   }, {
      id        : 'linkman',
      header    : '联系人',
      dataIndex : 'linkman',
      type      : 'string'
   }, {
      id        : 'linktel',
      header    : '联系电话',
      dataIndex : 'linktel',
      type      : 'string'
   }, {
      id        : 'email',
      header    : '邮箱',
      dataIndex : 'email',
      type      : 'string'
   }, {
      id        : 'note',
      header    : '说明',
      dataIndex : 'note',
      type      : 'string'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './factoryInfo.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'factid',
         type : 'string'
      }, {
         name : 'protype',
         type : 'string'
      }, {
         name : 'proname',
         type : 'string'
      }, {
         name : 'factname',
         type : 'string'
      }, {
         name : 'factflag',
         type : 'string'
      }, {
         name : 'factadd',
         type : 'string'
      }, {
         name : 'linkman',
         type : 'string'
      }, {
         name : 'linktel',
         type : 'string'
      }, {
         name : 'email',
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
      renderTo         : 'factoryInfoTableGrid',
      height           : 510,
      store            : store,
      region           : 'center',
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
   var protocolCombo_add = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      anchor         : '100%'// 宽度百分比
   });
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
               fieldLabel : '厂家ID',
               name       : 'factid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }, {
               fieldLabel : '厂家标识', // 标签
               name       : 'factflag', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               allowBlank : false,
               regex      : /^[0-9A-Fa-f]+$/,
               regexText  : '请输入16进制数',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [protocolCombo_add]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 0.7,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '厂家名称', // 标签
               name       : 'factname', // name:后台根据此name属性取值
               maxLength  : 25,
               regex      : /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
               regexText  : '不能输入除中文，英文，数字以为的字符！',
               labelStyle : 'color:A62017;',
               allowBlank : false,
               anchor     : '100%'// 宽度百分比
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '厂家地址', // 标签
               xtype      : 'textfield', // 设置为数字输入框类型
               name       : 'factadd', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               maxLength  : 50,
               allowBlank : false,
               anchor     : '99%'// 宽度百分比
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
               fieldLabel : '联系人', // 标签
               name       : 'linkman', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               allowBlank : false,
               maxLength  : 10,
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '联系电话', // 标签
               name       : 'linktel', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               allowBlank : false,
               maxLength  : 20,
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '电子邮件', // 标签
               name       : 'email', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               vtype      : 'email',
               allowBlank : false,
               maxLength  : 100,
               anchor     : '100%'// 宽度百分比
            }]
         }]
      }, {
         fieldLabel : '说明',
         name       : 'note',
         xtype      : 'textarea',
         maxLength  : 120,
         anchor     : '99%'
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 640,
      height        : 270,
      closable      : true,
      collapsible   : true,
      maximizable   : true,
      border        : false,
      constrain     : true,
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增厂家信息',
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
            if (runMode == '0') {
               Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
               return;
            }
            if (addWindow.getComponent('addForm').form.isValid()) {
               addWindow.getComponent('addForm').form.submit({
                  url       : './factoryInfo.ered?reqCode=insertItem',
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
   var protocolCombo_edit = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      labelStyle     : 'color:A62017;',
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });
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
               fieldLabel : '厂家ID',
               name       : 'factid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }, {
               fieldLabel : '厂家标识', // 标签
               name       : 'factflag', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               allowBlank : false,
               regex      : /^[0-9A-Fa-f]+$/,
               regexText  : '请输入16进制数',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [protocolCombo_edit]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 0.7,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '厂家名称', // 标签
               name       : 'factname', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               regex      : /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
               regexText  : '不能输入除中文，英文，数字以为的字符！',
               maxLength  : 25,
               allowBlank : false,
               anchor     : '100%'// 宽度百分比
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '厂家地址', // 标签
               xtype      : 'textfield', // 设置为数字输入框类型
               name       : 'factadd', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               allowBlank : false,
               maxLength  : 50,
               anchor     : '99%'// 宽度百分比
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
               fieldLabel : '联系人', // 标签
               name       : 'linkman', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',// F66409
               allowBlank : false,
               maxLength  : 10,
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '联系电话', // 标签
               name       : 'linktel', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               allowBlank : false,
               maxLength  : 20,
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '电子邮件', // 标签
               name       : 'email', // name:后台根据此name属性取值
               labelStyle : 'color:A62017;',
               vtype      : 'email',
               allowBlank : false,
               maxLength  : 100,
               anchor     : '100%'// 宽度百分比
            }]
         }]
      }, {
         fieldLabel : '说明',
         name       : 'note',
         xtype      : 'textarea',
         maxLength  : 120,
         anchor     : '99%'
      }, {
         name  : 'factid',
         xtype : 'hidden'
      }]

   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 640,
      height        : 270,
      resizable     : true,
      draggable     : true,
      title         : '修改厂家信息',
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
               url       : './factoryInfo.ered?reqCode=updateItem',
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
      Ext.getCmp('factid_').setValue(record.get('factid'));
      // editFormPanel.getForm().findField('cmdmainid_').setValue(record.get('cmdmainid'));
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的厂家信息!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'factid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './factoryInfo.ered?reqCode=deleteItem',
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