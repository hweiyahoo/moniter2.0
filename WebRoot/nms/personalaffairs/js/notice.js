/**
 * 厂家管理
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {
   var app_rece_obj;

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      dataIndex : 'notice_id',
      header    : '通告ID',
      hidden    : true
   }, {
      dataIndex : 'model_id',
      header    : '发布模式ID',
      hidden    : true
   }, {
      id        : 'model_name',
      header    : '发送模式',
      dataIndex : 'model_name',
      width     : 80,
      type      : 'string'
   }, {
      header    : '发送类型ID',
      dataIndex : 'type_id',
      hidden    : true
   }, {
      id        : 'type_name',
      header    : '发送类型',
      dataIndex : 'type_name',
      width     : 80,
      type      : 'string',
      renderer  : function(value) {
         if (value == '站内短信') {
            return '<font color="green">站内短信</font>';
         }
         else if (value == '告警') {
            return '<font color="F98039">告警</font>';
         }
         else if (value == '通告') {
            return '<font color="red">通告</font>';
         }
      }
   }, {
      id        : 'title',
      header    : '标题',
      dataIndex : 'title',
      type      : 'string'
   }, {
      id        : 'unrescission',
      header    : '是否撤销',
      dataIndex : 'unrescission',
      type      : 'string',
      width     : 80,
      hidden    : true
   }, {
      id        : 'rescission_time',
      header    : '撤销时间',
      dataIndex : 'rescission_time',
      type      : 'string',
      width     : 140,
      hidden    : true
   }, {
      id        : 'unremove',
      header    : '是否删除',
      dataIndex : 'unremove',
      type      : 'string',
      width     : 80,
      hidden    : true
   }, {
      id        : 'remove_time',
      header    : '删除时间',
      dataIndex : 'remove_time',
      type      : 'string',
      width     : 140,
      hidden    : true
   }, {
      header    : '优先级',
      dataIndex : 'priority',
      hidden    : true
   }, {
      id        : 'publish_time',
      header    : '发布时间',
      dataIndex : 'publish_time',
      width     : 140,
      type      : 'string'
   }, {
      id        : 'publish_user',
      header    : '发布用户',
      width     : 100,
      dataIndex : 'publish_user',
      type      : 'string'
   }, {
      id        : 'user_type',
      header    : '用户类型',
      dataIndex : 'user_type',
      width     : 100,
      type      : 'string',
      hidden    : true
   }, {
      id        : 'modify_time',
      header    : '修改时间',
      width     : 140,
      dataIndex : 'modify_time',
      type      : 'string'
   }, {
      id        : 'modify_user',
      header    : '修改用户',
      dataIndex : 'modify_user',
      width     : 100,
      type      : 'string'
   }, {
      header    : '接受对象',
      dataIndex : 'rece_obj',
      hidden    : true
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './notice.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'notice_id',
         type : 'string'
      }, {
         name : 'model_id',
         type : 'string'
      }, {
         name : 'model_name',
         type : 'string'
      }, {
         name : 'type_id',
         type : 'string'
      }, {
         name : 'type_name',
         type : 'string'
      }, {
         name : 'title',
         type : 'string'
      }, {
         name : 'content',
         type : 'string'
      }, {
         name : 'unrescission',
         type : 'string'
      }, {
         name : 'rescission_time',
         type : 'string'
      }, {
         name : 'unremove',
         type : 'string'
      }, {
         name : 'remove_time',
         type : 'string'
      }, {
         name : 'priority',
         type : 'string'
      }, {
         name : 'publish_time',
         type : 'string'
      }, {
         name : 'publish_user',
         type : 'string'
      }, {
         name : 'user_type',
         type : 'string'
      }, {
         name : 'modify_time',
         type : 'string'
      }, {
         name : 'modify_user',
         type : 'string'
      }, {
         name : 'rece_obj',
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
      renderTo         : 'noticeTableGrid',
      height           : 510,
      store            : store,
      region           : 'center',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      // viewConfig : {
      // forceFit : true
      // },
      autoExpandColumn : 'title',
      stripeRows       : true,
      frame            : true,
      cm               : cm,
      sm               : sm,
      tbar             : [{
         text    : '发布',
         iconCls : 'page_addIcon',
         handler : function() {
            emptyStore.removeAll();
            emptyRoleStore.removeAll();
            addWindow.show();
            recieveRoleBotton_add.hide();
            recieveBotton_add.hide();
         }
      }, '-', {
         text    : '修改',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            ininEditWindow();
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
    * 选择接收人员按钮
    */
   var recieveBotton_add = new Ext.Button({
      id      : 'recieveBotton_add',
      text    : '选择接收人员',
      width   : 60,
      handler : function() {
         var model = formPanel.getForm().findField('model_id').getValue();
         emptyStore.removeAll();
         emptyRoleStore.removeAll();
         personWindow_add.show();
      }
   });

   var recieveRoleBotton_add = new Ext.Button({
      id      : 'recieveRoleBotton_add',
      text    : '选择接收角色',
      width   : 60,
      handler : function() {
         var model = formPanel.getForm().findField('model_id').getValue();
         emptyStore.removeAll();
         emptyRoleStore.removeAll();
         roleWindow_add.show();
      }
   });

   var modelCombo_add = new Ext.form.ComboBox({
      name           : 'model_id',
      hiddenName     : 'model_id',
      store          : noticemodelStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '发布模式',
      emptyText      : '请选择...',
      forceSelection : true,
      allowBlank     : false,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%',// 宽度百分比
      listeners      : {
         select : function(cb) {
            var value = cb.getValue();
            if (value == "1" || value == "2") {
               formPanel.getForm().findField('rece_obj').setValue("");
               recieveRoleBotton_add.hide();
               recieveBotton_add.show();
            }
            else if (value == "3") {
               recieveBotton_add.hide();
               recieveRoleBotton_add.hide();
               formPanel.getForm().findField('rece_obj').setValue("全部人员");
            }
            else if (value == "4") {
               formPanel.getForm().findField('rece_obj').setValue("");
               recieveBotton_add.hide();
               recieveRoleBotton_add.show()
            }
         }
      }
   });

   var priorityCombobox = new Ext.form.ComboBox({
      name          : 'priority',
      hiddenName    : 'priority',
      fieldLabel    : '优先级',
      typeAhead     : true,
      triggerAction : 'all',
      lazyRender    : true,
      mode          : 'local',
      store         : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [[1, '1 [高]'], [2, '2'], [3, '3 [中]'], [4, '4'], [5, '5 [低]']]
      }),
      valueField    : 'value',
      displayField  : 'text',
      value         : '5',
      editable      : false,
      allowBlank    : false,
      anchor        : '100%'// 宽度百分比
   });
   var typeCombo_add = new Ext.form.ComboBox({
      name           : 'type_id',
      hiddenName     : 'type_id',
      store          : noticetypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      allowBlank     : false,
      displayField   : 'text',
      fieldLabel     : '发布类型',
      emptyText      : '请选择...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var emptyStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './notice.ered?reqCode=queryCheckedStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });
   // 加载空store
   emptyStore.load({
      params : {
         rece_obj : '2342332'
      }
   });
   var emptyRoleStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './notice.ered?reqCode=queryCheckedRoleStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });
   // 加载空store
   emptyRoleStore.load({
      params : {
         rece_obj : '2342332'
      }
   });

   /**
    * 人员选择列表
    */
   var person_add = new Ext.form.FormPanel({
      // width : 500,
      // bodyStyle : 'padding:-100px;',
      // renderTo: 'itemselector',
      items : [{
         xtype        : 'itemselector',
         name         : 'itemselector',
         imagePath    : './resource/extjs3.1/ux/images/',
         multiselects : [{
            width        : 240,
            height       : 260,
            store        : deptuserStore,
            displayField : 'text',
            legend       : '待选择的人员',
            valueField   : 'value'
         }, {
            width        : 240,
            height       : 260,
            displayField : 'text',
            valueField   : 'value',
            legend       : '已选择的人员',
            store        : emptyStore,
            tbar         : [{
               text    : '清空',
               handler : function() {
                  person_add.getForm().findField('itemselector').reset();
               }
            }]
         }]
      }]
   });
   /**
    * 人员选择窗口
    */
   var personWindow_add = new Ext.Window({
      layout        : 'fit',
      width         : 640,
      height        : 330,
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : false, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '人员选择',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      listeners     : {
         'hide' : {
            fn : function() {
               clearForm(person_add.getForm());
            }
         }
      },
      items         : [person_add],
      buttons       : [{
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            person_add.getForm().findField('itemselector').reset();
            personWindow_add.hide();
         }
      }, {
         text    : '保存',
         handler : function() {
            if (person_add.getForm().isValid()) {
               var rece_obj_add =
                                  formatItemSelectorValue(person_add.getForm().getValues(true), ',');
               formPanel.getForm().findField('rece_obj').setValue(rece_obj_add);
               personWindow_add.hide();
            }
         }
      }]
   });
   var role_add = new Ext.form.FormPanel({
      // title : '角色选择',
      // width : 500,
      // bodyStyle : 'padding:10px;',
      items : [{
         xtype        : 'itemselector',
         name         : 'itemselector',
         // fieldLabel : '角色选择',
         imagePath    : './resource/extjs3.1/ux/images/',
         multiselects : [{
            width        : 240,
            height       : 260,
            legend       : '待选择的角色',
            store        : deptroleStore,
            displayField : 'text',
            valueField   : 'value'
         }, {
            width        : 240,
            height       : 260,
            legend       : '已选择的角色',
            store        : emptyRoleStore,
            displayField : 'text',
            valueField   : 'value',
            tbar         : [{
               text    : '清空',
               handler : function() {
                  role_add.getForm().findField('itemselector').reset();
               }
            }]
         }]
      }]
   });

   var roleWindow_add = new Ext.Window({
      layout        : 'fit',
      width         : 640,
      height        : 330,
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : false, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '角色选择',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      listeners     : {
         'hide' : {
            fn : function() {
               clearForm(role_add.getForm());
            }
         }
      },
      items         : [role_add],
      buttons       : [{
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            role_add.getForm().findField('itemselector').reset();
            roleWindow_add.hide();
         }
      }, {
         text    : '保存',
         handler : function() {
            if (role_add.getForm().isValid()) {
               var rece_obj_edit = formatItemSelectorValue(role_add.getForm().getValues(true), ',');
               formPanel.getForm().findField('rece_obj').setValue(rece_obj_edit);
               roleWindow_add.hide();
            }
         }
      }]
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
               fieldLabel : '通告ID',
               name       : 'notice_id',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }, typeCombo_add, modelCombo_add]
         }, recieveBotton_add, recieveRoleBotton_add]
      }, {
         fieldLabel : '接收人员',
         name       : 'rece_obj',
         xtype      : 'textarea',
         allowBlank : false,
         readOnly   : 'true',
         anchor     : '70%'// 宽度百分比
      }, {
         fieldLabel : '标题', // 标签
         name       : 'title', // name:后台根据此name属性取值
         xtype      : 'textfield',
         allowBlank : false,
         anchor     : '70%'// 宽度百分比
      }, {
         fieldLabel : '内容',
         name       : 'content',
         xtype      : 'htmleditor',
         anchor     : '100%'
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : document.body.clientWidth - 400,
      height        : document.body.clientHeight - 100,
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '发布通告信息',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      listeners     : {
         'hide' : {
            fn : function() {
               recieveRoleBotton_add.hide();
               recieveBotton_add.hide();
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
            var model = formPanel.getForm().findField('model_id').getValue();
            if (model == "1" || model == "2") {// 单人或多人
               if (addWindow.getComponent('addForm').form.isValid()) {
                  addWindow.getComponent('addForm').form.submit({
                     url       : './notice.ered?reqCode=insertItem',
                     waitTitle : '提示',
                     method    : 'POST',
                     waitMsg   : '正在处理数据,请稍候...',
                     success   : function(form, action) {
                        store.reload();
                        addWindow.hide();
                        var msg = action.result.msg;
                        Ext.MessageBox.alert('提示',msg);
                     },
                     failure   : function(form, action) {
                        var msg = action.result.msg;
                        Ext.MessageBox.alert('提示', '出错啦:<br>' + msg);
                     }
                  });
               }
            }
            else if (model == "3" || model == "4") {// 全部用户&&角色
               if (addWindow.getComponent('addForm').form.isValid()) {
                  addWindow.getComponent('addForm').form.submit({
                     url       : './notice.ered?reqCode=insertAllUserItem',
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
   var modelCombo_edit = new Ext.form.ComboBox({
      name           : 'model_id',
      hiddenName     : 'model_id',
      store          : noticemodelStore,
      mode           : 'local',
      triggerAction  : 'all',
      allowBlank     : false,
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%',// 宽度百分比
      listeners      : {
         select : function(cb) {
            var value = cb.getValue();
            checkedStore.load({
               params : {
                  rece_obj : app_rece_obj
               }
            });
            noCheckedStore.load({
               params : {
                  rece_obj : app_rece_obj
               }
            });
            if (value == "1" || value == "2") {
               recieveRoleBotton_edit.hide();
               recieveBotton_edit.show();
            }
            else if (value == "3") {
               recieveBotton_edit.hide();
               recieveRoleBotton_edit.hide();
               editFormPanel.getForm().findField('rece_obj').setValue("全部人员");
            }
            else if (value == "4") {
               checkedRoleStore.load({
                  params : {
                     rece_obj : app_rece_obj
                  }
               });
               noCheckedRoleStore.load({
                  params : {
                     rece_obj : app_rece_obj
                  }
               });
               recieveBotton_edit.hide();
               recieveRoleBotton_edit.show();
            }
         }
      }
   });
   var typeCombo_edit = new Ext.form.ComboBox({
      name           : 'type_id',
      hiddenName     : 'type_id',
      store          : noticetypeStore,
      allowBlank     : false,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var checkedStore = new Ext.data.Store({// 已选中接收人员
      proxy  : new Ext.data.HttpProxy({
         url : './notice.ered?reqCode=queryCheckedStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var noCheckedStore = new Ext.data.Store({// 未选中的人员
      proxy  : new Ext.data.HttpProxy({
         url : './notice.ered?reqCode=queryNoCheckedStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var checkedRoleStore = new Ext.data.Store({// 已选中接收角色
      proxy  : new Ext.data.HttpProxy({
         url : './notice.ered?reqCode=queryCheckedRoleStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var noCheckedRoleStore = new Ext.data.Store({// 未选中的角色
      proxy  : new Ext.data.HttpProxy({
         url : './notice.ered?reqCode=queryNoCheckedRoleStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var person_edit = new Ext.form.FormPanel({
      // title : '人员选择',
      // width : 500,
      // bodyStyle : 'padding:10px;',
      // renderTo: 'itemselector',
      items : [{
         xtype        : 'itemselector',
         name         : 'itemselector',
         // fieldLabel : '人员选择',
         imagePath    : './resource/extjs3.1/ux/images/',
         multiselects : [{
            width        : 240,
            height       : 260,
            legend       : '待选择的人员',
            store        : noCheckedStore,
            displayField : 'text',
            valueField   : 'value'
         }, {
            width        : 240,
            height       : 260,
            legend       : '已选择的人员',
            store        : checkedStore,
            displayField : 'text',
            valueField   : 'value',
            tbar         : [{
               text    : '清空',
               handler : function() {
                  person_edit.getForm().findField('itemselector').reset();
               }
            }]
         }]
      }]
   });

   var personWindow_edit = new Ext.Window({
      layout        : 'fit',
      width         : 640, // 窗口宽度
      height        : 330, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : false, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '人员选择',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      // listeners : {
      // 'hide' : {
      // fn : function() {
      // clearForm(person_edit.getForm());
      // }
      // }
      // },
      items         : [person_edit],
      buttons       : [{
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            personWindow_edit.hide();
         }
      }, {
         text    : '保存',
         handler : function() {
            if (person_edit.getForm().isValid()) {
               var rece_obj_edit =
                                   formatItemSelectorValue(person_edit.getForm().getValues(true),
                                                           ',');
               editFormPanel.getForm().findField('rece_obj').setValue(rece_obj_edit);
               personWindow_edit.hide();
            }
         }
      }]
   });

   var recieveBotton_edit = new Ext.Button({
      id      : 'recieveBotton_edit',
      text    : '选择接收人员',
      width   : 60,
      handler : function() {
         var model = editFormPanel.getForm().findField('model_id').getValue();
         personWindow_edit.show();
      }
   });

   var recieveRoleBotton_edit = new Ext.Button({
      id      : 'recieveRoleBotton_edit',
      text    : '选择接收角色',
      width   : 60,
      handler : function() {
         var model = editFormPanel.getForm().findField('model_id').getValue();
         roleWindow_edit.show();
      }
   });

   var role_edit = new Ext.form.FormPanel({
      // title : '角色选择',
      // width : 500,
      // bodyStyle : 'padding:10px;',
      items : [{
         xtype        : 'itemselector',
         name         : 'itemselector',
         // fieldLabel : '角色选择',
         imagePath    : './resource/extjs3.1/ux/images/',
         multiselects : [{
            width        : 240,
            height       : 260,
            legend       : '待选择的角色',
            store        : noCheckedRoleStore,
            displayField : 'text',
            valueField   : 'value'
         }, {
            width        : 240,
            height       : 260,
            legend       : '已选择的角色',
            store        : checkedRoleStore,
            displayField : 'text',
            valueField   : 'value',
            tbar         : [{
               text    : '清空',
               handler : function() {
                  role_edit.getForm().findField('itemselector').reset();
               }
            }]
         }]
      }]
   });

   var roleWindow_edit = new Ext.Window({
      layout        : 'fit',
      width         : 640, // 窗口宽度
      height        : 330, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : false, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '角色选择',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      items         : [role_edit],
      buttons       : [{
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            roleWindow_edit.hide();
         }
      }, {
         text    : '保存',
         handler : function() {
            if (role_edit.getForm().isValid()) {
               var rece_obj_edit =
                                   formatItemSelectorValue(role_edit.getForm().getValues(true), ',');
               editFormPanel.getForm().findField('rece_obj').setValue(rece_obj_edit);
               roleWindow_edit.hide();
            }
         }
      }]
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
               fieldLabel : '通告ID',
               name       : 'notice_id_',
               id         : 'notice_id_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }, typeCombo_edit, modelCombo_edit]
         }, recieveBotton_edit, recieveRoleBotton_edit]
      }, {
         fieldLabel : '接收人员',
         name       : 'rece_obj',
         xtype      : 'textarea',
         readOnly   : 'true',
         allowBlank : false,
         anchor     : '70%'// 宽度百分比
      }, {
         fieldLabel : '标题', // 标签
         name       : 'title', // name:后台根据此name属性取值
         xtype      : 'textfield',
         allowBlank : false,
         anchor     : '70%'// 宽度百分比
      }, {
         fieldLabel : '内容',
         name       : 'content',
         xtype      : 'htmleditor',
         anchor     : '100%'
      }, {
         name  : 'notice_id',
         xtype : 'hidden'
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : document.body.clientWidth - 400,
      height        : document.body.clientHeight - 100,
      resizable     : true,
      draggable     : true,
      title         : '修改通告信息',
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
            var model = editFormPanel.getForm().findField('model_id').getValue();
            if (model == "1" || model == "2") {
               editFormPanel.form.submit({
                  url       : './notice.ered?reqCode=updateItem',
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
            else if (model == "3") {// 全部用户
               editFormPanel.form.submit({
                  url       : './notice.ered?reqCode=updateAllUserItem',
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
            else if (model == "4") {// 角色
               editFormPanel.form.submit({
                  url       : './notice.ered?reqCode=updateAllUserItem',
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
         grid.getSelectionModel().selectFirstRow();
      }
      record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      app_rece_obj = record.get('rece_obj');
      editWindow.show();
      editFormPanel.getForm().loadRecord(record);
      Ext.getCmp('notice_id_').setValue(record.get('notice_id'));
      var model = record.get('model_id');
      if (model == "1" || model == "2") {
         checkedStore.load({
            params : {
               rece_obj : record.get('rece_obj')
            }
         });
         noCheckedStore.load({
            params : {
               rece_obj : record.get('rece_obj')
            }
         });
         recieveRoleBotton_edit.hide();
         recieveBotton_edit.show();
      }
      else if (model == "3") {

         recieveRoleBotton_edit.hide();
         recieveBotton_edit.hide();
      }
      else if (model == "4") {
         checkedRoleStore.load({
            params : {
               rece_obj : record.get('rece_obj')
            }
         });
         noCheckedRoleStore.load({
            params : {
               rece_obj : record.get('rece_obj')
            }
         });
         recieveRoleBotton_edit.show();
         recieveBotton_edit.hide();
      }
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的通告信息!'); 
         return;
      }
      var strChecked = jsArray2JsString(rows, 'notice_id');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './notice.ered?reqCode=deleteItem',
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