/**
 * 设备类型管理
 * 
 * @author gezhidong
 * @since 2011-07-22
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : '基站ID',
      width     : 80,
      dataIndex : 'basestatid' // 与Store模型对应
   }, {
      header    : '基站编码',
      width     : 80,
      dataIndex : 'basestatcode'
   }, {
      header    : '基站名称',
      width     : 100,
      dataIndex : 'basestatname'
   }, {
      header    : 'CID',
      width     : 80,
      dataIndex : 'cid'
   }, {
      header    : '经度',
      width     : 80,
      dataIndex : 'x'
   }, {
      header    : '纬度',
      width     : 80,
      dataIndex : 'y'
   }, {
      header    : 'PN(BCCH)',
      width     : 80,
      dataIndex : 'pnbcch'
   }, {
      header    : '省份编号',
      dataIndex : 'province',
      hidden    : true
   }, {
      header    : '省份',
      width     : 80,
      dataIndex : 'provincename'
   }, {
      header    : '地市编号',
      dataIndex : 'city',
      hidden    : true
   }, {
      header    : '地市',
      width     : 80,
      dataIndex : 'cityname'
   }, {
      id        : 'detail',
      header    : '备注',
      dataIndex : 'detail'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './basestatmgr.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'basestatid'
      }, {
         name : 'basestatcode'
      }, {
         name : 'basestatname'
      }, {
         name : 'cid'
      }, {
         name : 'x'
      }, {
         name : 'y'
      }, {
         name : 'pnbcch'
      }, {
         name : 'province'
      }, {
         name : 'provincename'
      }, {
         name : 'city'
      }, {
         name : 'cityname'
      }, {
         name : 'detail'
      }])
   });

   var city_Store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=site'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
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
   });

   var grid = new Ext.grid.GridPanel({
      renderTo         : 'baseStatTableGrid',
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
      autoExpandColumn : 'detail',
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
      }, '-', {
         id      : 'importExcel_btn',
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
         name       : 'theFile',
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
      title         : '导入基站信息',
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
               url       : './basestatmgr.ered?reqCode=importFromExcel',
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
   var provinceCombo_add = new Ext.form.ComboBox({
      name           : 'province',
      hiddenName     : 'province',
      store          : provinceStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '省份',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择省份...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });

   provinceCombo_add.on('select', function() {
      cityCombo_add.reset();
      var value = provinceCombo_add.getValue();
      city_Store.load({
         params : {
            parentsite : value
         }
      });
   });
   var cityCombo_add = new Ext.form.ComboBox({
      name           : 'city',
      hiddenName     : 'city',
      store          : city_Store,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '地市',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择地市...',
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
               fieldLabel : '基站ID',
               name       : 'basestatid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '基站编码',
               name       : 'basestatcode',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '基站名称',
               name       : 'basestatname',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '经度',
               name       : 'x',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '纬度',
               name       : 'y',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : 'CID',
               name       : 'cid',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [provinceCombo_add]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [cityCombo_add]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : 'PN(BCCH)',
               name       : 'pnbcch',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }]
      }, {
         fieldLabel : '备注',
         name       : 'detail',
         xtype      : 'textarea',
         maxLength  : 100,
         anchor     : '99%'
      }]
   });

   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 520,
      height        : 220,
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增基站数据',
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
            if (!formPanel.form.isValid()) {
               return;
            }
            addWindow.getComponent('addForm').form.submit({
               url       : './basestatmgr.ered?reqCode=insertItem',
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
   var provinceCombo_edit = new Ext.form.ComboBox({
      name           : 'province',
      hiddenName     : 'province',
      store          : provinceStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '省份',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择省份...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   provinceCombo_edit.on('select', function() {
      cityCombo_edit.reset();
      var value = provinceCombo_edit.getValue();
      city_Store.reload({
         params : {
            parentsite : value
         }
      });
   });

   var cityCombo_edit = new Ext.form.ComboBox({
      id             : 'city_id',
      name           : 'city',
      hiddenName     : 'city',
      store          : city_Store,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '地市',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择地市...',
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
               fieldLabel : '基站ID',
               id         : 'basestatid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '基站编码',
               name       : 'basestatcode',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '基站名称',
               name       : 'basestatname',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '经度',
               name       : 'x',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '纬度',
               name       : 'y',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : 'CID',
               name       : 'cid',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [provinceCombo_edit]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [cityCombo_edit]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : 'PN(BCCH)',
               name       : 'pnbcch',
               xtype      : 'textfield',
               anchor     : '100%'
            }]
         }]
      }, {
         fieldLabel : '备注',
         name       : 'detail',
         xtype      : 'textarea',
         maxLength  : 100,
         anchor     : '99%'
      }, {
         name  : 'basestatid',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 520,
      height        : 220,
      resizable     : true,
      draggable     : true,
      closable      : true,
      closeAction   : 'hide',
      title         : '修改基站信息',
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
               url       : './basestatmgr.ered?reqCode=updateItem',
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
      cityCombo_edit.reset();
      var value = record.get('province');
      city_Store.load({
         params : {
            parentsite : value
         }
      });

      // 休眠1s，在city_Store加载后执行窗口数据加载
      setTimeout(function() {
         editFormPanel.getForm().loadRecord(record);
      }, 1000);

      editFormPanel.getForm().loadRecord(record);
      Ext.getCmp('basestatid_').setValue(record.get('basestatid'));
      cityCombo_edit.setValue(record.get('city'));
      editWindow.show();
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
      var strChecked = jsArray2JsString(rows, 'basestatid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './basestatmgr.ered?reqCode=deleteItem',
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