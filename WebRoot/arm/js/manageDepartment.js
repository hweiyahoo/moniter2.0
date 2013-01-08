/**
 * 部门管理
 * 
 * @author XiongChun
 * @since 2010-04-11
 */
Ext.onReady(function() {
   var root = new Ext.tree.AsyncTreeNode({
      text     : root_deptname,
      expanded : true,
      id       : root_deptid,
      customid : 'nms'
   });
   var deptTree = new Ext.tree.TreePanel({
      loader     : new Ext.tree.TreeLoader({
         baseAttrs : {},
         dataUrl   : './organization.ered?reqCode=departmentTreeInit'
      }),
      root       : root,
      title      : '',
      applyTo    : 'deptTreeDiv',
      autoScroll : false,
      animate    : false,
      useArrows  : false,
      border     : false,
      tbar       : [{
         text    : '展开',
         iconCls : 'expand-allIcon',
         handler : function() {
            deptTree.expandAll();
         }
      }, '-', {
         text    : '收缩',
         iconCls : 'collapse-allIcon',
         handler : function() {
            deptTree.collapseAll();
            deptTree.root.expand();
         }
      }]
   });
   deptTree.root.select();
   deptTree.on('click', function(node) {
      deptid = node.attributes.id;
      store.load({
         params   : {
            start  : 0,
            limit  : bbar.pageSize,
            deptid : deptid
         },
         callback : function(r, options, success) {
            for (var i = 0; i < r.length; i++) {
               var record = r[i];
               var deptid_g = record.data.deptid;
               if (deptid_g == deptid) {
                  grid.getSelectionModel().selectRow(i);
                  var customid = record.data.customid;
                  changeEditStatus(customid);
               }
            }
         }
      });
   });

   function changeEditStatus(customid) {
      if (customid == 'dmOrg') {
         Ext.getCmp('edit_btn').disable();
         Ext.getDom('editStatuTip').style.display = "block";
      }
      else if (customid == 'sysOrg') {
         Ext.getCmp('edit_btn').enable();
         Ext.getDom('editStatuTip').style.display = "none";
      }
   }

   var sysOrg_contextMenu = new Ext.menu.Menu({
      id    : 'sysOrg_TreeContextMenu',
      items : [{
         text    : '新增部门',
         iconCls : 'page_addIcon',
         handler : function() {
            addInit('sysOrg');
         }
      }, {
         text    : '修改部门',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            editInit();
         }
      }, {
         text    : '删除部门',
         iconCls : 'page_delIcon',
         handler : function() {
            var selectModel = deptTree.getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            deleteDeptItems('2', selectNode.attributes.id);
         }
      }, {
         text    : '刷新节点',
         iconCls : 'page_refreshIcon',
         handler : function() {
            var selectModel = deptTree.getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            if (selectNode.attributes.leaf) {
               selectNode.parentNode.reload();
            }
            else {
               selectNode.reload();
            }
         }
      }]
   });

   var dmOrg_contextMenu = new Ext.menu.Menu({
      id    : 'dmOrg_TreeContextMenu',
      items : [{
         text    : '新增地区站点',
         iconCls : 'page_addIcon',
         handler : function() {
            addDmOrgInit();
         }
      }, {
         text    : '删除地区站点',
         iconCls : 'page_delIcon',
         handler : function() {
            var selectModel = deptTree.getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            deleteDeptItems('2', selectNode.attributes.id);
         }
      }, {
         text    : '刷新节点',
         iconCls : 'page_refreshIcon',
         handler : function() {
            var selectModel = deptTree.getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            if (selectNode.attributes.leaf) {
               selectNode.parentNode.reload();
            }
            else {
               selectNode.reload();
            }
         }
      }]
   });

   var dmOrg_contextMenuForCity = new Ext.menu.Menu({
      id    : 'dmOrg_TreeContextMenuForCity',
      items : [{
         text    : '删除地区站点',
         iconCls : 'page_delIcon',
         handler : function() {
            var selectModel = deptTree.getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            deleteDeptItems('2', selectNode.attributes.id);
         }
      }, {
         text    : '刷新节点',
         iconCls : 'page_refreshIcon',
         handler : function() {
            var selectModel = deptTree.getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            if (selectNode.attributes.leaf) {
               selectNode.parentNode.reload();
            }
            else {
               selectNode.reload();
            }
         }
      }]
   });

   var root_contextMenu = new Ext.menu.Menu({
      id    : 'rootTreeContextMenu',
      items : [{
         text    : '新增直放站管理',
         iconCls : 'page_addIcon',
         handler : function() {
            addInit('dmOrg');
         }
      }, {
         text    : '新增组织机构',
         iconCls : 'page_addIcon',
         handler : function() {
            addInit('sysOrg');
         }
      }, {
         text    : '修改根节点属性',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            editInit();
         }
      }, {
         text    : '刷新节点',
         iconCls : 'page_refreshIcon',
         handler : function() {
            var selectModel = deptTree.getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            if (selectNode.attributes.leaf) {
               selectNode.parentNode.reload();
            }
            else {
               selectNode.reload();
            }
         }
      }]
   });

   deptTree.on('contextmenu', function(node, e) {
      e.preventDefault();
      deptid = node.attributes.id;
      deptname = node.attributes.text;
      customid = node.attributes.customid;
      // Ext.getCmp('parentdeptname').setValue(deptname);
      // Ext.getCmp('parentid').setValue(deptid);
      store.load({
         params   : {
            start  : 0,
            limit  : bbar.pageSize,
            deptid : deptid
         },
         callback : function(r, options, success) {
            for (var i = 0; i < r.length; i++) {
               var record = r[i];
               var deptid_g = record.data.deptid;
               if (deptid_g == deptid) {
                  grid.getSelectionModel().selectRow(i);
                  var customid = record.data.customid;
                  changeEditStatus(customid);
               }
            }
         }
      });
      node.select();
      if (customid == 'nms') {
         root_contextMenu.showAt(e.getXY());
      }
      else if (customid == 'sysOrg') {
         sysOrg_contextMenu.showAt(e.getXY());
      }
      else if (customid == 'dmOrg') {
         if (deptid.length == 12) {
            dmOrg_contextMenuForCity.showAt(e.getXY());
         }
         else {
            dmOrg_contextMenu.showAt(e.getXY());
         }

      }
   });

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : '部门名称',
      dataIndex : 'deptname',
      width     : 130
   }, {
      header    : '业务对照码',
      dataIndex : 'customid',
      width     : 100
   }, {
      header    : '上级部门',
      dataIndex : 'parentdeptname',
      width     : 130
   }, {
      header    : '排序号',
      dataIndex : 'sortno',
      sortable  : true,
      width     : 50
   }, {
      header    : '节点类型',
      dataIndex : 'leaf',
      hidden    : true,
      renderer  : function(value) {
         if (value == '1')
            return '叶子节点';
         else if (value == '0')
            return '树枝节点';
         else
            return value;
      }
   }, {
      id        : 'parentid',
      header    : '父节点编号',
      hidden    : true,
      dataIndex : 'parentid'
   }, {
      id        : 'usercount',
      header    : '下属用户数目',
      hidden    : true,
      dataIndex : 'usercount'
   }, {
      id        : 'rolecount',
      header    : '下属角色数目',
      hidden    : true,
      dataIndex : 'rolecount'
   }, {
      header    : '部门编号',
      dataIndex : 'deptid',
      hidden    : false,
      hidden    : false,
      width     : 130,
      sortable  : true
   }, {
      id        : 'remark',
      header    : '备注',
      dataIndex : 'remark'
   }]);

   /**
    * 数据存储
    */
   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './organization.ered?reqCode=queryDeptsForManage'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'deptid'
      }, {
         name : 'deptname'
      }, {
         name : 'sortno'
      }, {
         name : 'customid'
      }, {
         name : 'parentdeptname'
      }, {
         name : 'leaf'
      }, {
         name : 'remark'
      }, {
         name : 'parentid'
      }, {
         name : 'usercount'
      }, {
         name : 'rolecount'
      }])
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = {
         queryParam : Ext.getCmp('queryParam').getValue()
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
      value         : '50',
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
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_combo]
   });
   var grid = new Ext.grid.GridPanel({
      title            : '<span style="font-weight:normal">部门信息表</span>',
      iconCls          : 'buildingIcon',
      renderTo         : 'deptGridDiv',
      height           : 500,
      // width:600,
      autoScroll       : true,
      region           : 'center',
      store            : store,
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'remark',
      cm               : cm,
      sm               : sm,
      tbar             : [
      {
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteDeptItems('1', '');
         }
      },
      '-',
      {
         text    : '修改',
         id      : 'edit_btn',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            editInit();
         }
      },
      '<div id="editStatuTip" style="display:none;"><font color="red">您选择的是直放站类型，不支持修改操作！</font></div>',
      '->', new Ext.form.TextField({
         id              : 'queryParam',
         name            : 'queryParam',
         emptyText       : '请输入部门名称',
         enableKeyEvents : true,
         listeners       : {
            specialkey : function(field, e) {
               if (e.getKey() == Ext.EventObject.ENTER) {
                  queryDeptItem();
               }
            }
         },
         width           : 130
      }), {
         text    : '查询',
         iconCls : 'previewIcon',
         handler : function() {
            queryDeptItem();
         }
      }, '-', {
         text    : '刷新',
         iconCls : 'arrow_refreshIcon',
         handler : function() {
            store.reload();
         }
      }],
      bbar             : bbar
   });

   store.load({
      params : {
         start     : 0,
         limit     : bbar.pageSize,
         firstload : 'true'
      }
   });

   grid.on('rowclick', function(grid, rowIndex, event) {
      var rows = grid.getSelectionModel().getSelections();
      if (rows.length >= 2) {
         Ext.getCmp('edit_btn').enable();
         Ext.getDom('editStatuTip').style.display = "none";
      }
      else if (rows.length == 1) {
         var record = grid.getSelectionModel().getSelected();
         var customid = record.data.customid;
         changeEditStatus(customid);
      }
      else {
         Ext.getCmp('edit_btn').enable();
         Ext.getDom('editStatuTip').style.display = "none";
      }
   });

   grid.on('sortchange', function() {
      // grid.getSelectionModel().selectFirstRow();
   });

   bbar.on("change", function() {
      // grid.getSelectionModel().selectFirstRow();
      // alert('asdf');
   });

   var addRoot = new Ext.tree.AsyncTreeNode({
      text     : root_deptname,
      expanded : true,
      id       : root_deptid
   });
   var addDeptTree = new Ext.tree.TreePanel({
      loader     : new Ext.tree.TreeLoader({
         baseAttrs  : {},
         baseParams : {
            customid : 'sysOrg'
         },
         dataUrl    : './organization.ered?reqCode=departmentTreeInit'
      }),
      root       : addRoot,
      autoScroll : true,
      animate    : false,
      useArrows  : false,
      border     : false
   });
   // 监听下拉树的节点单击事件
   addDeptTree.on('click', function(node) {
      comboxWithTree.setValue(node.text);
      // Ext.getCmp("addDeptFormPanel").findById('parentid').setValue(node.attributes.id);
      addDeptFormPanel.form.findField('parentid').setValue(node.attributes.id);
      comboxWithTree.collapse();
   });
   var comboxWithTree = new Ext.form.ComboBox({
      id            : 'parentdeptname',
      store         : new Ext.data.SimpleStore({
         fields : [],
         data   : [[]]
      }),
      editable      : false,
      value         : ' ',
      emptyText     : '请选择...',
      fieldLabel    : '上级部门',
      anchor        : '100%',
      mode          : 'local',
      triggerAction : 'all',
      maxHeight     : 390,
      // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
      tpl           : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
      allowBlank    : false,
      onSelect      : Ext.emptyFn
   });
   // 监听下拉框的下拉展开事件
   comboxWithTree.on('expand', function() {
      // 将UI树挂到treeDiv容器
      addDeptTree.render('addDeptTreeDiv');
      // addDeptTree.root.expand(); //只是第一次下拉会加载数据
      addDeptTree.root.reload(); // 每次下拉都会加载数据

   });

   var addDeptFormPanel = new Ext.form.FormPanel({
      id          : 'addDeptFormPanel',
      name        : 'addDeptFormPanel',
      defaultType : 'textfield',
      labelAlign  : 'right',
      labelWidth  : 65,
      frame       : false,
      bodyStyle   : 'padding:5 5 0',
      items       : [{
         fieldLabel : '部门名称',
         name       : 'deptname',
         allowBlank : false,
         anchor     : '99%'
      }, comboxWithTree, {
         fieldLabel : '业务对照码',
         name       : 'customid_',
         disabled   : true,
         fieldClass : 'x-custom-field-disabled',
         allowBlank : true,
         anchor     : '99%'
      }, {
         fieldLabel : '排序号',
         name       : 'sortno',
         allowBlank : true,
         anchor     : '99%'
      }, {
         fieldLabel : '备注',
         name       : 'remark',
         allowBlank : true,
         anchor     : '99%'
      }, {
         name   : 'parentid',
         hidden : true
      }, {
         name   : 'windowmode',
         hidden : true
      }, {
         name   : 'deptid',
         hidden : true
      }, {
         name   : 'parentid_old',
         hidden : true
      }, {
         name   : 'customid',
         hidden : true
      }]
   });

   var addDeptWindow = new Ext.Window({
      layout        : 'fit',
      width         : 400,
      height        : 205,
      resizable     : false,
      draggable     : true,
      closable      : true,
      modal         : true,
      closeAction   : 'hide',
      title         : '<span style="font-weight:normal">新增部门</span>',
      // iconCls : 'page_addIcon',
      collapsible   : true,
      titleCollapse : true,
      maximizable   : false,
      buttonAlign   : 'right',
      border        : false,
      animCollapse  : true,
      pageY         : 20,
      pageX         : document.body.clientWidth / 2 - 420 / 2,
      animateTarget : Ext.getBody(),
      constrain     : true,
      items         : [addDeptFormPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         id      : 'btn_id_save_update',
         handler : function() {
            if (runMode == '0') {
               Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
               return;
            }
            var mode = addDeptFormPanel.form.findField('windowmode').getValue();
            if (mode == 'add')
               saveDeptItem();
            else
               updateDeptItem();
         }
      }, {
         text    : '重置',
         id      : 'btnReset',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(addDeptFormPanel.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            addDeptWindow.hide();
         }
      }]
   });
   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [{
         title       : '<span style="font-weight:normal">组织机构</span>',
         iconCls     : 'chart_organisationIcon',
         tools       : [{
            id      : 'refresh',
            handler : function() {
               deptTree.root.reload()
            }
         }],
         collapsible : true,
         width       : 210,
         minSize     : 160,
         maxSize     : 280,
         split       : true,
         region      : 'west',
         autoScroll  : true,
         // collapseMode:'mini',
         items       : [deptTree]
      }, {
         region : 'center',
         layout : 'fit',
         items  : [grid]
      }]
   });

   /**
    * 根据条件查询部门
    */
   function queryDeptItem() {
      store.load({
         params : {
            start      : 0,
            limit      : bbar.pageSize,
            queryParam : Ext.getCmp('queryParam').getValue()
         }
      });
   }

   /**
    * 新增部门初始化
    */
   function addInit(addmodel) {
      var flag = addDeptFormPanel.form.findField('windowmode').getValue();
      if (typeof(flag) != 'undefined') {
         addDeptFormPanel.form.getEl().dom.reset();
      }
      else {
         clearForm(addDeptFormPanel.getForm());
      }
      var selectModel = deptTree.getSelectionModel();
      var selectNode = selectModel.getSelectedNode();
      var customid = selectNode.attributes.customid;
      comboxWithTree.setDisabled(true);
      if (customid == 'sysOrg') {
         comboxWithTree.setDisabled(false);
      }
      else if (customid == 'nms') {
         customid = addmodel;
      }
      // 表单控件设值
      addDeptFormPanel.form.setValues({
         'parentid'       : selectNode.attributes.id,
         'parentdeptname' : selectNode.attributes.text,
         'customid'       : customid,
         'customid_'      : customid,
         'windowmode'     : 'add'
      });
      addDeptWindow.show();
      addDeptWindow.setTitle('<span style="font-weight:normal">新增部门</span>');
      Ext.getCmp('btnReset').show();
   }

   /**
    * 保存部门数据
    */
   function saveDeptItem() {
      if (!addDeptFormPanel.form.isValid()) {
         return;
      }
      addDeptFormPanel.form.submit({
         url       : './organization.ered?reqCode=saveDeptItem',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            addDeptWindow.hide();
            store.reload();
            var parentid = addDeptFormPanel.form.findField('parentid').getValue();
            refreshNode(parentid);
            form.reset();
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            var msg = action.result.msg;
            Ext.MessageBox.alert('提示', '部门数据保存失败:<br>' + msg);
         }
      });
   }

   /**
    * 刷新指定节点
    */
   function refreshNode(nodeid) {
      var node = deptTree.getNodeById(nodeid);
      /* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
      if (Ext.isEmpty(node)) {
         deptTree.root.reload();
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
    * 修改部门初始化
    */
   function editInit() {

      var rows = grid.getSelectionModel().getSelections();
      if (rows.length >= 2) {
         Ext.MessageBox.alert('提示', '只能选择一条记录进行修改!');
         return;
      }
      var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.MessageBox.alert('提示', '请先选择要修改的部门!');
         return;
      }
      var customid = record.get('customid');
      if (customid == "dmOrg") {
         Ext.Msg.alert("提示", "抱歉，组织机构为直放站地区的，不允许修改，请删除重新创建！");
         return false;
      }
      if (record.get('leaf') == '0' || record.get('usercount') != '0'
          || record.get('rolecount') != '0') {
         comboxWithTree.setDisabled(true);
      }
      else {
         comboxWithTree.setDisabled(false);
      }
      if (record.get('deptid') == '001') {
         var a = Ext.getCmp('parentdeptname');
         a.emptyText = '已经是顶级部门';
      }
      else {
      }
      addDeptFormPanel.getForm().loadRecord(record);
      addDeptWindow.show();
      addDeptWindow.setTitle('<span style="font-weight:normal">修改部门</span>');
      // 表单控件设值
      addDeptFormPanel.form.setValues({
         'parentid_old' : record.get('parentid'),
         'customid_'    : record.get('customid'),
         'windowmode'   : 'edit'
      });
      Ext.getCmp('btnReset').hide();
   }

   /**
    * 修改部门数据
    */
   function updateDeptItem() {
      if (!addDeptFormPanel.form.isValid()) {
         return;
      }
      var parentid = addDeptFormPanel.form.findField('parentid').getValue();
      var parentid_old = addDeptFormPanel.form.findField('parentid_old').getValue();
      addDeptFormPanel.form.submit({
         url       : './organization.ered?reqCode=updateDeptItem',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            addDeptWindow.hide();
            store.reload();
            refreshNode(parentid);
            if (parentid != parentid_old) {
               refreshNode(parentid_old);
            }
            form.reset();
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            var msg = action.result.msg;
            Ext.MessageBox.alert('提示', '部门数据修改失败:<br>' + msg);
         }
      });
   }

   /**
    * 删除部门
    */
   function deleteDeptItems(pType, pDeptid) {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      for (var i = 0; i < rows.length; i++) {
         if (rows[i].get('deptid') == '001') {
            fields = fields + rows[i].get('deptname') + '<br>';
         }
      }
      if (fields != '') {
         Ext.Msg.alert('提示', '<b>您选中的项目中包含如下系统内置的只读项目</b><br>' + fields
                             + '<font color=red>只读项目不能删除!</font>');
         return;
      }
      if (Ext.isEmpty(rows)) {
         if (pType == '1') {
            Ext.Msg.alert('提示', '请先选中要删除的项目!');
            return;
         }
      }
      var strChecked = jsArray2JsString(rows, 'deptid');
      Ext.Msg.confirm('请确认',
      '<span style="color:red"><b>提示:</b>删除部门将同时删除部门下属人员和角色以及它们的权限信息,请慎重.</span><br>继续删除吗?',
      function(btn, text) {
         if (btn == 'yes') {
            if (runMode == '0') {
               Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
               return;
            }
            showWaitMsg();
            Ext.Ajax.request({
               url     : './organization.ered?reqCode=deleteDeptItems',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  if (pType == '1') {
                     deptTree.root.reload();
                  }
                  else {
                     deptTree.root.reload();
                  }
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  strChecked : strChecked,
                  type       : pType,
                  deptid     : pDeptid
               }
            });
         }
      });
   };

   function formatDMDeptId(deptid) {
      var dmdeptid = {};
      var province, city;
      deptid = deptid.substring(6, deptid.length); // 定位到有效位置
      if (deptid.length >= 3) {
         province = deptid.substring(0, 3);
      }
      if (deptid.length >= 6) {
         city = deptid.substring(3, 3);
      }
      dmdeptid.province = parseInt(province, 10);
      dmdeptid.city = parseInt(city, 10);
      return dmdeptid;
   }

   var provinceCombo = new Ext.form.ComboBox({
      hiddenName     : 'province',
      id             : 'provinceCombo',
      fieldLabel     : '省',
      emptyText      : '请选择省份...',
      triggerAction  : 'all',
      store          : provinceStore,
      displayField   : 'text',
      valueField     : 'value',
      loadingText    : '正在加载数据...',
      mode           : 'local',
      forceSelection : true,
      typeAhead      : true,
      resizable      : true,
      editable       : false,
      allowBlank     : false,
      anchor         : '100%',
      listeners      : {}
   });

   var cityStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=site'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var cityCombo = new Ext.form.ComboBox({
      hiddenName     : 'city',
      id             : 'cityCombo',
      fieldLabel     : '州、市',
      emptyText      : '请选择州市...',
      triggerAction  : 'all',
      store          : cityStore,
      displayField   : 'text',
      valueField     : 'value',
      loadingText    : '正在加载数据...',
      mode           : 'local',
      forceSelection : true,
      typeAhead      : true,
      resizable      : true,
      editable       : false,
      allowBlank     : false,
      anchor         : '100%'
   });

   /**
    * 直放站地区管理
    */
   var dmOrgFormPanel = new Ext.form.FormPanel({
      id          : 'dmOrgFormPanel',
      name        : 'dmOrgFormPanel',
      defaultType : 'textfield',
      labelAlign  : 'right',
      labelWidth  : 65,
      frame       : false,
      bodyStyle   : 'padding:5 5 0',
      items       : [provinceCombo, cityCombo, {
         fieldLabel : '业务对照码',
         name       : 'customid_',
         disabled   : true,
         fieldClass : 'x-custom-field-disabled',
         allowBlank : true,
         anchor     : '99%'
      }, {
         fieldLabel : '排序号',
         name       : 'sortno',
         allowBlank : true,
         anchor     : '99%'
      }, {
         fieldLabel : '备注',
         name       : 'remark',
         allowBlank : true,
         anchor     : '99%'
      }, {
         name   : 'parentid',
         hidden : true
      }, {
         name   : 'windowmode',
         hidden : true
      }, {
         name   : 'deptid',
         hidden : true
      }, {
         name   : 'deptname',
         hidden : true
      }, {
         name   : 'parentid_old',
         hidden : true
      }, {
         name   : 'customid',
         hidden : true
      }]
   });
   var dmOrgWindow = new Ext.Window({
      layout        : 'fit',
      width         : 400,
      height        : 205,
      resizable     : false,
      draggable     : true,
      closable      : true,
      modal         : true,
      closeAction   : 'hide',
      title         : '<span style="font-weight:normal">新增直放站地区</span>',
      // iconCls : 'page_addIcon',
      collapsible   : true,
      titleCollapse : true,
      maximizable   : false,
      buttonAlign   : 'right',
      border        : false,
      animCollapse  : true,
      pageY         : 20,
      pageX         : document.body.clientWidth / 2 - 420 / 2,
      animateTarget : Ext.getBody(),
      constrain     : true,
      items         : [dmOrgFormPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         id      : 'btn_dmOrg_save_update',
         handler : function() {
            var mode = dmOrgFormPanel.form.findField('windowmode').getValue();
            if (mode == 'add')
               saveDmOrgItem();
            else
               updateDeptItem();
         }
      }, {
         text    : '重置',
         id      : 'btn_dmOrg_reset',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(dmOrgFormPanel.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            dmOrgWindow.hide();
         }
      }]
   });

   /**
    * 新增直放站站点地区初始化
    */
   function addDmOrgInit() {
      var flag = dmOrgFormPanel.form.findField('windowmode').getValue();
      if (typeof(flag) != 'undefined') {
         dmOrgFormPanel.form.getEl().dom.reset();
      }
      else {
         clearForm(dmOrgFormPanel.getForm());
      }
      var selectModel = deptTree.getSelectionModel();
      var selectNode = selectModel.getSelectedNode();
      var deptid = selectNode.attributes.id;
      var deptids = formatDMDeptId(deptid);
      var parentid;
      if (isNaN(deptids.province)) {// 大区
         provinceCombo.setDisabled(false);
         cityCombo.setDisabled(true);
      }
      else if (isNaN(deptids.city)) {// 小区
         provinceCombo.setValue(deptids.province);
         provinceCombo.setDisabled(true);
         cityCombo.setDisabled(false);
         cityCombo.reset();
         cityStore.load({
            params   : {
               parentsite : deptids.province
            },
            callback : function(r, options, success) {
            }
         });
      }

      dmOrgFormPanel.form.setValues({
         'customid_'  : selectNode.attributes.customid,
         'customid'   : selectNode.attributes.customid,
         'parentid'   : deptid,
         'windowmode' : 'add'
      });
      dmOrgWindow.show();
      dmOrgWindow.setTitle('<span style="font-weight:normal">新增直放站地区</span>');
      Ext.getCmp('btn_dmOrg_reset').show();
   }

   function saveDmOrgItem() {
      if (!dmOrgFormPanel.form.isValid()) {
         return;
      }
      var selectModel = deptTree.getSelectionModel();
      var selectNode = selectModel.getSelectedNode();
      var deptid = selectNode.attributes.id;
      var deptids = formatDMDeptId(deptid);
      var id, text;
      if (isNaN(deptids.province)) {// 大区
         id = provinceCombo.getValue();
         text = Ext.get('provinceCombo').dom.value;
      }
      else if (isNaN(deptids.city)) {// 小区
         id = cityCombo.getValue();
         text = Ext.get('cityCombo').dom.value;
      }
      dmOrgFormPanel.form.findField('deptid').setValue(id);
      dmOrgFormPanel.form.findField('deptname').setValue(text);
      dmOrgFormPanel.form.submit({
         url       : './organization.ered?reqCode=saveDmOrgItem',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            dmOrgWindow.hide();
            store.reload();
            var parentid = dmOrgFormPanel.form.findField('parentid').getValue();
            refreshNode(parentid);
            form.reset();
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            var msg = action.result.msg;
            Ext.MessageBox.alert('提示', '部门数据保存失败:<br>' + msg);
         }
      });
   }

});