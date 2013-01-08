/**
 * 地区编码管理
 * 
 * @author huangwei
 * @since 2011-10-27
 */
Ext.onReady(function() {
   var root = new Ext.tree.AsyncTreeNode({
      text     : root_menuname,
      expanded : true,
      id       : '1_00',
      left     : '0'
   });
   var menuTree = new Ext.tree.TreePanel({
      loader     : new Ext.tree.TreeLoader({
         dataUrl    : './site.ered?reqCode=queryTreeItems',
         baseParams : {
            type : type
         }
      }),
      root       : root,
      title      : '',
      applyTo    : 'menuTreeDiv',
      autoScroll : false,
      animate    : false,
      useArrows  : false,
      border     : false,
      tbar       : [{
         text    : '展开',
         iconCls : 'expand-allIcon',
         handler : function() {
            menuTree.expandAll();
         }
      }, '-', {
         text    : '收缩',
         iconCls : 'collapse-allIcon',
         handler : function() {
            menuTree.collapseAll();
            menuTree.root.expand();
         }
      }]
   });

   menuTree.on('click', function(node) {
      reloadGridData(node);
   });
   menuTree.root.select();

   var contextmenuForRoot = new Ext.menu.Menu({
      id    : 'contextmenuForRoot',
      items : [{
         id      : 'addProvince_btn',
         text    : '添加铁路局',
         iconCls : 'page_addIcon',
         handler : function() {
            addInitForProvince();
         }
      }]
   });

   var contextmenuForProvince = new Ext.menu.Menu({
      id    : 'contextmenuForProvince',
      items : [{
         id      : 'addCity_btn',
         text    : '添加路段',
         iconCls : 'page_addIcon',
         handler : function() {
            addInitForCity();
         }
      }, {
         id      : 'editProvince_btn',
         text    : '修改铁路局',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            editInitForProvince();
         }
      }, {
         id      : 'delProvince_btn',
         text    : '删除铁路局',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteItemForProvince();
         }
      }]
   });

   var contextmenuForCity = new Ext.menu.Menu({
      id    : 'contextmenuForCity',
      items : [{
         id      : 'eidtCity_btn',
         text    : '修改路段',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            editInitForCity();
         }
      }, {
         id      : 'delCity_btn',
         text    : '删除路段',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteItems();
         }
      }]
   });

   function createContextMenu(node) {
      var menuid = node.attributes.id;
      var parentsite = node.attributes.parentsite;
      var flag = node.attributes.flag;
      if (menuid == '1_00') { // root
         return contextmenuForRoot;
      }
      else {
         if (parentsite == '00' && flag == '0') {// Province
            return contextmenuForProvince;
         }
         else if (parentsite != '00' && flag == '1') { // city
            return contextmenuForCity;
         }
      }
   };

   menuTree.on('contextmenu', function(node, e) {
      e.preventDefault();
      var menuid = node.attributes.id;
      // var menuname = node.attributes.text;
      // Ext.getCmp('parentmenuname').setValue(menuname);
      // Ext.getCmp('parentid').setValue(menuid);
      reloadGridData(node);
      node.select();
      node.expand();
      var contextMenu = createContextMenu(node);
      contextMenu.showAt(e.getXY());
   });

   function reloadGridData(node) {
      var id_ = node.id.split("_")[0];
      var node_ = node.id.split("_")[1];
      var node_param = node_;
      var id_param = id_;
      if (!node.leaf) {
         id_param = null;
      }
      else {
         node_param = null;
      }
      store.load({
         params   : {
            start : 0,
            limit : bbar.pageSize,
            code  : node_param,
            id    : id_param
         },
         callback : function(r, options, success) {
            for (var i = 0; i < r.length; i++) {
               var record = r[i];
               var siteid_g = record.data.siteid;
               if (siteid_g == id_) {
                  grid.getSelectionModel().selectRow(i);
               }
            }
         }
      });
   }

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'siteid',
      header    : '路段ID',
      dataIndex : 'siteid',
      type      : 'string',
      hidden    : true
   }, {
      dataIndex : 'sitecode',
      header    : '路段编码',
      dataIndex : 'sitecode',
      type      : 'string'
   }, {
      id        : 'sitename',
      header    : '路段名称',
      dataIndex : 'sitename',
      type      : 'string'
   }, {
      id        : 'parentsite',
      header    : '所属铁路局编码',
      dataIndex : 'parentsite',
      type      : 'string'
   }, {
      id        : 'parentsite',
      header    : '所属铁路局',
      dataIndex : 'parentname',
      type      : 'string',
      renderer  : function(value) {
         if (value == 'nms_root')
            return root_menuname
         else
            return value;
      }
   }, {
      id        : 'pusecount',
      header    : '标识1',
      dataIndex : 'pusecount',
      type      : 'string',
      hidden    : true
   }, {
      id        : 'cusecount',
      header    : '标识2',
      dataIndex : 'cusecount',
      type      : 'string',
      hidden    : true
   }]);

   var store = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : './site.ered?reqCode=queryItems& type=' + type
      }),
      baseParams : {
         type : type
      },
      reader     : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'siteid',
         type : 'string'
      }, {
         name : 'sitecode',
         type : 'string'
      }, {
         name : 'sitename',
         type : 'string'
      }, {
         name : 'parentsite',
         type : 'string'
      }, {
         name : 'flag',
         type : 'string'
      }, {
         name : 'parentname',
         type : 'string'
      }, {
         name : 'parentcode',
         type : 'string'
      }, {
         name : 'pusecount',
         type : 'string'
      }, {
         name : 'cusecount',
         type : 'string'
      }])
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      // this.baseParams = {};
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
      title      : '<span style="font-weight:normal">铁路信息</span>',
      iconCls    : 'application_view_listIcon',
      autoScroll : true,
      region     : 'center',
      store      : store,
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      viewConfig : {
         forceFit : true
      },
      // autoExpandColumn : 'remark',
      cm         : cm,
      sm         : sm,
      tbar       : [{
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
      bbar       : bbar
   });
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize,
         code  : '00'
      }
   });

   var cityEditWindow, cityFormPanel;
   var comboxWithTree;
   var addRoot = new Ext.tree.AsyncTreeNode({
      text     : '铁路局路段信息',
      expanded : true,
      id       : '1_00'
   });
   var addMenuTree = new Ext.tree.TreePanel({
      loader     : new Ext.tree.TreeLoader({
         dataUrl    : './site.ered?reqCode=queryProvinceList',
         baseParams : {
            type : type
         }
      }),
      root       : addRoot,
      autoScroll : true,
      animate    : false,
      useArrows  : false,
      border     : false
   });

   // 监听下拉树的节点单击事件
   addMenuTree.on('click', function(node) {
      comboxWithTree.setValue(node.text);
      Ext.getCmp("cityFormPanel").findById('parentsite').setValue(node.attributes.id);
      comboxWithTree.collapse();
   });

   comboxWithTree = new Ext.form.ComboBox({
      id            : 'parentname',
      store         : new Ext.data.SimpleStore({
         fields : [],
         data   : [[]]
      }),
      editable      : false,
      value         : ' ',
      emptyText     : '请选择...',
      fieldLabel    : '所属铁路局',
      anchor        : '100%',
      mode          : 'local',
      triggerAction : 'all',
      labelStyle    : 'color:A62017;',
      maxHeight     : 390,
      tpl           : "<tpl for='.'><div style='height:240px'><div id='addMenuTreeDiv'></div></div></tpl>",
      allowBlank    : false,
      onSelect      : Ext.emptyFn
   });
   comboxWithTree.on('expand', function() {
      addMenuTree.render('addMenuTreeDiv');
      addMenuTree.root.reload(); // 每次下拉都会加载数据

   });
   cityFormPanel = new Ext.form.FormPanel({
      id          : 'cityFormPanel',
      name        : 'cityFormPanel',
      defaultType : 'textfield',
      labelAlign  : 'right',
      labelWidth  : 65,
      frame       : false,
      bodyStyle   : 'padding:5 5 0',
      items       : [{
         fieldLabel : '编号',
         labelStyle : 'color:A62017;',
         name       : 'sitecode',
         // id : 'sitecode_',
         allowBlank : false,
         anchor     : '100%',
         regex      : /^[0-9a-fA-F]+$/,
         regexText  : '必须是16进制格式的数字编号！',
         maxLength  : 5
      }, {
         fieldLabel : '名称',
         name       : 'sitename',
         id         : 'sitename',
         allowBlank : false,
         labelStyle : 'color:A62017;',
         maxLength  : 20,
         anchor     : '100%'
      }, comboxWithTree, {
         id     : 'windowmode',
         name   : 'windowmode',
         hidden : true
      }, {
         id     : 'siteid',
         name   : 'siteid',
         hidden : true
      }, {
         id     : 'parentsite',
         name   : 'parentsite',
         hidden : true
      }, {
         id     : 'type',
         name   : 'type',
         hidden : true
      }]
   });
   cityEditWindow = new Ext.Window({
      layout        : 'fit',
      width         : 300,
      height        : 180,
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '<span class="commoncss">新增菜单</span>',
      // iconCls : 'page_addIcon',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      maximizable   : true,
      buttonAlign   : 'right',
      border        : false,
      animCollapse  : true,
      pageY         : 20,
      pageX         : document.body.clientWidth / 2 - 420 / 2,
      animateTarget : Ext.getBody(),
      constrain     : true,
      items         : [cityFormPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            var mode = Ext.getCmp('windowmode').getValue();
            if (mode == 'add')
               saveItem();
            else
               updateItem();
         }
      }, {
         text    : '重置',
         id      : 'btnReset',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(cityFormPanel.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            cityEditWindow.hide();
         }
      }]
   });
   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [{
         title       : '<span class="commoncss">功能菜单</span>',
         iconCls     : 'layout_contentIcon',
         tools       : [{
            id      : 'refresh',
            handler : function() {
               menuTree.root.reload()
            }
         }],
         collapsible : true,
         width       : 210,
         minSize     : 160,
         maxSize     : 280,
         split       : true,
         region      : 'west',
         autoScroll  : true,
         items       : [menuTree]
      }, {
         region : 'center',
         layout : 'fit',
         border : false,
         items  : [grid]
      }]
   });

   /**
    * 根据条件查询菜单
    */
   function queryMenuItem() {
      store.load({
         params : {
            start      : 0,
            limit      : bbar.pageSize,
            queryParam : Ext.getCmp('queryParam').getValue()
         }
      });
   }

   /**
    * 修改地市
    */
   function editInitForCity() {
      var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择您要修改的地区');
         return;
      }
      var rows = grid.getSelectionModel().getSelections();
      if (rows.length > 1) {
         Ext.Msg.alert('提示', '只允许选择一条数据进行修改!');
         return;
      }
      clearForm(cityFormPanel.getForm());
      cityFormPanel.getForm().loadRecord(record);
      cityEditWindow.show();
      cityEditWindow.setTitle('<span style="font-weight:normal">修改路段信息</span>');
      Ext.getCmp('windowmode').setValue('edit');
      Ext.getCmp('type').setValue(type);
      // Ext.getCmp('sitecode_').setValue(record.get('sitecode'));
      Ext.getCmp('btnReset').show();
      comboxWithTree.setDisabled(true);
   }

   /**
    * 新增地市
    */
   function addInitForCity() {
      var flag = cityFormPanel.form.findField('windowmode').getValue();
      if (typeof(flag) != 'undefined') {
         cityFormPanel.form.getEl().dom.reset();
      }
      else {
         clearForm(cityFormPanel.getForm());
      }
      var selectNode = menuTree.getSelectionModel().getSelectedNode();
      Ext.getCmp('parentname').setValue(selectNode.attributes.text);
      Ext.getCmp('parentsite').setValue(selectNode.attributes.sitecode);
      cityEditWindow.show();
      cityEditWindow.setTitle('<span style="font-weight:normal">新增路段信息</span>');
      Ext.getCmp('windowmode').setValue('add');
      Ext.getCmp('type').setValue(type);
      Ext.getCmp('btnReset').show();
      comboxWithTree.setDisabled(false);
   }

   /**
    * 新增省份
    */
   function addInitForProvince() {
      var flag = cityFormPanel.form.findField('windowmode').getValue();
      if (typeof(flag) != 'undefined') {
         cityFormPanel.form.getEl().dom.reset();
      }
      else {
         clearForm(cityFormPanel.getForm());
      }
      var selectNode = menuTree.getSelectionModel().getSelectedNode();
      Ext.getCmp('parentname').setValue(selectNode.text);
      Ext.getCmp('parentsite').setValue("00");
      cityEditWindow.show();
      cityEditWindow.setTitle('<span style="font-weight:normal">新增铁路局信息</span>');
      Ext.getCmp('windowmode').setValue('add');
      Ext.getCmp('type').setValue(type);
      Ext.getCmp('btnReset').show();
      comboxWithTree.setDisabled(true);
   }

   /**
    * 修改省份
    */
   function editInitForProvince() {
      var node = menuTree.getSelectionModel().getSelectedNode();
      clearForm(cityFormPanel.getForm());
      cityFormPanel.form.setValues({
         // 'sitecode_' : node.attributes.sitecode,
         'sitename'   : node.attributes.text,
         'parentname' : node.parentNode.text,
         'windowmode' : 'edit',
         'type'       : type,
         'siteid'     : node.attributes.siteid,
         'sitecode'   : node.attributes.sitecode,
         'parentsite' : node.attributes.parentsite
      });
      cityEditWindow.show();
      cityEditWindow.setTitle('<span style="font-weight:normal">修改铁路局信息</span>');
      Ext.getCmp('btnReset').show();
      comboxWithTree.setDisabled(true);
   }

   /**
    * 修改
    */
   function updateItem() {
      if (!cityFormPanel.form.isValid()) {
         return;
      }
      cityFormPanel.form.submit({
         url       : './site.ered?reqCode=updateItem',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            cityEditWindow.hide();
            store.reload();
            refreshNode();
            form.reset();
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            var msg = action.result.msg;
            Ext.MessageBox.alert('提示', msg);
         }
      });
   };

   /**
    * 保存菜单数据
    */
   function saveItem() {
      if (!cityFormPanel.form.isValid()) {
         return;
      }
      cityFormPanel.form.submit({
         url       : './site.ered?reqCode=insertItem',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            cityEditWindow.hide();
            store.reload();
            refreshNode();
            form.reset();
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            var msg = action.result.msg;
            Ext.MessageBox.alert('提示', msg);
            // Ext.getCmp('sitename').focus();
         }
      });
   };

   function deleteItemForProvince() {
      var fields = '';
      var isProvince = false;
      var node = menuTree.getSelectionModel().getSelectedNode();
      var pusecount = node.attributes.pusecount;
      var cusecount = node.attributes.cusecount;
      var parentsite = node.attributes.parentsite;
      if (parentsite == '00') {
         isProvince = true;
      }
      if (isProvince && pusecount > 0) {
         fields = fields + '[铁路局] ' + node.text + '<br>';
      }
      else if (!isProvince && cusecount > 0) {
         fields = fields + '[路段] ' + node.text + '<br>';
      }
      if (fields != '') {
         Ext.Msg.alert('提示', '<b>您选中铁路局在系统中正在使用</b><br>' + fields
                             + '<font color=red>正在使用不能删除!请重新选择！</font>');
         return;
      }
      var tipcontent = "";
      if (isProvince) {
         tipcontent = "你真的要删除选中的铁路局及其包含的所有路段吗？";
      }
      else {
         tipcontent = "你真的要删除选中的路段吗？"
      }

      var strChecked = node.attributes.siteid;
      var parentsites = node.attributes.parentsite;
      var sitecodes = node.attributes.sitecode;
      Ext.Msg.confirm('请确认', tipcontent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './site.ered?reqCode=deleteItem',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  node.parentNode.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  strChecked  : strChecked,
                  parentsites : parentsites,
                  sitecodes   : sitecodes
               }
            });
         }
      });

   };

   /**
    * 删除菜单
    */
   function deleteItems(pType, pMenuid) {
      var rows = grid.getSelectionModel().getSelections();
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的路段!');
         return;
      }
      var fields = '';
      var isProvince = false;
      for (var i = 0; i < rows.length; i++) {
         var pusecount = rows[i].get('pusecount');
         var cusecount = rows[i].get('cusecount');
         var parentsite = rows[i].get('parentsite');
         if (parentsite == '00') {
            isProvince = true;
         }
         if (parentsite == '00' && pusecount > 0) {
            fields = fields + '[省级] ' + rows[i].get('sitename') + '<br>';
         }
         else if (parentsite != '00' && cusecount > 0) {
            fields = fields + '[地市] ' + rows[i].get('sitename') + '<br>';
         }
      }
      if (fields != '') {
         Ext.Msg.alert('提示', '<b>您选中路段在系统中正在使用</b><br>' + fields
                             + '<font color=red>正在使用不能删除!请重新选择！</font>');
         return;
      }

      var tipcontent = "";
      if (isProvince) {
         tipcontent = "你真的要删除选中的铁路局及其包含的所有路段吗？";
      }
      else {
         tipcontent = "你真的要删除选中的路段吗？"
      }

      var strChecked = jsArray2JsString(rows, 'siteid');
      var parentsites = jsArray2JsString(rows, 'parentsite');
      var sitecodes = jsArray2JsString(rows, 'sitecode');
      Ext.Msg.confirm('请确认', tipcontent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './site.ered?reqCode=deleteItem',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  refreshNode();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  strChecked  : strChecked,
                  parentsites : parentsites,
                  sitecodes   : sitecodes
               }
            });
         }
      });
   };

   /**
    * 刷新指定节点
    */
   function refreshNode() {
      var node;
      var siteid = Ext.getCmp('siteid').getValue();
      var parentsite = Ext.getCmp('parentsite').getValue();
      node = menuTree.getSelectionModel().getSelectedNode();
      // if (siteid == '') {
      // node = menuTree.getSelectionModel().getSelectedNode();
      // }
      // else {
      // var rows = grid.getSelectionModel().getSelections();
      // node = menuTree.getNodeById(rows[0].get("siteid") + "_" +
      // rows[0].get("sitecode"));
      // }
      if (node.id == '1_00') {
         menuTree.root.reload();
         return false;
      }
      if (node.attributes.flag == '0' && parentsite != '00') {
         node.reload();
      }
      else {
         node.parentNode.reload();
      }

   }
});