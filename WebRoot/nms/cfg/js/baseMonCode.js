/**
 * 设备类型管理
 * 
 * @author gezhidong,bug modify by huangwei
 * @since 2011-07-22
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : '协议类型id',
      dataIndex : 'protype',
      hidden    : true
   }, {
      header    : '协议类型',
      width     : 130,
      dataIndex : 'protypename'
   }, {
      header    : '监控对象类型id',
      dataIndex : 'paramclass',
      hidden    : true
   }, {
      header    : '监控对象类型',
      width     : 130,
      dataIndex : 'paramclsname',
      type      : 'string'
   }, {
      header    : '监控对象标号id',
      dataIndex : 'paramcode',
      hidden    : true
   }, {
      header    : '监控对象标号',
      width     : 100,
      dataIndex : 'paramcodename'
   }, {
      header    : '监控对象名称',
      width     : 150,
      dataIndex : 'paramname'
   }, {
      header    : '关联标志id',
      dataIndex : 'reflag',
      hidden    : true
   }, {
      header    : '关联标志',
      width     : 100,
      dataIndex : 'reflagname'
   }, {
      header    : '数据类型id',
      dataIndex : 'datatype',
      hidden    : true
   }, {
      header    : '数据类型',
      width     : 100,
      dataIndex : 'datatypename'
   }, {
      header    : '数据长度',
      width     : 80,
      dataIndex : 'datalen'
   }, {
      header    : '数据单位',
      width     : 80,
      dataIndex : 'dataunit'
   }, {
      header    : '进制数id',
      dataIndex : 'htod',
      hidden    : true
   }, {
      header    : '进制数',
      width     : 100,
      dataIndex : 'htodname'
   }, {
      header    : '必填标志id',
      dataIndex : 'needw',
      hidden    : true
   }, {
      header    : '必填标志',
      width     : 60,
      dataIndex : 'needwname'
   }, {
      header    : '告警级别id',
      dataIndex : 'alarmtype',
      hidden    : true
   }, {
      header    : '告警级别',
      width     : 80,
      dataIndex : 'alarmtypename'
   }, {
      header    : '发送算法id',
      dataIndex : 'sarithmetic',
      hidden    : true
   }, {
      header    : '发送算法',
      width     : 80,
      dataIndex : 'sarithname'
   }, {
      header    : '接收算法id',
      dataIndex : 'rarithmetic',
      hidden    : true
   }, {
      header    : '接收算法',
      width     : 80,
      dataIndex : 'rarithname'
   }, {
      id        : 'detail',
      header    : '描述',
      dataIndex : 'detail'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './basemoncode.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'moncodeid'
      }, {
         name : 'protype'
      }, {
         name : 'protypename'
      }, {
         name : 'paramclass'
      }, {
         name : 'paramclsname'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramcodename'
      }, {
         name : 'paramname'
      }, {
         name : 'datatype'
      }, {
         name : 'datatypename'
      }, {
         name : 'datalen'
      }, {
         name : 'dataunit'
      }, {
         name : 'alarmtype'
      }, {
         name : 'alarmtypename'
      }, {
         name : 'reflag'
      }, {
         name : 'reflagname'
      }, {
         name : 'sarithmetic'
      }, {
         name : 'sarithname'
      }, {
         name : 'rarithmetic'
      }, {
         name : 'rarithname'
      }, {
         name : 'htod'
      }, {
         name : 'htodname'
      }, {
         name : 'needw'
      }, {
         name : 'needwname'
      }, {
         name : 'detail'
      }])
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = {
         protype    : Ext.getCmp('protype').getValue(),
         paramclass : Ext.getCmp('paramclass').getValue(),
         paramname  : Ext.getCmp('paramname').getValue()
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
   });

   var grid = new Ext.grid.GridPanel({
      renderTo         : 'baseMonCodeTableGrid',
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
         store          : protypeStore,
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
         xtype : 'tbspacer',
         width : 10
      }, new Ext.form.ComboBox({
         id             : 'paramclass',
         store          : paramClassStore,
         mode           : 'local',
         triggerAction  : 'all',
         valueField     : 'value',
         displayField   : 'text',
         fieldLabel     : '对象类型',
         emptyText      : '请选择对象类型查询...',
         forceSelection : true,
         editable       : false,
         typeAhead      : true,
         anchor         : '100%'// 宽度百分比
      }), {
         xtype : 'tbspacer',
         width : 10
      }, new Ext.form.TextField({
         id         : 'paramname',
         fieldLabel : '对象名称',
         emptyText  : '请输入监控名称或者监控标识',
         width      : 200
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
    * ===============新增==============
    */
   var protypeCombo_add = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      store          : protypeStore,
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

   var paramClassCombo_add = new Ext.form.ComboBox({
      id             : 'paramClassCombo_add',
      name           : 'paramclass',
      hiddenName     : 'paramclass',
      store          : paramClassStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '监控对象类型',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择监控对象类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%',// 宽度百分比
      listeners      : {
         select : function(value) {
            var text = Ext.get('paramClassCombo_add').dom.value;
            if (text.indexOf('告警') == -1) {
               alarmTypeCombo_add.disable();
               alarmTypeCombo_add.reset();
            }
            else {
               alarmTypeCombo_add.enable();
            }

         }
      }
   });

   var dataTypeCombo_add = new Ext.form.ComboBox({
      name           : 'datatype',
      hiddenName     : 'datatype',
      store          : dataTypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '数据类型',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择数据类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });

   var hToDCombo_add = new Ext.form.ComboBox({
      name           : 'htod',
      hiddenName     : 'htod',
      store          : hToDStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '进制数显示',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择进制数显示...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });

   var alarmTypeCombo_add = new Ext.form.ComboBox({
      name           : 'alarmtype',
      hiddenName     : 'alarmtype',
      store          : alarmTypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '告警级别',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择告警级别 ...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });

   var sArithCombo_add = new Ext.form.ComboBox({
      name           : 'sarithmetic',
      hiddenName     : 'sarithmetic',
      store          : sArithStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '发送算法',
      emptyText      : '请选择发送算法...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var rArithCombo_add = new Ext.form.ComboBox({
      name           : 'rarithmetic',
      hiddenName     : 'rarithmetic',
      store          : rArithStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '接收算法',
      emptyText      : '请选择接收算法...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var reFlagCombo_add = new Ext.form.ComboBox({
      name           : 'reflag',
      hiddenName     : 'reflag',
      store          : reFlagStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '关联标志',
      emptyText      : '请选择关联标志...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
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
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               layout     : 'form',
               fieldLabel : '监视标识ID',
               fieldClass : 'x-custom-field-disabled',
               anchor     : '100%',
               name       : 'moncodeid',
               disabled   : true
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [protypeCombo_add]
         }, {
            columnWidth : 0.50,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '对象标号 0x',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%',
               name       : 'paramcode',
               maxLength  : 6
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [paramClassCombo_add]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '监控对象名称',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%',
               name       : 'paramname'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [dataTypeCombo_add]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '数据单位',
               anchor     : '100%',
               name       : 'dataunit'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '数据长度',
               anchor     : '100%',
               name       : 'datalen'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [hToDCombo_add]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [alarmTypeCombo_add]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [sArithCombo_add]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [rArithCombo_add]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [reFlagCombo_add]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               xtype      : 'checkbox',
               fieldLabel : '转发至手机',
               name       : 'sendtophone'
            }]
         }]
      }, {
         fieldLabel : '内容描述',
         xtype      : 'textarea',
         anchor     : '100%',
         name       : 'detail',
         emptyText  : '内容描述...'
      }]
   });

   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 600, // 窗口宽度
      height        : 350, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增监控标识号',
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
            if (!addWindow.getComponent('addForm').form.isValid()) {
               return false;
            }
            addWindow.getComponent('addForm').form.submit({
               url       : './basemoncode.ered?reqCode=insertItem',
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

   var protypeCombo_edit = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      store          : protypeStore,
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

   var paramClassCombo_edit = new Ext.form.ComboBox({
      id             : 'paramClassCombo_edit',
      name           : 'paramclass',
      hiddenName     : 'paramclass',
      store          : paramClassStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '监控对象类型',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择监控对象类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%',// 宽度百分比
      listeners      : {
         select : function(value) {
            var text = Ext.get('paramClassCombo_edit').dom.value;
            if (text.indexOf('告警') == -1) {
               alarmTypeCombo_edit.disable();
               alarmTypeCombo_edit.reset();
            }
            else {
               alarmTypeCombo_edit.enable();
            }

         }
      }
   });

   var dataTypeCombo_edit = new Ext.form.ComboBox({
      name           : 'datatype',
      hiddenName     : 'datatype',
      store          : dataTypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '数据类型',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择数据类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });

   var hToDCombo_edit = new Ext.form.ComboBox({
      name           : 'htod',
      hiddenName     : 'htod',
      store          : hToDStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '进制数显示',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择进制数显示...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });

   var alarmTypeCombo_edit = new Ext.form.ComboBox({
      name           : 'alarmtype',
      hiddenName     : 'alarmtype',
      store          : alarmTypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '告警级别',
      labelStyle     : 'color:A62017;',
      emptyText      : '请选择告警级别 ...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      anchor         : '100%'// 宽度百分比
   });

   var sArithCombo_edit = new Ext.form.ComboBox({
      name           : 'sarithmetic',
      hiddenName     : 'sarithmetic',
      store          : sArithStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '发送算法',
      emptyText      : '请选择发送算法...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var rArithCombo_edit = new Ext.form.ComboBox({
      name           : 'rarithmetic',
      hiddenName     : 'rarithmetic',
      store          : rArithStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '接收算法',
      emptyText      : '请选择接收算法...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var reFlagCombo_edit = new Ext.form.ComboBox({
      name           : 'reflag',
      hiddenName     : 'reflag',
      store          : reFlagStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '关联标志',
      emptyText      : '请选择关联标志...',
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
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               layout     : 'form',
               fieldLabel : '监视标识ID',
               fieldClass : 'x-custom-field-disabled',
               anchor     : '100%',
               id         : 'moncodeid_',
               disabled   : true
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [protypeCombo_edit]
         }, {
            columnWidth : 0.50,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '对象标号 0x',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%',
               name       : 'paramcode',
               maxLength  : 6
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [paramClassCombo_edit]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '监控对象名称',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%',
               name       : 'paramname'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [dataTypeCombo_edit]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '数据单位',
               anchor     : '100%',
               name       : 'dataunit'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '数据长度',
               anchor     : '100%',
               name       : 'datalen'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [hToDCombo_edit]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [alarmTypeCombo_edit]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [sArithCombo_edit]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [rArithCombo_edit]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [reFlagCombo_edit]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               xtype      : 'checkbox',
               fieldLabel : '转发至手机',
               name       : 'sendtophone'
            }]
         }]
      }, {
         fieldLabel : '内容描述',
         xtype      : 'textarea',
         anchor     : '100%',
         name       : 'detail',
         emptyText  : '内容描述...'
      }, {
         name  : 'moncodeid',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 600, // 窗口宽度
      height        : 350, // 窗口高度
      closeAction   : 'hide',
      title         : '修改监控标识号信息',
      iconCls       : 'page_editICon',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      maximizable   : true,
      resizable     : true,
      draggable     : true,
      closable      : true,
      border        : false,
      animCollapse  : true,
      buttonAlign   : 'right',
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
               url       : './basemoncode.ered?reqCode=updateItem',
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
      var text = Ext.get('paramClassCombo_edit').dom.value;
      if (text.indexOf('告警') == -1) {
         alarmTypeCombo_edit.disable();
         alarmTypeCombo_edit.reset();
      }
      else {
         alarmTypeCombo_edit.enable();
      }
      Ext.getCmp('moncodeid_').setValue(record.get('moncodeid'));
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
      var strChecked = jsArray2JsString(rows, 'moncodeid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './basemoncode.ered?reqCode=deleteItem',
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

   /**
    * 根据条件查询代码表
    */
   function queryCodeItem() {
      store.load({
         params : {
            start      : 0,
            limit      : bbar.pageSize,
            protype    : Ext.getCmp('protype').getValue(),
            paramclass : Ext.getCmp('paramclass').getValue(),
            paramname  : Ext.getCmp('paramname').getValue()
         }
      });
   };

   function cleanUpQueryParams() {
      Ext.getCmp('protype').setValue('');
      Ext.getCmp('paramclass').setValue('');
      Ext.getCmp('paramname').setValue('');
   };
});