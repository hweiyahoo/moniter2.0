/**
 * 告警状况
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {

   var titleName = ["直放站名称", "安装地点", "省份", "地市", "厂家"];

   var arrKey = ["stationname", "site", "provincename", "cityname", "factname"];

   /**
    * 严重告警和重要告警
    */
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'repeaterid',
      header    : '直放站ID',
      dataIndex : 'repeaterid',
      type      : 'string',
      hidden    : true
   }, {
      id        : 'stationname',
      header    : '直放站名称（严重告警和重要告警）',
      dataIndex : 'stationname',
      type      : 'string'
   }, {
      id        : 'site',
      header    : '安装地点',
      dataIndex : 'site',
      type      : 'string'
   }, {
      header    : '省份编码',
      dataIndex : 'province',
      hidden    : true
   }, {
      id        : 'provincename',
      header    : '省份',
      dataIndex : 'provincename',
      type      : 'string'
   }, {
      header    : '地市编码',
      dataIndex : 'city',
      hidden    : true
   }, {
      id        : 'cityname',
      header    : '地市',
      dataIndex : 'cityname',
      type      : 'string'
   }, {
      id        : 'factname',
      header    : '厂家',
      dataIndex : 'factname',
      type      : 'string'

   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './alarmState.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'repeaterid',
         type : 'string'
      }, {
         name : 'stationname',
         type : 'string'
      }, {
         name : 'site',
         type : 'string'
      }, {
         name : 'province',
         type : 'string'
      }, {
         name : 'provincename',
         type : 'string'
      }, {
         name : 'city',
         type : 'string'
      }, {
         name : 'cityname',
         type : 'string'
      }, {
         name : 'factname',
         type : 'string'
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
   })
   /**
    * 表格
    */
   var grid = new Ext.grid.GridPanel({
      // renderTo : 'alarmStatisticsGridTable',
      id         : 'alarmStateGrid',
      name       : 'alarmStateGrid',
      title      : '严重告警和重要告警',
      store      : store,
      region     : 'center',
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      viewConfig : {
         // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
         forceFit : true
      },
      stripeRows : true,
      frame      : true,
      cm         : cm,
      sm         : sm,
      tbar       : [{
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            store.reload();
         }
      }, '-', {
         id      : 'importExcel_btn',
         text    : '导出EXCEL',
         iconCls : 'page_excelIcon',
         handler : function() {
            Ext.Msg.confirm('信息', '确定要导出EXCEL？', function(btn) {
               if (btn == 'yes') {
                  // var record = Ext.getCmp('alarmStateGrid').getStore();
                  // excel.saveToExcel(titleName, arrKey, record, [null]);
                  var url = './alarmState.ered?reqCode=exportExcelForAlarm';
                  var params = '&start=0&limit=' + bbar.pageSize;
                  exportExcel(url + params);
               }
            });
         }
      }],
      bbar       : bbar
   });
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   grid.addListener('rowdblclick', function() {
      detailWindowFunc(grid)
   });

   /**
    * 一般告警列表
    */
   var smGeneral = new Ext.grid.CheckboxSelectionModel();
   var cmGeneral = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), smGeneral, {
      id        : 'repeaterid',
      header    : '直放站ID',
      dataIndex : 'repeaterid',
      type      : 'string',
      hidden    : true
   }, {
      id        : 'stationname',
      header    : '直放站名称（一般告警）',
      dataIndex : 'stationname',
      type      : 'string'
   }, {
      id        : 'site',
      header    : '安装地点',
      dataIndex : 'site',
      type      : 'string'
   }, {
      header    : '省份编码',
      dataIndex : 'province',
      hidden    : true
   }, {
      id        : 'provincename',
      header    : '省份',
      dataIndex : 'provincename',
      type      : 'string'
   }, {
      dataIndex : 'city',
      hidden    : true
   }, {
      header    : '地市编码',
      id        : 'cityname',
      header    : '地市',
      dataIndex : 'cityname',
      type      : 'string'
   }, {
      id        : 'factname',
      header    : '厂家',
      dataIndex : 'factname',
      type      : 'string'

   }]);

   var storeGeneral = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './alarmState.ered?reqCode=queryGeneralItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'repeaterid',
         type : 'string'
      }, {
         name : 'stationname',
         type : 'string'
      }, {
         name : 'site',
         type : 'string'
      }, {
         name : 'province',
         type : 'string'
      }, {
         name : 'provincename',
         type : 'string'
      }, {
         name : 'city',
         type : 'string'
      }, {
         name : 'cityname',
         type : 'string'
      }, {
         name : 'factname',
         type : 'string'
      }])
   });

   var pagesize_comboGeneral = new Ext.form.ComboBox({
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
   var numberGeneral = parseInt(pagesize_comboGeneral.getValue());
   pagesize_comboGeneral.on("select", function(comboBox) {
      bbarGeneral.pageSize = parseInt(comboBox.getValue());
      number = parseInt(comboBox.getValue());
      storeGeneral.reload({
         params : {
            start : 0,
            limit : bbarGeneral.pageSize
         }
      });
   });

   var bbarGeneral = new Ext.PagingToolbar({
      pageSize    : numberGeneral,
      store       : storeGeneral,
      displayInfo : true,
      displayMsg  : '显示{0}条到{1}条,共{2}条',
      plugins     : new Ext.ux.ProgressBarPager(), // 分页进度条
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_comboGeneral]
   })
   /**
    * 表格
    */
   var gridGeneral = new Ext.grid.GridPanel({
      // renderTo : 'alarmStatisticsGridTable',
      id         : 'alarmStateGeneralGrid',
      name       : 'alarmStateGeneralGrid',
      title      : '一般警告',
      height     : document.body.clientHeight / 2,
      store      : storeGeneral,
      region     : 'south',
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      viewConfig : {
         // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
         forceFit : true
      },
      stripeRows : true,
      frame      : true,
      cm         : cmGeneral,
      sm         : smGeneral,
      tbar       : [{
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            storeGeneral.reload();
         }
      }, '-', {
         id      : 'importExcel_btn2',
         text    : '导出EXCEL',
         iconCls : 'page_excelIcon',
         handler : function() {
            Ext.Msg.confirm('信息', '确定要导出EXCEL？', function(btn) {
               if (btn == 'yes') {
                  // var record =
                  // Ext.getCmp('alarmStateGeneralGrid').getStore();
                  // excel.saveToExcel(titleName, arrKey, record, [null]);
                  var url = './alarmState.ered?reqCode=exportExcelForGeneralAlarm';
                  var params = '&start=0&limit=' + bbarGeneral.pageSize;
                  exportExcel(url + params);
               }
            });
         }
      }],
      bbar       : bbarGeneral
   });
   storeGeneral.load({
      params : {
         start : 0,
         limit : bbarGeneral.pageSize
      }
   });

   /**
    * 告警简要
    */
   var smConcise = new Ext.grid.CheckboxSelectionModel();
   var cmConcise = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'repeaterid',
      header    : '直放站ID',
      dataIndex : 'repeaterid',
      type      : 'string',
      hidden    : true
   }, {
      id        : 'stationname',
      header    : '直放站名称',
      dataIndex : 'stationname',
      type      : 'string'
   }, {
      id        : 'site',
      header    : '安装地点',
      dataIndex : 'site',
      type      : 'string'
   }, {
      id        : 'stationid',
      header    : '直放站编号',
      dataIndex : 'stationid',
      type      : 'string'
   }, {
      id        : 'statsubid',
      header    : '设备编号',
      dataIndex : 'statsubid',
      type      : 'string'

   }]);

   var storeConcise = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './alarmState.ered?reqCode=queryAlarmConcise'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'repeaterid',
         type : 'string'
      }, {
         name : 'stationname',
         type : 'string'
      }, {
         name : 'site',
         type : 'string'
      }, {
         name : 'stationid',
         type : 'string'
      }, {
         name : 'statsubid',
         type : 'string'
      }])
   });

   var alarmConciseGrid = new Ext.grid.GridPanel({
      // renderTo : 'alarmStatisticsGridTable',
      id         : 'alarmConciseGrid',
      name       : 'alarmConciseGrid',
      title      : '告警简要',
      store      : storeConcise,
      region     : 'center',
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      cm         : cmConcise,
      sm         : smConcise
   });

   /**
    * 详细信息
    */
   var smDetail = new Ext.grid.CheckboxSelectionModel();
   var cmDetail = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'paramname',
      header    : '监控对象名称',
      dataIndex : 'paramname',
      type      : 'string'
   }, {
      id        : 'alarmtime',
      header    : '告警时间',
      dataIndex : 'alarmtime',
      type      : 'string'
   }, {
      id        : 'resettime',
      header    : '恢复时间',
      dataIndex : 'resettime',
      type      : 'string'
   }, {
      id        : 'alarmnote',
      header    : '告警状况',
      dataIndex : 'alarmnote',
      type      : 'string'
   }, {
      id        : 'rval1',
      header    : '远程值',
      dataIndex : 'rval1',
      type      : 'string'
   }, {
      id        : 'alarmtype',
      header    : '告警级别',
      dataIndex : 'alarmtype',
      type      : 'string',
      hidden    : true
   }, {
      id        : 'alarmtypename',
      header    : '告警级别',
      dataIndex : 'alarmtypename',
      type      : 'string'
   }]);

   var storeDetail = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './alarmState.ered?reqCode=queryAlarmDetail'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'paramname',
         type : 'string'
      }, {
         name : 'alarmtime',
         type : 'string'
      }, {
         name : 'resettime',
         type : 'string'
      }, {
         name : 'alarmnote',
         type : 'string'
      }, {
         name : 'rval1',
         type : 'string'
      }, {
         name : 'alarmtype',
         type : 'string'
      }, {
         name : 'alarmtypename',
         type : 'string'
      }])
   });

   var alarmDetailGrid = new Ext.grid.GridPanel({
      // renderTo : 'alarmStatisticsGridTable',
      id         : 'alarmDetailGrid',
      name       : 'alarmDetailGrid',
      title      : '详细信息',
      height     : document.body.clientHeight / 2,
      store      : storeDetail,
      region     : 'south',
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      cm         : cmDetail,
      sm         : smDetail
   });

   /**
    * 行双击事件
    */
   gridGeneral.addListener('rowdblclick', function() {
      detailWindowFunc(gridGeneral);
   });

   var detailWindow = new Ext.Window({
      layout        : 'border',
      width         : 550, // 窗口宽度
      height        : 450, // 窗口高度
      resizable     : true,
      draggable     : true,
      title         : '告警信息',
      iconCls       : 'page_editICon',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      maximizable   : true,
      buttonAlign   : 'center',
      border        : false,
      animCollapse  : true,
      closeAction   : 'hide',
      animateTarget : Ext.getBody(),
      constrain     : true,
      items         : [alarmDetailGrid, alarmConciseGrid],
      buttons       : [{
         text    : '全部恢复',
         iconCls : 'acceptIcon',
         handler : function() {

         }
      }, {
         text    : '站点恢复',
         iconCls : 'acceptIcon',
         handler : function() {

         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            detailWindow.hide();
         }
      }, {
         text    : '导出',
         iconCls : 'page_excelIcon',
         handler : function() {

         }

      }]

   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [gridGeneral, grid]
   });

   /**
    * 初始化代码修改出口
    */
   function detailWindowFunc(gridObj) {
      var record = gridObj.getSelectionModel().getSelected();
      var repeater_id = record.data.repeaterid;
      storeConcise.load({
         params : {
            repeaterid : repeater_id
         }
      });

      storeDetail.load({
         params : {
            repeaterid : repeater_id
         }
      });
      detailWindow.show();
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

      storeGeneral.load({
         params : {
            start : 0,
            limit : bbarGeneral.pageSize
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

      storeGeneral.load({
         params : {
            start : 0,
            limit : bbarGeneral.pageSize
         }
      });

   }
});