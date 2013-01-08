/**
 * 代维人员管理
 * 
 * @author gezhidong
 * @since 2011-07-28
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : '代维人员ID',
      dataIndex : 'manid', // 与Store模型对应
      hidden    : true
   }, {
      header    : '姓名',
      width     : 80,
      dataIndex : 'manname'
   }, {
      header    : '住址',
      width     : 100,
      dataIndex : 'site'
   }, {
      header    : '联系电话1',
      width     : 80,
      dataIndex : 'tel1'
   }, {
      header    : '联系电话2',
      width     : 80,
      dataIndex : 'tel2'
   }, {
      header    : '所属单位',
      width     : 150,
      dataIndex : 'corp'
   }, {
      id        : 'detail',
      header    : '备注',
      dataIndex : 'detail'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './maintainman.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
      name : 'manid'
   }, {
      name : 'manname'
   }, {
      name : 'site'
   }, {
      name : 'tel1'
   }, {
      name : 'tel2'
   }, {
      name : 'corp'
   }, {
      name : 'detail'
   }])
   });
   
/*
   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = {
         protype : Ext.getCmp('protype').getValue()
      };
   });
*/

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
      renderTo         : 'maintainManTableGrid',
      region           : 'center',
      width            : (document.body.clientWidth + 100) / 2,
      height           : document.body.clientHeight,
      store            : store,
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'detail',
      cm               : cm,
      sm               : sm,
      tbar             : [{
         text    : '新增',
         iconCls : 'page_addIcon',
         handler : function() {
            addWindow.show();
         }
      }, '-', {
         text    : '修改',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            initEditWindow();
         }
      }, '-', {
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
      }, '-', {
         text    : '导入Excel',
         iconCls : 'uploadIcon',
         handler : function() {
            showImportWindow();
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

      function showImportWindow() {
      Ext.getCmp('theFile').reset();
      importWindow.show();
   }

   var importPanel = new Ext.FormPanel({
      id          : 'importFormpanel',
      defaultType : 'textfield',
      labelAlign  : 'right',
      labelWidth  : 100,
      frame       : true,
      fileUpload  : true,
      items       : [{
         fieldLabel : '选择导入的文件',
         id         : 'theFile',
         name		: 'theFile',
         inputType  : 'file',
         allowBlank : false,
         anchor     : '99%'
      }]
   });

   /**
    * 导入窗口
    */
   var importWindow = new Ext.Window({
      layout        : 'fit',
      width         : 380,
      height        : 100,
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '导入代维人员信息',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      maximizable   : false,
      buttonAlign   : 'right',
      border        : false,
      constrain     : true,
      items         : [importPanel],
      buttons       : [{
         text    : '导入',
         iconCls : 'acceptIcon',
         handler : function() {
            var theFile = Ext.getCmp('theFile').getValue();
            if (Ext.isEmpty(theFile)) {
               Ext.Msg.alert('提示', '请先选择您要导入的xls文件...');
               return;
            }
            if (theFile.substring(theFile.length - 4, theFile.length) != ".xls") {
               Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件!');
               return;
            }
            importPanel.form.submit({
               url       : './maintainman.ered?reqCode=importFromExcel',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  store.reload();
                  importWindow.hide();
                  Ext.MessageBox.alert('提示', '导入成功！');
               },
               failure   : function(form, action) {
                  store.reload();
                  importWindow.hide();
                  Ext.MessageBox.alert('提示', '导入失败！');
               }
            });
         }
      }, {
         text    : '关闭',
         id      : 'btnReset',
         iconCls : 'deleteIcon',
         handler : function() {
            importWindow.hide();
         }
      }]
   });
   
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
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '代维人员ID',
               name       : 'manid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            border      : false,
            defaultType : 'textfield',
            items       : [{
               fieldLabel : '姓名',
               anchor     : '100%',
               name       : 'manname'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '联系电话1',
               anchor     : '100%',
               name       : 'tel1'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '联系电话2',
               anchor     : '100%',
               name       : 'tel2'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '住址',
               anchor     : '100%',
               name       : 'site'
            }]

         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '所属单位',
               anchor     : '100%',
               name       : 'corp'
            }]
         }]
      }, {
         fieldLabel : '备注',
         xtype      : 'textarea',
         maxLength  : 100,
         anchor     : '99%',
         name       : 'detail',
         emptyText  : '备注信息'
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 480, // 窗口宽度
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
      title         : '新增代维人员',
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
                  url       : './maintainman.ered?reqCode=insertItem',
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
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '代维人员ID',
               fieldClass : 'x-custom-field-disabled',
               id         : 'manid_',
               disabled   : true,
               anchor     : '100%'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            border      : false,
            defaultType : 'textfield',
            items       : [{
               fieldLabel : '姓名',
               anchor     : '100%',
               name       : 'manname'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '联系电话1',
               anchor     : '100%',
               name       : 'tel1'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '联系电话2',
               anchor     : '100%',
               name       : 'tel2'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '住址',
               anchor     : '100%',
               name       : 'site'
            }]

         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80,
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '所属单位',
               anchor     : '100%',
               name       : 'corp'
            }]
         }]
      }, {
         fieldLabel : '备注',
         xtype      : 'textarea',
         anchor     : '99%',
         name       : 'detail',
         emptyText  : '备注信息...'
      }, {
         name  : 'manid',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 480, // 窗口宽度
      height        : 190, // 窗口高度
      resizable     : true,
      draggable     : true,
      closable      : true,
      closeAction   : 'hide',
      title         : '修改代维人员信息',
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
               url       : './maintainman.ered?reqCode=updateItem',
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
         grid.getSelectionModel().selectFirstRow();
      }
      record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      editWindow.show();
      editFormPanel.getForm().loadRecord(record);
      Ext.getCmp('manid_').setValue(record.get('manid'));
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
      var strChecked = jsArray2JsString(rows, 'manid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './maintainman.ered?reqCode=deleteItem',
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
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [grid]
   });
});