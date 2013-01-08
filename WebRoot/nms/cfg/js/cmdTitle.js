/**
 * 命令头维护
 * 
 * @author gezhidong
 * @since 2011-07-28
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : '命令头ID',
      dataIndex : 'titleid',
      hidden    : true
   }, {
      header    : '协议类型ID', // 列标题
      dataIndex : 'protype', // 数据索引:和Store模型对应
      hidden    : true
   }, {
      header    : '协议类型',
      dataIndex : 'proname',
      width     : 100,
      sortable  : true
   }, {
      header    : '序号',
      dataIndex : 'idx',
      width     : 60,
      sortable  : true
   }, {
      header    : '参数名称',
      dataIndex : 'fieldname',
      width     : 100
   }, {
      header    : '参数长度',
      dataIndex : 'fieldlen',
      width     : 80
   }, {
      header    : '参数对应参数编码',
      dataIndex : 'paramcode',
      width     : 150
   }, {
      header    : '参数对应具体字段',
      dataIndex : 'paramfield',
      width     : 150
   }, {
      header    : '是否取固定值',
      dataIndex : 'isfix',
      width     : 100
   }, {
      header    : '固定值',
      dataIndex : 'fixval',
      width     : 80
   }, {
      id        : 'note',
      header    : '备注',
      dataIndex : 'note'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './cmdtitle.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'titleid'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'idx'
      }, {
         name : 'fieldname'
      }, {
         name : 'fieldlen'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramfield'
      }, {
         name : 'isfix'
      }, {
         name : 'fixval'
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
      renderTo         : 'cmdTitleTableGrid',
      region           : 'center',
      width            : (document.body.clientWidth + 100) / 2,
      height           : document.body.clientHeight,
      store            : store,
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
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
               fieldLabel : '命令头ID',
               name       : 'titleid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [protocolCombo_add]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '序号',
               name       : 'idx',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数名称', // 标签
               name       : 'fieldname', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数长度', // 标签
               name       : 'fieldlen', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [{
               id       : 'isfix_add',
               xtype    : 'checkbox',
               boxLabel : '是否取固定值' // 标签
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数编码', // 标签
               name       : 'paramcode', // name:后台根据此name属性取值
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '具体字段', // 标签
               name       : 'paramfield', // name:后台根据此name属性取值
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '固定值', // 标签
               name       : 'fixval', // name:后台根据此name属性取值
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
         id    : 'isfix',
         name  : 'isfix',
         xtype : 'hidden'
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 650, // 窗口宽度
      height        : 240, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增命令头信息',
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

            if (!formPanel.form.isValid()) {
               return false;
            }

            // 验证"是否取固定值"多选框是否选中
            if (Ext.getCmp('isfix_add').getValue() == true) {
               Ext.getCmp('isfix').setValue(1);
            }
            else {
               Ext.getCmp('isfix').setValue(0);
            }
            addWindow.getComponent('addForm').form.submit({
               url       : './cmdtitle.ered?reqCode=insertItem',
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
      labelWidth : 60,
      frame      : true,
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
               fieldLabel : '命令头ID',
               id         : 'titleid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [protocolCombo_edit]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '序号',
               name       : 'idx',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数名称', // 标签
               name       : 'fieldname', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数长度', // 标签
               name       : 'fieldlen', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [{
               id       : 'isfix_edit',
               xtype    : 'checkbox',
               boxLabel : '是否取固定值' // 标签
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数编码', // 标签
               name       : 'paramcode', // name:后台根据此name属性取值
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '具体字段', // 标签
               name       : 'paramfield', // name:后台根据此name属性取值
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '固定值', // 标签
               name       : 'fixval', // name:后台根据此name属性取值
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
         name  : 'titleid',
         xtype : 'hidden'
      }, {
         id    : 'isfix',
         name  : 'isfix',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 650, // 窗口宽度
      height        : 240, // 窗口高度
      resizable     : true,
      draggable     : true,
      closable      : true,
      closeAction   : 'hide',
      title         : '修改命令头信息',
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
            // 验证"是否取固定值"多选框是否选中
            if (Ext.getCmp('isfix_edit').getValue() == true) {
               Ext.getCmp('isfix').setValue(1);
            }
            else {
               Ext.getCmp('isfix').setValue(0);
            }
            editFormPanel.form.submit({
               url       : './cmdtitle.ered?reqCode=updateItem',
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
      Ext.getCmp('titleid_').setValue(record.get('titleid'));
      if (record.get('isfix') == 1) {
         Ext.getCmp('isfix_edit').setValue(true);
      }
      else {
         Ext.getCmp('isfix_edit').setValue(false);
      }
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
      var strChecked = jsArray2JsString(rows, 'titleid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './cmdtitle.ered?reqCode=deleteItem',
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