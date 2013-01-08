/**
 * 车队管理
 * 
 * @author huangwei
 * @since 2011-01-5
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel({
      singleSelect : true
   });
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      hidden    : true,
      header    : '参量ID',
      dataIndex : 'moncodeid'
   }, {
      header    : '监控对象类型编号',
      hidden    : true,
      width     : 100,
      dataIndex : 'paramclass'
   }, {
      header    : '监控对象类型',
      dataIndex : 'name',
      width     : 130
   }, {
      header    : '监控对象标识',
      dataIndex : 'paramcode',
      width     : 100,
      sortable  : true
   }, {
      header    : '监控对象名称',
      dataIndex : 'paramname',
      sortable  : true,
      width     : 130
   }, {
      id        : 'detail',
      header    : '备注',
      dataIndex : 'detail'
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './cmdprase.ered?reqCode=selectParamcode&protype='+protype_
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'moncodeid'
      }, {
         name : 'name'
      }, {
         name : 'paramcode'
      }, {
         name : 'paramname'
      }, {
         name : 'paramclass'
      }, {
         name : 'detail'
      }])
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = {
         paramclass : Ext.getCmp('paramclass').getValue()
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

   var cmpPanel = Ext.get("selectParamClassWindow");
   var grid = new Ext.grid.GridPanel({
      id               : 'paramclassGrid',
      renderTo         : 'paramclassTableGrid',
      height           : cmpPanel.getComputedHeight() - 60,
      store            : store,
      region           : 'center',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'detail',
      cm               : cm,
      sm               : sm,
      tbar             : [new Ext.form.ComboBox({
         id             : 'paramclass',
         store          : paramclassStore,
         mode           : 'local',
         triggerAction  : 'all',
         valueField     : 'value',
         displayField   : 'text',
         fieldLabel     : '对象类型',
         emptyText      : '请对象类型查询...',
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
      }],
      bbar             : bbar
   });
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   /**
    * 根据条件查询代码表
    */
   function queryCodeItem() {
      store.load({
         params : {
            start      : 0,
            limit      : bbar.pageSize,
            paramclass : Ext.getCmp('paramclass').getValue()
         }
      });
   }

});