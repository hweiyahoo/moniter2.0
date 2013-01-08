/**
 * 监控量参数
 * 
 * @author huangwei
 * @since 2011-09-5
 */
Ext.onReady(function() {
   var sel_protypeCombobox = new Ext.form.ComboBox({
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型',
      value          : protype_,
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
      proxy      : new Ext.data.HttpProxy({
         url : './editormng.ered?reqCode=queryMoncodeListForSel'
      }),
      baseParams : {
         protype    : protype_,
         editorcode : editorcode_
      },
      reader     : new Ext.data.JsonReader({
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
      renderTo         : 'MoncodeTableGrid',
      height           : cmpPanel.getComputedHeight() - 30,
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
      tbar             : [sel_protypeCombobox, sel_paramclassCombobox, comboxWithTree, {
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
   sel_store.load({
      params : {
         start : 0,
         limit : sel_bbar.pageSize
      }
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
            paramclass : sel_paramclassCombobox.getValue()
         }
      });
   }
});