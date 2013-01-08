/**
 * 直放站统计
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'stationname',
      header    : '站点名称',
      dataIndex : 'stationname',
      type      : 'string'
   }, {
      header    : '协议类型编码',
      dataIndex : 'protype',
      hidden    : true
   }, {
      id        : 'protypename',
      header    : '协议类型',
      dataIndex : 'protypename',
      type      : 'string'
   }, {
      header    : '设备类型编码',
      dataIndex : 'devicetype',
      hidden    : true
   }, {
      id        : 'devicename',
      header    : '设备类型',
      dataIndex : 'devicename',
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
   }, {
      id        : 'setdate',
      header    : '安装日期',
      dataIndex : 'setdate',
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
      id        : 'stattel',
      header    : '站点电话',
      dataIndex : 'stattel',
      type      : 'string'
   }, {
      id        : 'ip',
      header    : 'ip地址',
      dataIndex : 'ip',
      type      : 'string'
   }, {
      id        : 'basestatcode',
      header    : '基站编码',
      dataIndex : 'basestatcode',
      type      : 'string'
   }, {
      id        : 'note',
      header    : '站点记录',
      dataIndex : 'note',
      type      : 'string'

   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterStatistics.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'stationname',
         type : 'string'
      }, {
         name : 'protypename',
         type : 'string'
      }, {
         name : 'devicetype',
         type : 'string'
      }, {
         name : 'devicename',
         type : 'string'
      }, {
         name : 'stationid',
         type : 'string'
      }, {
         name : 'statsubid',
         type : 'string'
      }, {
         name : 'setdate',
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
         name : 'stattel',
         type : 'string'
      }, {
         name : 'ip',
         type : 'string'
      }, {
         name : 'basestatcode',
         type : 'string'
      }, {
         name : 'note',
         type : 'string'
      }])
   });

   var reportStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterStatistics.ered?reqCode=queryStatisticsReportList'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'stationname'
      }, {
         name : 'protype'
      }, {
         name : 'name'
      }, {
         name : 'devicetype'
      }, {
         name : 'devicename'
      }, {
         name : 'stationid'
      }, {
         name : 'statsubid'
      }, {
         name : 'province'
      }, {
         name : 'city'
      }, {
         name : 'visits'
      }])
   });

   var deviceStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterStatistics.ered?reqCode=queryDeviceReportList'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'stationname'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'devicetype'
      }, {
         name : 'name'
      }, {
         name : 'stationid'
      }, {
         name : 'statsubid'
      }, {
         name : 'province'
      }, {
         name : 'city'
      }, {
         name : 'visits'
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
      // renderTo : 'repeaterStatisticsGridTable',
      id               : 'repeaterStatisticsGrid',
      name             : 'repeaterStatisticsGrid',
      title            : '数据列表',
      height           : 400,
      store            : store,
      region           : 'center',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'note',
      cm               : cm,
      sm               : sm,
      tbar             : [{
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            store.reload();
         }
      }, '-', {
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            queryCodeItem();
         }
      }, '-', {
         text    : '统计',
         iconCls : 'exclamationIcon',
         handler : function() {
            var params = formPanel.getForm().getValues();
            reportStore.load({
               params : params
            });
         }
      }, '-', {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            Ext.getCmp('repeaterStatisticsFormTable').getForm().reset();
         }
      }, '-', {
         id      : 'importExcel_btn',
         text    : '导出Excel',
         iconCls : 'page_excelIcon',
         handler : function() {
            Ext.Msg.confirm('信息', '确定要导出EXCEL？', function(btn) {
               if (btn == 'yes') {
                  var url =
                            './repeaterStatistics.ered?reqCode=exportExcel&start=0&limit='
                               + bbar.pageSize + '&' + formPanel.getForm().getValues(true);
                  exportExcel(url);
               }
            });
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
    * 协议类型，设备类型级联下拉
    */
   var protocolCombo = new Ext.form.ComboBox({
      id             : 'protype_id',
      name           : 'protype',
      hiddenName     : 'protype',
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '90%'// 宽度百分比
   });

   var deviceTypeStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=devicetype'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });
   var deviceTypeCombo = new Ext.form.ComboBox({
      id             : 'devicetype_id',
      name           : 'devicetype',
      hiddenName     : 'devicetype',
      store          : deviceTypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '设备类型',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '90%'// 宽度百分比
   });

   protocolCombo.on('select', function() {
      deviceTypeCombo.reset();
      var value = protocolCombo.getValue();
      deviceTypeStore.load({
         params : {
            protype : value
         }
      });
   });

   /**
    * 城市级联下拉
    */
   var provinceCombo = new Ext.form.ComboBox({
      id             : 'province_id',
      name           : 'province',
      hiddenName     : 'province',
      store          : provinceStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '省份',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '60%'// 宽度百分比
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
      id             : 'city_id',
      name           : 'city',
      hiddenName     : 'city',
      store          : cityStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '地市',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '60%'// 宽度百分比
   });

   provinceCombo.on('select', function() {
      cityCombo.reset();
      var value = provinceCombo.getValue();
      cityStore.load({
         params : {
            parentsite : value
         }
      });
   });

   var formPanel;
   formPanel = new Ext.form.FormPanel({
      // renderTo : 'alarmStatisticsFormTable',
      region     : 'north',
      labelAlign : 'right',
      height     : 100,
      labelWidth : 60,
      frame      : true,
      id         : 'repeaterStatisticsFormTable',
      name       : 'repeaterStatisticsFromTable',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [protocolCombo, deviceTypeCombo, {
               fieldLabel : '安装地点', // 标签
               anchor     : '60%',
               id         : 'site_id',
               name       : 'site'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [provinceCombo, cityCombo, {
               fieldLabel : '直放站编号',
               name       : 'stationid',
               anchor     : '60%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '开始安装日期', // 标签
               anchor     : '60%',
               id         : 'beginsetdate',
               name       : 'beginsetdate',
               xtype      : 'datefield',
               format     : 'Y-m-d',
               editable   : 'false'
            }, {
               fieldLabel : '结束安装日期', // 标签
               anchor     : '60%',
               id         : "endsetdate",
               name       : 'endsetdate',
               xtype      : 'datefield',
               format     : 'Y-m-d',
               editable   : 'false'
            }]
         }]
      }]
   });

   /**
    * 统计结果列表
    */
   var StaResultGrid = new Ext.grid.GridPanel({
      // renderTo : 'alarmStatisticsGridTable',
      title            : '统计结果列表',
      height           : 400,
      store            : store,
      region           : 'center',
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'note',
      cm               : cm,
      sm               : sm
   });

   /**
    * 设备统计图表结果
    */
   var devicePanel = new Ext.Panel({
      // title : '设备统计图表',
      id       : 'devicePanel',
      region   : 'center',
      // renderTo : 'container',
      width    : 600,
      closable : true,
      height   : 400,
      layout   : 'fit',
      items    : {
         xtype         : 'piechart',
         url           : 'resource/extjs3.1/resources/charts.swf',
         store         : deviceStore,
         categoryField : 'name',
         dataField     : 'visits',
         extraStyle    : {
            legend : {
               display : 'bottom',
               padding : 4,
               font    : {
                  family : 'Tahoma',
                  size   : 12
               }
            }
         }
      }
   });

   deviceWindow = new Ext.Window({
      layout        : 'fit',
      width         : 650, // 窗口宽度
      height        : 450, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : false, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '设备统计图表',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      items         : [devicePanel]
   });

   /**
    * 统计结果图表
    */
   var resChartPanel = new Ext.Panel({
      title    : '直放站统计图表',
      id       : 'chartPanel',
      region   : 'center',
      // renderTo : 'container',
      width    : 800,
      closable : false,
      height   : 400,
      layout   : 'fit',
      items    : {
         xtype         : 'piechart',
         url           : 'resource/extjs3.1/resources/charts.swf',
         store         : reportStore,
         categoryField : 'name',
         dataField     : 'visits',
         extraStyle    : {
            legend : {
               display : 'bottom',
               padding : 4,
               font    : {
                  family : 'Tahoma',
                  size   : 12
               }
            }
         },
         listeners     : {
            itemclick : function(o) {
               var rec = reportStore.getAt(o.index);
               var protype = rec.get('protype');

               var params = formPanel.getForm().getValues();
               params.protype = protype;

               deviceStore.load({
                  params : params
               });
               deviceWindow.show();
            }
         }
      }
   });

   var tabPanel = new Ext.TabPanel({
      region         : 'center',
      activeTab      : 0,
      deferredRender : false,
      items          : [grid, resChartPanel]
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [formPanel, tabPanel]
   });

   /**
    * 根据条件查询代码表
    */
   function queryCodeItem() {
      var params = formPanel.getForm().getValues();
      params.start = 0;
      params.limit = bbar.pageSize;
      store.load({
         params   : params,
         callback : function(r, options, success) {
         }
      });
   }
   /**
    * 带上查询条件翻页排序
    */

   store.on('beforeload', function() {
      this.baseParams = formPanel.getForm().getValues();
   });
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