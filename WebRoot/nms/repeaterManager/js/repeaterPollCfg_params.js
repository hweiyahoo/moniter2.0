/**
 * 轮询策略监控量参数
 * 
 * @author huangwei
 * @since 2011-09-15
 */
Ext.onReady(function() {
   var paramclassCombobox = new Ext.form.ComboBox({
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

   paramclassCombobox.on('select', function() {
      queryCodeItem();
   });

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      hidden    : true,
      header    : '参量ID',
      dataIndex : 'moncodeid'
   }, {
      header    : '协议编号',
      dataIndex : 'protype',
      hidden    : true,
      width     : 60
   }, {
      header    : '协议名称',
      dataIndex : 'proname',
      width     : 130
   }, {
      header    : '类型编号',
      dataIndex : 'paramclass',
      hidden    : true,
      width     : 60
   }, {
      header    : '参数类型',
      dataIndex : 'classname',
      hidden    : true,
      width     : 100
   }, {
      header    : '监控参数编号',
      dataIndex : 'paramcode',
      width     : 80
   }, {
      header    : '监控参数名称',
      dataIndex : 'paramname',
      id        : 'paramname'
   }]);

   var store = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : './repcfg.ered?reqCode=queryMoncodeListForSel'
      }),
      baseParams : {
         pollployid : pollployid_,
         protype    : protype_,
         paramclass : paramclassCombobox.getValue()
      },
      reader     : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'moncodeid'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'paramclass'
      }, {
         name : 'classname'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramname'
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
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_combo]
   })

   var grid = new Ext.grid.GridPanel({
      title            : '可选监控量参数',
      store            : store,
      region           : 'center',
      layout           : 'fit',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'paramname',
      cm               : cm,
      sm               : sm,
      tbar             : [paramclassCombobox, {
         text    : '清空',
         iconCls : 'page_cleanIcon',
         handler : function() {
            cleanQueryItem();
         }
      }, {
         text    : '添加',
         iconCls : 'page_addIcon',
         handler : function() {
            addMoniterParams();
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

   function addMoniterParams() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要添加的监控量参数!');
         return false;
      }
      var proname = rows[0].get('proname');
      var paramcodes = jsArray2JsString(rows, 'paramcode');
      var tipContent;
      tipContent = '您要把协议是[' + proname + '],  监控参数为：[' + paramcodes + ']添加到轮询策略中？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './repcfg.ered?reqCode=updateMoniterParams',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  store_.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  pollployid : pollployid_,
                  paramcodes : paramcodes,
                  oper       : 'add'
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
            start      : 0,
            limit      : bbar.pageSize,
            pollployid : pollployid_,
            protype    : protype_,
            paramclass : paramclassCombobox.getValue()
         }
      });
      store_.load({
         params : {
            start      : 0,
            limit      : bbar_.pageSize,
            pollployid : pollployid_,
            protype    : protype_,
            paramclass : paramclassCombobox.getValue()
         }
      });
   };

   function cleanQueryItem() {
      paramclassCombobox.reset();
      queryCodeItem();
   }

   /**
    * 已经选择监控量参数
    */
   var sm_ = new Ext.grid.CheckboxSelectionModel();
   var cm_ = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm_, {
      hidden    : true,
      dataIndex : 'moncodeid'
   }, {
      header    : '协议编号',
      dataIndex : 'protype',
      hidden    : true,
      width     : 60
   }, {
      header    : '协议名称',
      dataIndex : 'proname',
      width     : 130
   }, {
      header    : '类型编号',
      dataIndex : 'paramclass',
      hidden    : true,
      width     : 60
   }, {
      header    : '监控参数编号',
      dataIndex : 'paramcode',
      width     : 80
   }, {
      header    : '监控参数名称',
      dataIndex : 'paramname',
      id        : 'paramname'
   }]);

   var store_ = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : './repcfg.ered?reqCode=queryMoncodeListForSet'
      }),
      baseParams : {
         protype    : protype_,
         pollployid : pollployid_,
         paramclass : paramclassCombobox.getValue()
      },
      reader     : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'moncodeid'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'paramclass'
      }, {
         name : 'classname'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramname'
      }])
   });

   var pagesize_combo_ = new Ext.form.ComboBox({
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
   var number_ = parseInt(pagesize_combo.getValue());
   pagesize_combo_.on("select", function(comboBox) {
      bbar_.pageSize = parseInt(comboBox.getValue());
      number_ = parseInt(comboBox.getValue());
      store_.reload({
         params : {
            start : 0,
            limit : bbar_.pageSize
         }
      });
   });

   var bbar_ = new Ext.PagingToolbar({
      pageSize    : number_,
      store       : store_,
      displayInfo : true,
      displayMsg  : '显示{0}条到{1}条,共{2}条',
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_combo_]
   })

   var grid_ = new Ext.grid.GridPanel({
      title            : '已经选择的轮询监控量参数',
      width            : 580,
      store            : store_,
      region           : 'east',
      layout           : 'fit',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'paramname',
      cm               : cm_,
      sm               : sm_,
      tbar             : [{
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            delMoniterParams();
         }
      }],
      bbar             : bbar_
   });
   store_.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   function delMoniterParams() {
      var rows = grid_.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的监控量参数!');
         return false;
      }
      var proname = rows[0].get('proname');
      var paramcodes = jsArray2JsString(rows, 'paramcode');
      var tipContent;
      tipContent = '您要把协议是[' + proname + '],  监控参数为：[' + paramcodes + ']从轮询策略中删除？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './repcfg.ered?reqCode=updateMoniterParams',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  store_.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  pollployid : pollployid_,
                  paramcodes : paramcodes,
                  oper       : 'del'
               }
            });
         }
      });
   };

   var cmpPanel = Ext.get("setMoniterParamsWindow");
   var panel = new Ext.Panel({
      layout   : 'border',
      frame    : false,
      border   : false,
      width    : cmpPanel.getComputedWidth() - 10,
      height   : cmpPanel.getComputedHeight() - 30,
      renderTo : 'moniterParamGridTable',
      items    : [grid, grid_]
   })
});