/**
 * 命令策略管理
 * 
 * @author huangwei
 * @since 2011-07-22
 */
Ext.onReady(function() {
   // var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
      hidden    : true,
      header    : 'ID',
      dataIndex : 'cmdmainid'
   }, {
      header    : '协议编号',
      dataIndex : 'protype',
      hidden    : true
   }, {
      header    : '协议类型',
      dataIndex : 'proname',
      width     : 140,
      sortable  : true
   }, {
      header    : '命令编号',
      dataIndex : 'cmd',
      sortable  : true,
      width     : 60
   }, {
      header    : '命令字',
      dataIndex : 'cmd1',
      width     : 60
   }, {
      header    : '命令名称',
      dataIndex : 'cmdname',
      width     : 120
   }, {
      id        : 'team_desc',
      header    : '备注',
      dataIndex : 'note'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './cmdprase.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'cmdmainid'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'cmd'
      }, {
         name : 'cmd1'
      }, {
         name : 'cmdname'
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

   var cmpPanel = Ext.get("cmdprasemainPanel");
   var grid = new Ext.grid.GridPanel({
      title            : '命令策略主表维护',
      region           : 'west',
      width            : (document.body.clientWidth + 100) / 2,
      height           : document.body.clientHeight,
      store            : store,
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'team_desc',
      cm               : cm,
      // sm : sm,
      tbar             : [{
         id      : 'new_btn',
         text    : '新增',
         iconCls : 'page_addIcon',
         handler : function() {
            formPanel.form.reset();
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

   // grid.addListener('rowdblclick', ininEditWindow);
   // 类型表双击 加载明细表数据
   /*
    * var subStore = Ext.getDoc('subStore'); var sub_bbar =
    * Ext.getDoc('sub_bbar');
    */
   var sel_record;
   grid.addListener('rowclick', function() {
      sel_record = grid.getSelectionModel().getSelected();
      sub_store.load({
         params : {
            start   : 0,
            limit   : sub_bbar.pageSize,
            protype : sel_record.get("protype"),
            cmd     : sel_record.get("cmd")
         }
      });
   });
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
               fieldLabel : '主ID号',
               name       : 'cmdmainid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .63,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [protocolCombo_add]
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
               fieldLabel : '命令编号',
               name       : 'cmd',
               maxLength  : 10,
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
               fieldLabel : '命令字', // 标签
               name       : 'cmd1', // name:后台根据此name属性取值
               maxLength  : 10,
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
               fieldLabel : '命令名称', // 标签
               name       : 'cmdname', // name:后台根据此name属性取值
               maxLength  : 50,
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
      width         : 480, // 窗口宽度
      height        : 190, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增策略主表数据',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 480 / 2, // 页面定位X坐标
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
            if (addWindow.getComponent('addForm').form.isValid()) {
               addWindow.getComponent('addForm').form.submit({
                  url       : './cmdprase.ered?reqCode=insertItem',
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
               fieldLabel : '主ID号',
               id         : 'cmdmainid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .63,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [protocolCombo_edit]
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
               fieldLabel : '命令编号',
               name       : 'cmd',
               maxLength  : 10,
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
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
               fieldLabel : '命令字', // 标签
               name       : 'cmd1', // name:后台根据此name属性取值
               maxLength  : 10,
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
               fieldLabel : '命令名称', // 标签
               name       : 'cmdname', // name:后台根据此name属性取值
               maxLength  : 50,
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
         name  : 'cmdmainid',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 480, // 窗口宽度
      height        : 190, // 窗口高度
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '修改命令策略主表',
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
               url       : './cmdprase.ered?reqCode=updateItem',
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
   function ininEditWindow() {
      var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         grid.getSelectionModel().selectFirstRow();
      }
      record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      editWindow.show();
      editFormPanel.getForm().loadRecord(record);
      Ext.getCmp('cmdmainid_').setValue(record.get('cmdmainid'));
      // editFormPanel.getForm().findField('cmdmainid_').setValue(record.get('cmdmainid'));
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的主表数据!');
         return;
      }
      // var strChecked = jsArray2JsString(rows, 'cmdmainid');
      var cmdmainid = rows[0].get('cmdmainid');
      var cmd = rows[0].get('cmd');
      var protype = rows[0].get('protype');
      var tipContent;
      if (sub_store.getCount() == 0) {
         tipContent = '您确定要删除吗？';
      }
      else {
         tipContent = '您要删除的主表中从表还有数据，我们将一并删除从表数据，您确定吗？';
      }
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './cmdprase.ered?reqCode=deleteItem',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  sub_store.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  cmdmainid : cmdmainid,
                  cmd       : cmd,
                  protype   : protype
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
      // 清空sub_store
      sub_store.load({
         params : {
            start : 0,
            limit : sub_bbar.pageSize
         }
      });
   }

   // ============= 命令策略从表
   var sub_sm = new Ext.grid.CheckboxSelectionModel({
   // singleSelect : true
   });
   var sub_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sub_sm, {
      hidden    : true,
      header    : 'ID',
      dataIndex : 'cmdsubid'
   }, {
      header    : '序号',
      dataIndex : 'idx',
      width     : 80
   }, {
      header    : '监控对象标号',
      dataIndex : 'paramcode',
      hidden    : false,
      width     : 100,
      sortable  : true
   }, {
      header    : '监控对象名称',
      dataIndex : 'paramname',
      sortable  : true,
      width     : 160
   }, {
      id        : 'team_desc',
      header    : '备注',
      dataIndex : 'note'
   }]);

   var sub_store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './cmdprase.ered?reqCode=queryItemsForSub'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'cmdsubid'
      }, {
         name : 'protype'
      }, {
         name : 'cmd'
      }, {
         name : 'cmd1'
      }, {
         name : 'idx'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramname'
      }, {
         name : 'note'
      }])
   });

   // 翻页排序时带上查询条件
   sub_store.on('beforeload', function() {
      if (sel_record != null) {
         this.baseParams = {
            protype : sel_record.get("protype"),
            cmd     : sel_record.get("cmd")
         };
      }

   });

   var sub_pagesize_combo = new Ext.form.ComboBox({
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
   var sub_number = parseInt(sub_pagesize_combo.getValue());
   sub_pagesize_combo.on("select", function(comboBox) {
      bbar.pageSize = parseInt(comboBox.getValue());
      sub_number = parseInt(comboBox.getValue());
      sub_store.reload({
         params : {
            start   : 0,
            limit   : bbar.pageSize
         }
      });
   });

   var sub_bbar = new Ext.PagingToolbar({
      pageSize    : sub_number,
      store       : sub_store,
      displayInfo : true,
      displayMsg  : '显示{0}条到{1}条,共{2}条',
      plugins     : new Ext.ux.ProgressBarPager(), // 分页进度条
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', sub_pagesize_combo]
   })

   var sub_grid = new Ext.grid.GridPanel({
      title      : '命令策略从表维护',
      region     : 'center',
      height     : document.body.clientHeight,
      store      : sub_store,
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      cm         : sub_cm,
      sm         : sub_sm,
      tbar       : [{
         id      : 'new_btn_',
         text    : '新增',
         iconCls : 'page_addIcon',
         handler : function() {
            if (!sel_record) {
               Ext.MessageBox.alert('提示', '请先在左边数据列表中选择主表数据！');
               return false;
            }
            var titleContent = "协议类型：" + sel_record.get('proname');
            titleContent += ";   命令编号：" + sel_record.get('cmd');
            titleContent += ";   命令名称：" + sel_record.get('cmdname');
            sub_addWindow.setTitle('新增从表数据<br>【' + titleContent + '】');
            // keyFormPanel.getForm().get("dim_id").setValue(dim_id_);
            sub_formPanel.form.reset();
            sub_addWindow.show();
         }
      }, '-', {
         id      : 'edit_btn_',
         text    : '修改',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            if (!sel_record) {
               Ext.MessageBox.alert('提示', '请先在左边数据列表中选择主表数据！');
               return false;
            }
            var titleContent = "协议类型：" + sel_record.get('proname');
            titleContent += ";   命令编号：" + sel_record.get('cmd');
            titleContent += ";   命令名称：" + sel_record.get('cmdname');
            sub_editWindow.setTitle('修改从表数据<br>【' + titleContent + '】');
            initsub_editWindow();
         }
      }, '-', {
         id      : 'del_btn_',
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            sub_deleteItems();
         }
      }, '-', {
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            sub_store.reload();
         }
      }],
      bbar       : sub_bbar
   });
   sub_store.load({
      params : {
         start : 0,
         limit : sub_bbar.pageSize
      }
   });

   // sub_grid.addListener('rowdblclick', initsub_editWindow);

   var sub_addWindow, sub_formPanel;
   sub_formPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 60,
      frame      : true,
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
               fieldLabel : '主ID号',
               name       : 'cmdsubid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '80%'
            }]
         }, {
            columnWidth : .43,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel : '监控对象编号',
               id         : 'add_paramcode',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               labelStyle : 'color:A62017;',
               allowBlank : false,
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .23,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               text    : '<<选择监控对象',
               xtype   : 'button', // 设置为数字输入框类型
               anchor  : '100%',
               handler : function() {
                  selectParamClassInit("add");
               }
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
               fieldLabel : '序号',
               name       : 'idx',
               maxLength  : 10,
               xtype      : 'textfield', // 设置为数字输入框类型
               labelStyle : 'color:A62017;',
               allowBlank : false,
               anchor     : '80%'
            }]
         }, {
            columnWidth : .63,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '监控对象名称', // 标签
               id         : 'add_paramname',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               labelStyle : 'color:A62017;',
               allowBlank : false,
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
         name  : 'cmd',
         xtype : 'hidden'
      }, {
         name  : 'cmd1',
         xtype : 'hidden'
      }, {
         name  : 'protype',
         xtype : 'hidden'
      }, {
         name  : 'paramcode',
         xtype : 'hidden'
      }, {
         name  : 'paramname',
         xtype : 'hidden'
      }]
   });
   sub_addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 520, // 窗口宽度 
      height        : 210, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增策略从表数据',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 650 / 2, // 页面定位X坐标
      items         : [sub_formPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (sub_formPanel.form.isValid()) {

               var paramcode = sub_formPanel.form.findField('paramcode').getValue();
               if (paramcode == '') {
                  Ext.MessageBox.alert('提示', '请选择监控对象标识!');
                  return;
               }

               sub_formPanel.form.findField('protype').setValue(sel_record.get('protype'));
               sub_formPanel.form.findField('cmd').setValue(sel_record.get('cmd'));
               sub_formPanel.form.findField('cmd1').setValue(sel_record.get('cmd1'));
               sub_formPanel.form.submit({
                  url       : './cmdprase.ered?reqCode=insertItemForSub',
                  waitTitle : '提示',
                  method    : 'POST',
                  waitMsg   : '正在处理数据,请稍候...',
                  success   : function(form, action) {
                     sub_store.reload();
                     var msg = action.result.msg;
                     Ext.Msg.confirm('请确认', msg + '是否继续添加?', function(btn, text) {
                        if (btn == 'yes') {
                           sub_formPanel.form.reset();
                        }
                        else {
                           sub_addWindow.hide();
                        }
                     });
                  },
                  failure   : function(form, action) {
                     var msg = action.result.msg;
                     Ext.MessageBox.alert('提示', '出错啦:<br>' + msg);
                     // sub_addWindow.getComponent('addForm').form.reset();
                  }
               });
            }
            else {
               // 表单验证失败
            }
         }
      }, {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(sub_formPanel.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            sub_addWindow.hide();
         }
      }]
   });

   /** *****************修改*********************** */
   var sub_editWindow, sub_editForm;
   sub_editForm = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 60,
      frame      : true,
      name       : 'sub_editForm',
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
               fieldLabel : '主ID号',
               id         : 'cmdsubid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '80%'
            }]
         }, {
            columnWidth : .43,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel : '监控对象编号',
               id         : 'edit_paramcode',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               labelStyle : 'color:A62017;',
               allowBlank : false,
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .23,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               text    : '<<选择监控对象',
               xtype   : 'button', // 设置为数字输入框类型
               anchor  : '100%',
               handler : function() {
                  selectParamClassInit("edit");
               }
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
               fieldLabel : '序号',
               name       : 'idx',
               maxLength  : 10,
               xtype      : 'textfield', // 设置为数字输入框类型
               labelStyle : 'color:A62017;',
               allowBlank : false,
               anchor     : '80%'
            }]
         }, {
            columnWidth : .63,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '监控对象名称', // 标签
               id         : 'edit_paramname',
               allowBlank : false,
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               labelStyle : 'color:A62017;',
               allowBlank : false,
               // labelStyle: 'color:blue;',
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
         name  : 'cmdsubid',
         xtype : 'hidden'
      }, {
         name  : 'cmd',
         xtype : 'hidden'
      }, {
         name  : 'cmd1',
         xtype : 'hidden'
      }, {
         name  : 'protype',
         xtype : 'hidden'
      }, {
         name  : 'paramcode',
         xtype : 'hidden'
      }, {
         name  : 'paramname',
         xtype : 'hidden'
      }]
   });

   sub_editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 520, // 窗口宽度
      height        : 210, // 窗口高度
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '修改命令策略从表',
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
      items         : [sub_editForm],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (!sub_editForm.form.isValid()) {
               return;
            }

            var paramcode = sub_editForm.form.findField('paramcode').getValue();
            if (paramcode == '') {
               Ext.MessageBox.alert('提示', '请选择监控对象标识!');
               return;
            }

            sub_editForm.form.submit({
               url       : './cmdprase.ered?reqCode=updateItemForSub',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  sub_editWindow.hide();
                  sub_store.reload();
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
            sub_editWindow.hide();
         }
      }]

   });

   /**
    * 初始化代码修改出口
    */
   function initsub_editWindow() {
      var record = sub_grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      var rows = sub_grid.getSelectionModel().getSelections();
      if (rows.length > 1) {
         Ext.Msg.alert('提示', '只允许选择一条数据进行修改!');
         return;
      }
      sub_editWindow.show();
      sub_editForm.getForm().loadRecord(record);
      Ext.getCmp('cmdsubid_').setValue(record.get('cmdsubid'));
      Ext.getCmp('edit_paramcode').setValue(record.get('paramcode'));
      Ext.getCmp('edit_paramname').setValue(record.get('paramname'));
      // sub_editForm.getForm().findField('cmdmainid_').setValue(record.get('cmdmainid'));
   }

   /**
    * 删除
    */
   function sub_deleteItems() {
      var rows = sub_grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的从表数据!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'cmdsubid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './cmdprase.ered?reqCode=deleteItemForSub',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  sub_store.reload();
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
    * 监控对象类型选择
    */
   var ischoise = false;
   function selectParamClassInit(formType) {
      var selectParamClassWindow = new Ext.Window({
         id          : 'selectParamClassWindow',
         layout      : 'fit',
         width       : 600,
         height      : document.body.clientHeight,
         border      : false,
         draggable   : true,
         maximizable : true,
         closeAction : 'close',
         title       : '监控对象标识',
         iconCls     : 'group_linkIcon',
         modal       : true,
         listeners   : {
            'beforeclose' : {
               fn : function() {
                  var paramclassGrid = Ext.getCmp('paramclassGrid');
                  paramClassChoice(paramclassGrid, formType)
               }
            }
         },
         buttonAlign : 'right',
         constrain   : true,
         autoLoad    : {
            url     : './cmdprase.ered?reqCode=initSelectParamcode',
            scripts : true,
            text    : '引擎正在驱动页面,请等待...',
            params  : {
               protype : sel_record.get('protype')
            }
         },
         buttons     : [{
            text    : '选择',
            iconCls : 'acceptIcon',
            handler : function() {
               ischoise = true;
               selectParamClassWindow.close();
            }
         }]
      });
      selectParamClassWindow.show();
   }

   /**
    * 监控对象标识
    */
   function paramClassChoice(paramclassGrid, formType) {
      var record = paramclassGrid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         // Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      if (ischoise) {
         ischoise = false;
         var paramcode = record.get('paramcode');
         var paramname = record.get('paramname');
         if (formType == 'add') {
            sub_formPanel.findById('add_paramcode').setValue(paramcode);
            sub_formPanel.findById('add_paramname').setValue(paramname);
            sub_formPanel.form.findField('paramcode').setValue(paramcode);
            sub_formPanel.form.findField('paramname').setValue(paramname);
         }
         else if (formType = 'edit') {
            sub_editForm.findById('edit_paramcode').setValue(paramcode);
            sub_editForm.findById('edit_paramname').setValue(paramname);
            sub_editForm.form.findField('paramcode').setValue(paramcode);
            sub_editForm.form.findField('paramname').setValue(paramname);
         }
      }
   };

   function cleanUpQueryParams() {
      Ext.getCmp('protype').setValue('');
   };

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [sub_grid, grid]
   });
});