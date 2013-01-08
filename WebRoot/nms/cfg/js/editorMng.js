/**
 * 编辑控件管理
 * 
 * @author huangwei
 * @since 2011-08-22
 */
Ext.onReady(function() {

   /**
    * 编辑控件树
    */
   var editorTree = new Ext.tree.TreePanel({
      id         : 'tree',
      loader     : new Ext.tree.TreeLoader({
         baseAttrs : {},
         dataUrl   : './editormng.ered?reqCode=queryEditor'
      }),
      root       : new Ext.tree.AsyncTreeNode({
         text     : '编辑控件类型',
         expanded : true,
         id       : '00'
      }),
      applyTo    : 'editorTreeDiv',
      autoScroll : false,
      animate    : false,
      useArrows  : false,
      border     : false,
      tbar       : [{
         text    : '展开',
         iconCls : 'expand-allIcon',
         handler : function() {
            editorTree.expandAll();
         }
      }, '-', {
         text    : '收缩',
         iconCls : 'collapse-allIcon',
         handler : function() {
            editorTree.collapseAll();
            editorTree.root.expand();
         }
      }]
   });

   editorTree.on('click', function(node) {
      editorcode = node.attributes.id;
      store.load({
         params : {
            start      : 0,
            limit      : 100,
            editorcode : editorcode
         }
      });
   });

   editorTree.root.select();

   function formatNodeIdForEditor(nodeid) {
      if (nodeid.length == 2) {
         if (nodeid == '00') {
            return 'root';
         }
         else {
            return 'subEditor';
         }
      }
      if (nodeid.length > 2) {
         return 'editor';
      }
   };

   var contextMenu1 = new Ext.menu.Menu({
      items : [{
         id      : 'addEditorType_btn',
         text    : '添加控件类型',
         iconCls : 'addIcon',
         handler : function(node) {
            initSubEditorForAdd();
         }
      }]
   });

   var contextMenu2 = new Ext.menu.Menu({
      items : [{
         id      : 'addEditor_btn',
         text    : '添加控件',
         iconCls : 'addIcon',
         handler : function(node) {
            initEditorForAdd();
         }
      }, '-', {
         id      : 'editEditorType_btn',
         text    : '修改控件类型',
         iconCls : 'edit1Icon',
         handler : function(node) {
            initSubEditorForEdit();
         }
      }, {
         id      : 'delEditorType_btn',
         text    : '删除控件类型',
         iconCls : 'deleteIcon',
         handler : function(node) {
            deleteSubEditor();
         }
      }]
   });

   var contextMenu3 = new Ext.menu.Menu({
      items : [{
         id      : 'editEditor_btn',
         text    : '修改控件',
         iconCls : 'edit1Icon',
         handler : function(node) {
            initEditorForEdit();
         }
      }, {
         id      : 'delEditor_btn',
         text    : '删除控件',
         iconCls : 'deleteIcon',
         handler : function(node) {
            deleteEditor();
         }
      }]
   });

   function createContextMenu(nodeid) {
      var type = formatNodeIdForEditor(nodeid);
      switch (type) {
         case "root" :// 根节点
            return contextMenu1;
            break;
         case "subEditor" :
            return contextMenu2;
            break;
         case "editor" :
            return contextMenu3;
            break;
      }
   }

   // 添加树节点右击菜单
   editorTree.on('contextmenu', function(node, e) {
      e.preventDefault();
      node.select();
      var contextMenu = createContextMenu(node.id);
      contextMenu.showAt(e.getXY());
   });

   // =======添加新控件类型
   var editortypeCombobox = new Ext.form.ComboBox({
      name           : 'editortype',
      hiddenName     : 'editortype',
      store          : editortypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      value          : '0',
      fieldLabel     : '控件类型',
      emptyText      : '请选择...',
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : "70%"
   });

   var subEditorWindow, subEditorForm;
   subEditorForm = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 60,
      frame      : true,
      items      : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            defaultType : 'textfield',
            items       : [{
               xtype : 'hidden',
               name  : 'windowmodel'
            }, {
               xtype : 'hidden',
               name  : 'subcode'
            }, {
               xtype : 'hidden',
               name  : 'editorcode'
            }, {
               fieldLabel : '控件编码',
               name       : 'editorcode',
               anchor     : '50%',
               fieldClass : 'x-custom-field-disabled',
               name       : 'editorcode_'
            }, {
               fieldLabel : '控件名称',
               name       : 'editorname',
               anchor     : '70%',
               allowBlank : false,
               labelStyle : 'color:A62017;'
            }, editortypeCombobox, {
               fieldLabel : '备注',
               name       : 'note',
               anchor     : '100%',
               xtype      : 'textarea',
               height     : 60
            }]
         }]
      }]
   });
   subEditorWindow = new Ext.Window({
      layout        : 'fit',
      width         : 380, // 窗口宽度
      height        : 200, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      pageY         : 100, // 页面定位Y坐标
      animateTarget : Ext.getBody(),
      pageX         : document.body.clientWidth / 2 - 380 / 2, // 页面定位X坐标
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '添加控件类型',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      items         : [subEditorForm],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            saveSubEditor();
         }
      }, {
         text    : '重置',
         id      : 'btnReset',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(subEditorForm.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            subEditorWindow.hide();
         }
      }]
   });

   /**
    * 修改编辑控件初始化
    */
   function initSubEditorForEdit() {
      var node = editorTree.getSelectionModel().getSelectedNode();
      subEditorForm.form.reset();
      subEditorForm.form.setValues({
         'editorcode_' : node.id,
         'editorcode'  : node.id,
         'editorname'  : node.attributes.editorname,
         'editortype'  : node.attributes.editortype,
         'note'        : node.attributes.note,
         'windowmodel' : 'edit'
      });
      subEditorWindow.show();
      subEditorWindow.setTitle('<span style="font-weight:normal">修改编辑控件类型</span>');
      Ext.getCmp('btnReset').hide();
   }

   /**
    * 新增编辑控件初始化
    */
   function initSubEditorForAdd() {
      var node = editorTree.getSelectionModel().getSelectedNode();
      var flag = subEditorForm.form.findField('windowmodel').getValue();
      if (typeof(flag) != 'undefined') {
         subEditorForm.form.getEl().dom.reset();
      }
      else {
         clearForm(subEditorForm.getForm());
      }
      subEditorForm.form.setValues({
         'windowmodel' : 'add',
         'subcode'     : node.id
      });
      subEditorWindow.show();
      subEditorWindow.setTitle('<span style="font-weight:normal">新增控件类型</span>');
      Ext.getCmp('btnReset').show();
   }

   /**
    * 保存控件类型数据
    */
   function saveSubEditor() {
      if (!subEditorForm.form.isValid()) {
         return;
      }
      subEditorForm.form.submit({
         url       : './editormng.ered?reqCode=saveSubEditor',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            subEditorWindow.hide();
            var node = editorTree.getSelectionModel().getSelectedNode();
            refreshGrid(node.id);
            refreshNode(node.id);
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            Ext.MessageBox.alert('提示', action.result.msg);
         }
      });
   };

   /**
    * 删除控件类型
    */
   function deleteSubEditor() {
      var node = editorTree.getSelectionModel().getSelectedNode();
      var parentNode = node.parentNode;
      var tipcontent = '';
      if (!node.isLeaf()) {
         tipcontent = '您选择的控件类型[' + node.text + ']包含配置好的控件，我们将一并删除这些控件，您确定要删除吗？';
      }
      Ext.Msg.confirm('请确认', tipcontent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './editormng.ered?reqCode=deleteEditor',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  refreshGrid(parentNode.id);
                  refreshNode(parentNode.id);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  editorcode : node.id
               }
            });
         }
      });
   }

   // 编辑控件 =======================
   var editorModelStore = new Ext.data.SimpleStore({
      fields : ['value', 'text'],
      data   : [['0', '0 无值'], ['1', '1 本地json数据源'], ['2', '2 远程db数据源']]
   });
   var editorModelCombo = new Ext.form.ComboBox({
      name           : 'editormodel',
      hiddenName     : 'editormodel',
      store          : editorModelStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      value          : '0',
      fieldLabel     : '控件数据源',
      emptyText      : '请选择...',
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : "70%"
   });

   var editordisabledCombo = new Ext.form.ComboBox({
      name           : 'editordisabled',
      hiddenName     : 'editordisabled',
      store          : new Ext.data.SimpleStore({
         fields : ['value', 'text'],
         data   : [['0', '0 可编辑'], ['1', '1 不可编辑']]
      }),
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      value          : '0',
      fieldLabel     : '是否允许编辑',
      emptyText      : '请选择...',
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : "70%"
   });

   var editorWindow, editorForm;
   editorForm = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      items      : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            defaultType : 'textfield',
            items       : [{
               xtype : 'hidden',
               name  : 'windowmodel'
            }, {
               xtype : 'hidden',
               name  : 'subcode'
            }, {
               xtype : 'hidden',
               name  : 'editorcode'
            }, {
               fieldLabel : '控件编码',
               anchor     : '50%',
               fieldClass : 'x-custom-field-disabled',
               name       : 'editorcode_',
               disabled   : true
            }, {
               fieldLabel : '控件名称',
               name       : 'editorname',
               anchor     : '70%',
               allowBlank : false,
               labelStyle : 'color:A62017;'
            }, editordisabledCombo, editortypeCombobox, editorModelCombo, {
               fieldLabel : '备注',
               name       : 'note',
               anchor     : '100%',
               xtype      : 'textarea',
               height     : 60
            }]
         }]
      }]
   });
   editorWindow = new Ext.Window({
      layout        : 'fit',
      width         : 380, // 窗口宽度
      height        : 280, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      pageY         : 100, // 页面定位Y坐标
      animateTarget : Ext.getBody(),
      pageX         : document.body.clientWidth / 2 - 380 / 2, // 页面定位X坐标
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '添加控件类型',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      items         : [editorForm],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            saveEditor();
         }
      }, {
         text    : '重置',
         id      : 'btnReset_',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(editorForm.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            editorWindow.hide();
         }
      }]
   });

   /**
    * 修改编辑控件初始化
    */
   function initEditorForEdit() {
      var node = editorTree.getSelectionModel().getSelectedNode();
      editorForm.form.reset();
      editorForm.form.setValues({
         'editorcode_'    : node.id,
         'editorcode'     : node.id,
         'editorname'     : node.attributes.editorname,
         'editortype'     : node.attributes.editortype,
         'editormodel'    : node.attributes.editormodel,
         'editordisabled' : node.attributes.editordisabled,
         'note'           : node.attributes.note,
         'windowmodel'    : 'edit'
      });
      editorWindow.show();
      editorWindow.setTitle('<span style="font-weight:normal">修改编辑控件</span>');
      Ext.getCmp('btnReset_').hide();
   }

   /**
    * 新增编辑控件初始化
    */
   function initEditorForAdd() {
      var node = editorTree.getSelectionModel().getSelectedNode();
      var flag = editorForm.form.findField('windowmodel').getValue();
      if (typeof(flag) != 'undefined') {
         editorForm.form.getEl().dom.reset();
      }
      else {
         clearForm(editorForm.getForm());
      }
      editorForm.form.setValues({
         'windowmodel' : 'add',
         'subcode'     : node.id
      });
      editorWindow.show();
      editorWindow.setTitle('<span style="font-weight:normal">新增控件</span>');
      Ext.getCmp('btnReset_').show();
   }

   /**
    * 保存控件类型数据
    */
   function saveEditor() {
      if (!editorForm.form.isValid()) {
         return;
      }
      editorForm.form.submit({
         url       : './editormng.ered?reqCode=saveSubEditor',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            editorWindow.hide();
            var node = editorTree.getSelectionModel().getSelectedNode();
            refreshGrid(node.id);
            refreshNode(node.id);
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            Ext.MessageBox.alert('提示', action.result.msg);
         }
      });
   };

   /**
    * 删除控件类型
    */
   function deleteEditor() {
      var node = editorTree.getSelectionModel().getSelectedNode();
      var parentNode = node.parentNode;
      var tipcontent = '';
      if (node.isLeaf()) {
         tipcontent = '您确定要删除[' + node.text + ']编辑控件吗，我们将一并删除监控参数映射表数据吗？';
      }
      Ext.Msg.confirm('请确认', tipcontent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './editormng.ered?reqCode=deleteEditor',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  refreshGrid(parentNode.id);
                  refreshNode(parentNode.id);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  editorcode : node.id
               }
            });
         }
      });
   }

   /**
    * 刷新指定节点
    */
   function refreshNode(nodeid) {
      var node = editorTree.getNodeById(nodeid);
      /* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
      if (Ext.isEmpty(node)) {
         editorTree.root.reload();
         return;
      }
      if (node.attributes.leaf) {
         node.parentNode.reload();
      }
      else {
         node.reload();
      }
   }

   /**
    * 控件表格刷新方法
    */
   function refreshGrid(nodeid) {
      var node = editorTree.getNodeById(nodeid);
      var editorcode = node.id;
      store.load({
         params   : {
            start      : 0,
            limit      : 100,
            editorcode : editorcode
         },
         callback : function(r, options, success) {
            if (editorcode == '00' && selEditorDataGrid != '') {
               editorcode = selEditorDataGrid;
            }
            for (var i = 0; i < r.length; i++) {
               var record = r[i];
               var editorcode_g = record.data.editorcode;
               if (editorcode_g == editorcode) {
                  editorDataGrid.getSelectionModel().selectRow(i);
               }
            }
         }
      });
   }

   /**
    * 数据集表格指定刷新方法
    */
   function refreshDataGrid() {
      var editorcode = selEditorDataGrid;
      store.load({
         params   : {
            start      : 0,
            limit      : 100,
            editorcode : editorcode
         },
         callback : function(r, options, success) {
            for (var i = 0; i < r.length; i++) {
               var record = r[i];
               var editorcode_g = record.data.editorcode;
               if (editorcode_g == editorcode) {
                  editorDataGrid.getSelectionModel().selectRow(i);
               }
            }
            // 当treenode没有选中，会有刷新问题！！
            var sel_record = editorDataGrid.getSelectionModel().getSelected();
            var editorcontent = sel_record.get('editorcontent');
            datastore.load({
               params : {
                  dirtydata : editorcontent
               }
            });
         }
      });
   }

   // 定义一个行级展开器(需要在CM和grid配置中加入)
   var expander = new Ext.grid.RowExpander({
      tpl              : new Ext.Template(
                                          '<p style=margin-left:70px;>',
                                          '<span style=color:Teal;>验证脚本：</span><br><span>{editorvalidation}</span>',
                                          '<br><span style=color:Teal;>数据集脚本：</span><br><span>{editorcontent}</span>',
                                          '</p>'),
      expandOnDblClick : false
   });

   /**
    * 编辑控件数据表格
    */
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), expander, {
      hidden    : true,
      header    : '控件ID',
      dataIndex : 'editorid'
   }, {
      header    : '控件编号',
      dataIndex : 'editorcode',
      width     : 60
   }, {
      header    : '控件名称',
      dataIndex : 'editorname',
      width     : 180,
      sortable  : true
   }, {
      header    : '控件类型',
      dataIndex : 'editortype',
      sortable  : true,
      width     : 80
   }, {
      header    : '数据加载模式',
      dataIndex : 'editormodel',
      renderer  : function(value) {
         if (value == '0') {
            return "无数据集";
         }
         else if (value == '1') {
            return "本地json数据源";
         }
         else if (value == '2') {
            return "远程db数据源";
         }
      },
      width     : 100
   }, {
      header    : '验证脚本',
      dataIndex : 'editorvalidation',
      width     : 130
   }, {
      header    : '错误提示',
      hidden    : true,
      dataIndex : 'editortip',
      width     : 60
   }, {
      header    : 'style',
      hidden    : true,
      dataIndex : 'editorstyle',
      width     : 80
   }, {
      header    : 'css-class',
      hidden    : true,
      dataIndex : 'editorclass',
      width     : 80
   }, {
      header    : '鼠标移上提示',
      hidden    : true,
      dataIndex : 'editortitle',
      width     : 80
   }, {
      header    : '是否运行编辑',
      dataIndex : 'editordisabled',
      width     : 80,
      renderer  : function(value) {
         if (value == 1) {
            return "不允许";
         }
         else {
            return "允许";
         }
      }
   }, {
      id        : 'note',
      header    : '备注',
      dataIndex : 'note',
      width     : 100
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './editormng.ered?reqCode=queryEditorList'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'editorid'
      }, {
         name : 'editorcode'
      }, {
         name : 'editorname'
      }, {
         name : 'editortype'
      }, {
         name : 'editormodel'
      }, {
         name : 'editorcontent'
      }, {
         name : 'editorvalidation'
      }, {
         name : 'editortip'
      }, {
         name : 'editorstyle'
      }, {
         name : 'editorclass'
      }, {
         name : 'editortitle'
      }, {
         name : 'note'
      }, {
         name : 'editordisabled'
      }])
   });

   var editorDataGrid = new Ext.grid.GridPanel({
      title            : '编辑控件初始化值',
      region           : 'center',
      store            : store,
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      border           : false,
      frame            : true,
      autoExpandColumn : 'note',
      plugins          : expander, // 行级展开
      cm               : cm,
      tbar             : [{
         id      : 'editorvalidation_btn',
         text    : '编辑控件验证信息',
         iconCls : 'page_editIcon',
         handler : function() {

            var sel_record = editorDataGrid.getSelectionModel().getSelected();
            if (Ext.isEmpty(sel_record)) {
               Ext.Msg.alert('提示', '请选选择需要设置验证信息的控件！');
               return;
            }
            var editorvalidation = sel_record.get('editorvalidation');
            var editorcode = sel_record.get('editorcode');
            var editorname = sel_record.get('editorname');
            var editorid = sel_record.get('editorid');
            var editorGrid_titile = '[ ' + editorcode + ' ]' + editorname
            formForEditorValidation.form.setValues({
               'windowmodel'      : 'edit',
               'editorcode'       : editorcode,
               'editorcode_'      : editorcode,
               'editorname'       : editorname,
               'editorid'         : editorid,
               'editorvalidation' : editorvalidation
            });
            winForEditorValidation.show();
            winForEditorValidation.setTitle('<span style="font-weight:normal">编辑'
                                            + editorGrid_titile + ' 控件验证信息</span>');
         }
      }]
   });
   store.load({
      params : {
         start : 0,
         limit : 100
      }
   });

   var selEditorDataGrid = '';// 解决刷新问题***变量在双击editorgird时初始化***
   editorDataGrid.addListener('rowdblclick', function() {
      var sel_record = editorDataGrid.getSelectionModel().getSelected();
      var editormodel = sel_record.get('editormodel');
      var editorcode = sel_record.get('editorcode');
      var editorname = sel_record.get('editorname');
      var editorcontent = sel_record.get('editorcontent');
      var editorid = sel_record.get('editorid');
      var editorGrid_titile;
      selEditorDataGrid = editorcode;
      if (editormodel == '1') {
         editorGrid_titile = ' 数据集';
         Ext.getCmp('editordata_add_btn').enable();
         Ext.getCmp('editordata_edit_btn').enable();
         Ext.getCmp('editordata_del_btn').enable();
         datastore.load({
            params : {
               editorid  : editorid,
               dirtydata : editorcontent
            }
         });
      }
      else {
         editorGrid_titile = ' 无列表数据';
         Ext.getCmp('editordata_add_btn').disable();
         Ext.getCmp('editordata_edit_btn').disable();
         Ext.getCmp('editordata_del_btn').disable();
         datastore.load();
         if (editormodel == '2') {
            formForM2.form.reset();
            formForM2.form.setValues({
               'windowmodel'   : 'edit',
               'editorid'      : editorid,
               'editorcode'    : editorcode,
               'editorcode_'   : editorcode,
               'editorname'    : editorname,
               'editorcontent' : editorcontent
            });
            winForM2.show();
         }
         else if (editormodel == '0') {

         }
      }
      dataGrid.setTitle('[' + editorcode + ']' + editorname + editorGrid_titile);
   });

   // ======== editorValidation
   var winForEditorValidation, formForEditorValidation;
   formForEditorValidation = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      items      : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            defaultType : 'textfield',
            items       : [{
               xtype : 'hidden',
               name  : 'windowmodel'
            }, {
               xtype : 'hidden',
               name  : 'editorid'
            }, {
               xtype : 'hidden',
               name  : 'editorcode'
            }, {
               fieldLabel : '控件编码',
               name       : 'editorcode_',
               anchor     : '60%',
               fieldClass : 'x-custom-field-disabled',
               disabled   : true
            }, {
               fieldLabel : '控件名称',
               name       : 'editorname',
               anchor     : '60%',
               fieldClass : 'x-custom-field-disabled',
               disabled   : true
            }, {
               fieldLabel : '验证信息',
               name       : 'editorvalidation',
               anchor     : '100%',
               xtype      : 'textarea',
               height     : 60,
               allowBlank : false
            }]
         }]
      }]
   });
   winForEditorValidation = new Ext.Window({
      layout        : 'fit',
      width         : 450, // 窗口宽度
      height        : 220, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      pageY         : 100, // 页面定位Y坐标
      animateTarget : Ext.getBody(),
      pageX         : document.body.clientWidth / 2 - 450 / 2, // 页面定位X坐标
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      iconCls       : 'page_editIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      items         : [formForEditorValidation],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (!formForEditorValidation.form.isValid()) {
               return;
            }
            formForEditorValidation.form.submit({
               url       : './editormng.ered?reqCode=saveSubEditor',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  winForEditorValidation.hide();
                  refreshDataGrid();
                  Ext.MessageBox.alert('提示', action.result.msg);
               },
               failure   : function(form, action) {
                  Ext.MessageBox.alert('提示', action.result.msg);
               }
            });
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            winForEditorValidation.hide();
         }
      }]
   });

   // ========model 2 的编辑框==========
   var winForM2, formForM2;
   formForM2 = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      items      : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            defaultType : 'textfield',
            items       : [{
               xtype : 'hidden',
               name  : 'windowmodel'
            }, {
               xtype : 'hidden',
               name  : 'editorid'
            }, {
               xtype : 'hidden',
               name  : 'editorcode'
            }, {
               fieldLabel : '控件编码',
               name       : 'editorcode_',
               anchor     : '60%',
               fieldClass : 'x-custom-field-disabled',
               disabled   : true
            }, {
               fieldLabel : '控件名称',
               name       : 'editorname',
               anchor     : '60%',
               fieldClass : 'x-custom-field-disabled',
               disabled   : true
            }, {
               fieldLabel : '数据集脚本',
               name       : 'editorcontent',
               anchor     : '100%',
               xtype      : 'textarea',
               height     : 60,
               allowBlank : false
            }]
         }]
      }]
   });
   winForM2 = new Ext.Window({
      layout        : 'fit',
      width         : 450, // 窗口宽度
      height        : 220, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      pageY         : 100, // 页面定位Y坐标
      animateTarget : Ext.getBody(),
      pageX         : document.body.clientWidth / 2 - 450 / 2, // 页面定位X坐标
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '编辑控件数据集脚本',
      iconCls       : 'page_editIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      items         : [formForM2],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (!formForM2.form.isValid()) {
               return;
            }
            formForM2.form.submit({
               url       : './editormng.ered?reqCode=saveSubEditor',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  winForM2.hide();
                  refreshDataGrid();
                  Ext.MessageBox.alert('提示', action.result.msg);
               },
               failure   : function(form, action) {
                  Ext.MessageBox.alert('提示', action.result.msg);
               }
            });
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            winForM2.hide();
         }
      }]
   });

   // ========model 1 的编辑框==========
   var winForM1, formForM1;
   formForM1 = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      items      : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            defaultType : 'textfield',
            items       : [{
               xtype : 'hidden',
               name  : 'windowmodel'
            }, {
               xtype : 'hidden',
               name  : 'editorid'
            }, {
               xtype : 'hidden',
               name  : 'editorcode'
            }, {
               xtype : 'hidden',
               name  : 'dirtydata'
            }, {
               xtype : 'hidden',
               name  : 'text_old'
            }, {
               xtype : 'hidden',
               name  : 'value_old'
            }, {
               fieldLabel : 'Text',
               name       : 'text',
               anchor     : '100%',
               labelStyle : 'color:A62017;',
               allowBlank : false
            }, {
               fieldLabel : 'Value',
               name       : 'value',
               anchor     : '100%',
               labelStyle : 'color:A62017;',
               allowBlank : false
            }]
         }]
      }]
   });
   winForM1 = new Ext.Window({
      layout        : 'fit',
      width         : 250, // 窗口宽度
      height        : 130, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      pageY         : 100, // 页面定位Y坐标
      animateTarget : Ext.getBody(),
      pageX         : document.body.clientWidth / 2 - 250 / 2, // 页面定位X坐标
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '编辑控件数据集脚本',
      iconCls       : 'page_editIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      items         : [formForM1],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (!formForM1.form.isValid()) {
               return;
            }
            formForM1.form.submit({
               url       : './editormng.ered?reqCode=saveEditorData',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  winForM1.hide();
                  refreshDataGrid();
                  Ext.MessageBox.alert('提示', action.result.msg);
               },
               failure   : function(form, action) {
                  Ext.MessageBox.alert('提示', action.result.msg);
               }
            });
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            winForM1.hide();
         }
      }]
   });

   // =====编辑控件数据集 grid===================
   var datacm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
      header    : 'TEXT',
      dataIndex : 'text',
      width     : 80,
      sortable  : true
   }, {
      header    : 'VALUE',
      dataIndex : 'value',
      width     : 80
   }]);

   var datastore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './editormng.ered?reqCode=queryEditorData'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 100,
         root          : 0
      }, [{
         name : 'text'
      }, {
         name : 'value'
      }])
   });

   var dataGrid = new Ext.grid.GridPanel({
      title       : '编辑控件数据集',
      region      : 'east',
      collapsible : true,
      width       : 250,
      store       : datastore,
      loadMask    : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows  : true,
      border      : false,
      frame       : true,
      cm          : datacm,
      tbar        : [{
         id       : 'editordata_add_btn',
         text     : '添加',
         disabled : true,
         iconCls  : 'page_addIcon',
         handler  : function() {
            var sel_record = editorDataGrid.getSelectionModel().getSelected();

            if (Ext.isEmpty(sel_record)) {
               Ext.Msg.alert('提示', '请在左边列表双击重新选择要编辑的控件！');
               return false;
            }

            var editorcode = sel_record.get('editorcode');
            var editorcontent = sel_record.get('editorcontent');
            var editorname = sel_record.get('editorname');
            var editorid = sel_record.get('editorid');
            var editorGrid_titile = '[ ' + editorcode + ' ]' + editorname

            if (editorcode != selEditorDataGrid) {
               Ext.Msg.alert('提示', '加载的数据源列表有错，请在左边列表双击重新加载！');
               return false;
            }
            var flag = formForM1.form.findField('windowmodel').getValue();
            if (typeof(flag) != 'undefined') {
               formForM1.form.getEl().dom.reset();
            }
            else {
               clearForm(formForM1.getForm());
            }
            formForM1.form.setValues({
               'windowmodel' : 'add',
               'editorcode'  : editorcode,
               'editorid'    : editorid,
               'dirtydata'   : editorcontent
            });
            winForM1.show();
            winForM1.setTitle('<span style="font-weight:normal">新增' + editorGrid_titile
                              + ' 数据集</span>');
         }
      }, {
         id       : 'editordata_edit_btn',
         text     : '修改',
         disabled : true,
         iconCls  : 'page_editIcon',
         handler  : function() {

            var sel_record = editorDataGrid.getSelectionModel().getSelected();

            if (Ext.isEmpty(sel_record)) {
               Ext.Msg.alert('提示', '请在左边列表双击重新选择要编辑的控件！');
               return false;
            }

            var editorcontent = sel_record.get('editorcontent');
            var editorcode = sel_record.get('editorcode');
            var editorname = sel_record.get('editorname');
            var editorid = sel_record.get('editorid');
            var editorGrid_titile = '[ ' + editorcode + ' ]' + editorname;

            if (editorcode != selEditorDataGrid) {
               Ext.Msg.alert('提示', '加载的数据源列表有错，请在左边列表双击重新加载！');
               return false;
            }

            var data_record = dataGrid.getSelectionModel().getSelected();
            if (Ext.isEmpty(data_record)) {
               Ext.MessageBox.alert('提示', '请先选择一条需要修改的数据！');
               return false;
            }

            formForM1.form.reset();
            formForM1.form.loadRecord(data_record);
            formForM1.form.setValues({
               'windowmodel' : 'edit',
               'editorcode'  : editorcode,
               'editorid'    : editorid,
               'dirtydata'   : editorcontent,
               'text_old'    : data_record.get('text'),
               'value_old'   : data_record.get('value')
            });
            winForM1.show();
            winForM1.setTitle('<span style="font-weight:normal">修改' + editorGrid_titile
                              + ' 数据集</span>');

         }
      }, {
         id       : 'editordata_del_btn',
         text     : '删除',
         disabled : true,
         iconCls  : 'page_delIcon',
         handler  : function() {
            var sel_record = editorDataGrid.getSelectionModel().getSelected();

            if (Ext.isEmpty(sel_record)) {
               Ext.Msg.alert('提示', '请在左边列表双击重新选择要编辑的控件！');
               return false;
            }

            var editorcontent = sel_record.get('editorcontent');
            var editorcode = sel_record.get('editorcode');

            if (editorcode != selEditorDataGrid) {
               Ext.Msg.alert('提示', '加载的数据源列表有错，请在左边列表双击重新加载！');
               return false;
            }

            var datarecord = dataGrid.getSelectionModel().getSelected()
            if (Ext.isEmpty(datarecord)) {
               Ext.Msg.alert('提示', '请先选择一条需要删除的数据！');
               return;
            }
            var fieldvalue = datarecord.get('value');
            var fieldtext = datarecord.get('text');

            var tipcontent = '删除是不可恢复的，您确定要删除[' + fieldtext + ']数据吗？';
            Ext.Msg.confirm('请确认', tipcontent, function(btn, text) {
               if (btn == 'yes') {
                  showWaitMsg();
                  Ext.Ajax.request({
                     url     : './editormng.ered?reqCode=saveEditorData',
                     success : function(response) {
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        refreshDataGrid();
                        Ext.Msg.alert('提示', resultArray.msg);
                     },
                     failure : function(response) {
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        Ext.Msg.alert('提示', resultArray.msg);
                     },
                     params  : {
                        editorcode  : editorcode,
                        value       : fieldvalue,
                        text        : fieldtext,
                        dirtydata   : editorcontent,
                        windowmodel : 'del'
                     }
                  });
               }
            });
         }
      }]
   });

   function modifyEditorDataForModel1() {

   }

   /**
    * 编辑控件监控参数映射列表
    */
   var mapping_sm = new Ext.grid.CheckboxSelectionModel();
   var mapping_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), mapping_sm, {
      hidden    : true,
      header    : '参量ID',
      dataIndex : 'moncodeid'
   }, {
      header    : '控件ID	',
      hidden    : true,
      dataIndex : 'editorid'
   }, {
      header    : '协议编号',
      dataIndex : 'protype',
      width     : 60
   }, {
      header    : '监控参数类型',
      dataIndex : 'paramclass',
      sortable  : true,
      width     : 80
   }, {
      header    : '监控参数编号',
      dataIndex : 'paramcode',
      width     : 80
   }, {
      header    : '监控参数名称',
      dataIndex : 'paramname',
      id        : 'paramname'
   }, {
      header    : '数据类型',
      dataIndex : 'datatype',
      width     : 60
   }, {
      header    : '数据长度',
      dataIndex : 'datalen',
      width     : 60
   }, {
      header    : '控件名称',
      dataIndex : 'editorname',
      width     : 80
   }, {
      header    : '控件类型',
      dataIndex : 'editortype',
      width     : 80
   }]);

   var protypeCombobox = new Ext.form.ComboBox({
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型查询...',
      value          : '10',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var mapping_store = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : './editormng.ered?reqCode=queryMappingItems'
      }),
      baseParams : {
         protype : protypeCombobox.getValue()
      },
      reader     : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'meid'
      }, {
         name : 'moncodeid'
      }, {
         name : 'editorid'
      }, {
         name : 'protype'
      }, {
         name : 'paramclass'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramname'
      }, {
         name : 'datatype'
      }, {
         name : 'datalen'
      }, {
         name : 'dataunit'
      }, {
         name : 'alarmtype'
      }, {
         name : 'reflag'
      }, {
         name : 'sarithmetic'
      }, {
         name : 'rarithmetic'
      }, {
         name : 'htod'
      }, {
         name : 'needw'
      }, {
         name : 'detail'
      }, {
         name : 'reflagtype'
      }, {
         name : 'editorcode'
      }, {
         name : 'editorname'
      }, {
         name : 'editortype'
      }, {
         name : 'editormodel'
      }])
   });

   // 翻页排序时带上查询条件
   mapping_store.on('beforeload', function() {
      this.baseParams = {
         protype : protypeCombobox.getValue()
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
      mapping_store.reload({
         params : {
            start : 0,
            limit : bbar.pageSize
         }
      });
   });

   var bbar = new Ext.PagingToolbar({
      pageSize    : number,
      store       : mapping_store,
      displayInfo : true,
      displayMsg  : '显示{0}条到{1}条,共{2}条',
      plugins     : new Ext.ux.ProgressBarPager(), // 分页进度条
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_combo]
   })

   var isJoineditorType = new Ext.form.Checkbox({
      fieldLabel : '是否关联控件类型'
   });

   var mapping_tbar = new Ext.Toolbar({
      items : ['监控协议名称', protypeCombobox, {
         xtype : 'tbspacer',
         width : 20
      }, isJoineditorType, '是否关联控件类型', {
         xtype : 'tbspacer',
         width : 20
      }, {
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            queryCodeItem();
         }
      }, '-', {
         id      : 'addMapping_btn',
         text    : '添加映射',
         iconCls : 'page_addIcon',
         handler : function() {
            selectMoncodeInit();
         }
      }, '-', {
         id      : 'delMapping_btn',
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteItems();
         }
      }]
   });

   var mapping_grid = new Ext.grid.GridPanel({
      title            : '监控参数列表',
      region           : 'center',
      store            : mapping_store,
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      border           : false,
      frame            : true,
      autoExpandColumn : 'paramname',
      cm               : mapping_cm,
      sm               : mapping_sm,
      tbar             : mapping_tbar,
      bbar             : bbar
   });

   /**
    * 查询
    */
   function queryCodeItem() {
      var editorcode;
      if (isJoineditorType.checked) {
         var sel_record = editorDataGrid.getSelectionModel().getSelected();
         if (Ext.isEmpty(sel_record)) {
            Ext.Msg.alert('提示', '您选择了需要关联控件类型进行查询，请在上面表格中，单击选中一种控件！');
            return;
         }
         editorcode = sel_record.get('editorcode');
      }
      mapping_store.load({
         params : {
            start      : 0,
            limit      : bbar.pageSize,
            protype    : protypeCombobox.getValue(),
            editorcode : editorcode
         }
      });
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = mapping_grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的数据!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'meid');
      var tipContent = '删除的数据将不可恢复，您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './editormng.ered?reqCode=deleteMapping',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  mapping_store.reload();
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
   };

   /**
    * 监控对象标识
    */
   function MoncodeChoice(paramclassGrid) {
      var record = paramclassGrid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         // Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      if (ischoise) {
         ischoise = false;
         var paramcode = record.get('paramcode');
         var paramname = record.get('paramname');
      }

   }

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [{
         title       : '<span style="font-weight:normal">编辑控件展示</span>',
         iconCls     : 'layout_contentIcon',
         tools       : [{
            id      : 'refresh',
            handler : function() {
               editorTree.root.reload()
            }
         }],
         collapsible : true,
         width       : 200,
         minSize     : 140,
         maxSize     : 220,
         split       : true,
         border      : false,
         region      : 'west',
         autoScroll  : true,
         items       : [editorTree]
      }, {
         region : 'center',
         border : false,
         layout : 'border',
         items  : [{
            region : 'north',
            border : false,
            layout : 'border',
            height : document.body.clientHeight / 2,
            items  : [editorDataGrid, dataGrid]
         }, mapping_grid]
      }]
   });

   // editorPanel ===============

   var sel_protypeCombobox = new Ext.form.ComboBox({
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型',
      value          : protypeCombobox.getValue(),
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var sel_paramclassCombobox = new Ext.form.ComboBox({
      store          : paramclassStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择参数类型',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   sel_protypeCombobox.on('select', function() {
      sel_queryCodeItem();
   });

   sel_paramclassCombobox.on('select', function() {
      sel_queryCodeItem();
   });

   var addRoot = new Ext.tree.AsyncTreeNode({
      text     : '编辑控件',
      expanded : true,
      id       : '00'
   });
   var addDeptTree = new Ext.tree.TreePanel({
      loader     : new Ext.tree.TreeLoader({
         baseAttrs : {},
         dataUrl   : './editormng.ered?reqCode=queryEditor'
      }),
      root       : addRoot,
      autoScroll : true,
      animate    : false,
      useArrows  : false,
      border     : false
   });
   // 监听下拉树的节点单击事件
   addDeptTree.on('click', function(node) {
      if (!node.isLeaf()) return false;
      comboxWithTree.setValue(node.text);
      editorcode_ = node.id;
      editorid_ = node.attributes.editorid;
      comboxWithTree.collapse();
   });
   var comboxWithTree = new Ext.form.ComboBox({
      id            : 'edittypes',
      store         : new Ext.data.SimpleStore({
         fields : [],
         data   : [[]]
      }),
      editable      : false,
      emptyText     : '请选择编辑控件',
      fieldLabel    : '编辑控件',
      anchor        : '100%',
      mode          : 'local',
      triggerAction : 'all',
      width         : 250,
      maxHeight     : 390,
      listWidth     : 300,
      tpl           : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
      allowBlank    : false,
      onSelect      : Ext.emptyFn
   });

   // 监听下拉框的下拉展开事件
   comboxWithTree.on('expand', function() {
      // comboxWithTree.getEl().dom.reset();
      addDeptTree.render('addDeptTreeDiv');
      addDeptTree.root.expand();
      // addDeptTree.root.reload();
}  );

   var sel_sm = new Ext.grid.CheckboxSelectionModel();
   var sel_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sel_sm, {
      hidden    : true,
      header    : '参量ID',
      dataIndex : 'moncodeid'
   }, {
      header    : '协议编号',
      dataIndex : 'protype',
      width     : 60
   }, {
      header    : '类型编号',
      dataIndex : 'paramclass',
      width     : 60
   }, {
      header    : '类型名称',
      dataIndex : 'name',
      width     : 90
   }, {
      header    : '监控参数编号',
      dataIndex : 'paramcode',
      width     : 80
   }, {
      header    : '监控参数名称',
      dataIndex : 'paramname',
      id        : 'paramname'
   }, {
      header    : '数据类型',
      dataIndex : 'datatype',
      width     : 60
   }, {
      header    : '数据长度',
      dataIndex : 'datalen',
      width     : 60
   }]);

   var sel_store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './editormng.ered?reqCode=queryMoncodeListForSel'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'moncodeid'
      }, {
         name : 'protype'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramname'
      }, {
         name : 'paramclass'
      }, {
         name : 'name'
      }, {
         name : 'datatype'
      }, {
         name : 'datalen'
      }, {
         name : 'dataunit'
      }, {
         name : 'alarmtype'
      }, {
         name : 'reflag'
      }])
   });

   // 翻页排序时带上查询条件
   sel_store.on('beforeload', function() {
      this.baseParams = {
         protype    : sel_protypeCombobox.getValue(),
         paramclass : sel_paramclassCombobox.getValue()
      };
   });

   var sel_pagesize_combo = new Ext.form.ComboBox({
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
   var sel_number = parseInt(sel_pagesize_combo.getValue());
   sel_pagesize_combo.on("select", function(comboBox) {
      bbar.pageSize = parseInt(comboBox.getValue());
      sel_number = parseInt(comboBox.getValue());
      sel_store.reload({
         params : {
            start : 0,
            limit : bbar.pageSize
         }
      });
   });

   var sel_bbar = new Ext.PagingToolbar({
      pageSize    : sel_number,
      store       : sel_store,
      displayInfo : true,
      displayMsg  : '显示{0}条到{1}条,共{2}条',
      plugins     : new Ext.ux.ProgressBarPager(), // 分页进度条
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', sel_pagesize_combo]
   })

   var cmpPanel = Ext.get("selectMoncodeWindow");
   var sel_grid = new Ext.grid.GridPanel({
      // renderTo : 'MoncodeTableGrid',
      // height : cmpPanel.getComputedHeight() - 30,
      height           : document.body.clientHeight - 30,
      store            : sel_store,
      region           : 'center',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'paramname',
      cm               : sel_cm,
      sm               : sel_sm,
      tbar             : [sel_protypeCombobox, sel_paramclassCombobox, new Ext.form.TextField({
         id        : 'paramname',
         emptyText : '请输入监控名称或者监控标识',
         width     : 200
      }), comboxWithTree, {
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            sel_queryCodeItem();
         }
      }, {
         text    : '添加',
         iconCls : 'page_addIcon',
         handler : function() {
            insertMapping();
         }
      }],
      bbar             : sel_bbar
   });

   function insertMapping() {
      var protypename = sel_protypeCombobox.getValue();
      if (protypename == null) {
         Ext.Msg.alert('提示', '请先选中要协议类型!');
         return false;
      }
      var editorname = comboxWithTree.getValue();
      if (editorname == null || editorname == '') {
         Ext.Msg.alert('提示', '请先选中要指定的编辑控件!');
         return false;
      }

      var rows = sel_grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要添加的监控参数!');
         return false;
      }
      var moncodeid = jsArray2JsString(rows, 'moncodeid');
      var tipContent;
      tipContent =
                   '您要把协议是' + protypename + ',  监控参数为：' + moncodeid + '  -->指定编辑控件为[' + editorname
                      + '] ？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './editormng.ered?reqCode=insertMapping',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  sel_store.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  editorid  : editorid_,
                  moncodeid : moncodeid
               }
            });
         }
      });
   }

   /**
    * 根据条件查询代码表
    */
   function sel_queryCodeItem() {
      sel_store.load({
         params : {
            start      : 0,
            limit      : sel_bbar.pageSize,
            protype    : sel_protypeCombobox.getValue(),
            paramclass : sel_paramclassCombobox.getValue(),
            paramname  : Ext.getCmp('paramname').getValue()
         }
      });
   };

   var selectMoncodeWindow = new Ext.Window({
      // id : 'selectMoncodeWindow',
      layout        : 'fit',
      width         : document.body.clientWidth - 200,
      height        : document.body.clientHeight,
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '<span class="commoncss">监控对象标识</span>',
      iconCls       : 'page_addIcon',
      collapsible   : true,
      titleCollapse : true,
      maximizable   : true,
      buttonAlign   : 'right',
      border        : false,
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      constrain     : true,
      items         : [sel_grid]
   });

   selectMoncodeWindow.addListener('beforeclose', function() {
      mapping_store.reload({
         params : {
            start : 0,
            limit : bbar.pageSize
         }
      });
   });

   /**
    * 监控对象参数选择
    */
   var ischoise = false;
   function selectMoncodeInit() {
      var protype = protypeCombobox.getValue();
      if (protype == '') {
         Ext.Msg.alert('提示', '请先选择协议类型');
         return false;
      }
      /*
       * var sel_record = editorDataGrid.getSelectionModel().getSelected(); if
       * (Ext.isEmpty(sel_record)) { Ext.Msg.alert('提示', '请先选择编辑控件'); return
       * false; } var editorcode = sel_record.get('editorcode'); var editorname =
       * sel_record.get('editorname'); var editorid =
       * sel_record.get('editorid');
       */

      selectMoncodeWindow.show();
      sel_store.load({
         params : {
            start   : 0,
            limit   : sel_bbar.pageSize,
            protype : protypeCombobox.getValue()
            // editorcode : editorcode_
         }
      });
      // selectMoncodeWindow.load({
      // url : './editormng.ered?reqCode=initSelectMoncode',
      // scripts : true,
      // text : '引擎正在驱动页面,请等待...',
      // params : {
      // protype : protype
      // }
      // });
   }
});