/**
 * 告警统计
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      dataIndex : 'alarmid',
      header    : '告警ID',
      hidden    : true
   }, {
      id        : 'alarmtime',
      header    : '告警时间',
      dataIndex : 'alarmtime',
      type      : 'string'
   }, {
      id        : 'stationid',
      header    : '直放站编号',
      dataIndex : 'stationid',
      type      : 'string'
   }, {
      id        : 'stationname',
      header    : '站点名称',
      dataIndex : 'stationname',
      type      : 'string'
   }, {
      id        : 'detail',
      header    : '告警内容',
      dataIndex : 'detail',
      type      : 'string'
   }, {
      header    : '告警类型',
      dataIndex : 'alarmtype',
      hidden    : true
   }, {
      id        : 'alarmtypename',
      header    : '告警级别',
      dataIndex : 'alarmtypename',
      type      : 'string',
      renderer  : function(value) {
         if (value == '一般告警')
            return '<font color="F9DE39">一般告警</font>';
         else if (value == '重要告警')
            return '<font color="F98039">重要告警</font>';
         else if (value == '严重告警') return '<font color="F92939">严重告警</font>';
      }
   }, {
      id        : 'aitemnum',
      header    : '告警次数',
      dataIndex : 'aitemnum',
      type      : 'string'
   }, {
      header    : '协议类型编号',
      dataIndex : 'protype',
      hidden    : true
   }, {
      id        : 'protypename',
      header    : '协议类型',
      dataIndex : 'protypename',
      type      : 'string'
   }, {
      header    : '设备类型编号',
      dataIndex : 'devicetype',
      hidden    : true
   }, {
      id        : 'devicename',
      header    : '设备类型',
      dataIndex : 'devicename',
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
         url : './alarmStatistics.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'alarmid',
         type : 'string'
      }, {
         name : 'stationname',
         type : 'string'
      }, {
         name : 'alarmtime',
         type : 'string'
      }, {
         name : 'detail',
         type : 'string'
      }, {
         name : 'alarmtype',
         type : 'string'
      }, {
         name : 'alarmtypename',
         type : 'string'
      }, {
         name : 'aitemnum',
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

   var storeResult = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './alarmStatistics.ered?reqCode=queryStatisticsForList'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'alarmid',
         type : 'string'
      }, {
         name : 'stationname',
         type : 'string'
      }, {
         name : 'alarmtime',
         type : 'string'
      }, {
         name : 'detail',
         type : 'string'
      }, {
         name : 'alarmtype',
         type : 'string'
      }, {
         name : 'alarmtypename',
         type : 'string'
      }, {
         name : 'aitemnum',
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
         url : './alarmStatistics.ered?reqCode=queryStatisticsReportList'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'repeaterid'
      }, {
         name : 'statsubid'
      }, {
         name : 'stationname'
      }, {
         name : 'visits'
      }, {
         name : 'name'
      }, {
         name : 'province'
      }, {
         name : 'city'
      }, {
         name : 'paramcode'
      }])
   });

   var paramCodeStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './alarmStatistics.ered?reqCode=queryParamCodeReportList'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'repeaterid'
      }, {
         name : 'statsubid'
      }, {
         name : 'stationname'
      }, {
         name : 'visits'
      }, {
         name : 'stationid'
      }, {
         name : 'province'
      }, {
         name : 'city'
      }, {
         name : 'paramcode'
      }, {
         name : 'name'
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
   });
   /**
    * 表格
    */
   var grid = new Ext.grid.GridPanel({
      // renderTo : 'alarmStatisticsGridTable',
      id         : 'alarmStatisticsGrid',
      name       : 'alarmStatisticsGrid',
      title      : '数据列表',
      height     : 400,
      store      : store,
      region     : 'center',
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      // autoExpandColumn : 'note',
      cm         : cm,
      sm         : sm,
      tbar       : [{
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
            params.start = 0;
            params.limit = bbar.pageSize;
            storeResult.load({
               params : params
            });
            reportStore.load({
               params : params
            });
         }
      }, '-', {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            Ext.getCmp('alarmStatisticsFormTable').getForm().reset();
         }
      }, '-', {
         id      : 'importExcel_btn',
         text    : '导出Excel',
         iconCls : 'page_excelIcon',
         handler : function() {
            Ext.Msg.confirm('信息', '确定要导出EXCEL？', function(btn) {
               if (btn == 'yes') {
                  var url =
                            './alarmStatistics.ered?reqCode=exportExcel&start=0&limit='
                               + bbar.pageSize + '&' + formPanel.getForm().getValues(true);
                  exportExcel(url);
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

   /**
    * 告警级别下拉
    */
   var alarmTypeCombo = new Ext.form.ComboBox({
      id             : 'alarmtype_id',
      name           : 'alarmtype',
      hiddenName     : 'alarmtype',
      store          : alarmTypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '告警级别',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '60%'// 宽度百分比
   });

   var formPanel;
   formPanel = new Ext.form.FormPanel({
      // renderTo : 'alarmStatisticsFormTable',
      region     : 'north',
      labelAlign : 'right',
      height     : 100,
      labelWidth : 80, // 标签宽度
      frame      : true,
      id         : 'alarmStatisticsFormTable',
      name       : 'alarmStatisticsFromTable',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            defaultType : 'textfield',
            border      : false,
            items       : [protocolCombo, deviceTypeCombo, alarmTypeCombo]
         }, {
            columnWidth : .33,
            layout      : 'form',
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
               fieldLabel : '开始告警时间', // 标签
               anchor     : '60%',
               id         : 'beginalarmtime',
               name       : 'beginalarmtime',
               xtype      : 'datefield',
               format     : 'Y-m-d',
               editable   : 'false'
            }, {
               fieldLabel : '结束告警时间', // 标签
               anchor     : '60%',
               id         : "endalarmtime",
               name       : 'endalarmtime',
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
      title            : '统计结果列表',
      height           : 400,
      store            : storeResult,
      region           : 'center',
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'note',
      cm               : cm,
      sm               : sm
   });

   /**
    * 监控量图表
    */
   var paramCodeChatPanel = new Ext.Panel({
      // title : '监控量告警统计图表',
      id       : 'paramCodeChatPanel',
      region   : 'center',
      // renderTo : 'container',
      width    : 550,
      closable : true,
      height   : 350,
      layout   : 'fit',
      items    : {
         xtype         : 'piechart',
         url           : 'resource/extjs3.1/resources/charts.swf',
         store         : paramCodeStore,
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

   paramCodeWindow = new Ext.Window({
      layout        : 'fit',
      width         : 650, // 窗口宽度
      height        : 450, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '监控量告警统计图表',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      items         : [paramCodeChatPanel]
      // listeners : {
   // 'hide' : {
   // fn : function() {
   // clearForm(formPanel.getForm());
   // }
   // }
   // }
}  );

   /**
    * 统计结果图表
    */

   var resChartPanel = new Ext.Panel({
      title    : '告警统计图表',
      id       : 'resChartPanel',
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
               var repeaterid = rec.get('repeaterid');
               var params = formPanel.getForm().getValues();
               params.repeaterid = repeaterid;
               paramCodeStore.load({
                  params : params
               });
               paramCodeWindow.show();
            }
         }
      }
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

   // ======== add flashChart by huangwei

   var panelFor2DChart = new Ext.Panel({
      id        : 'panelFor2DChart',
      contentEl : 'my2Dc_MsChart_div',
      region    : 'center',
      // width : 700,
      border    : false,
      tbar      : [{
         text    : '生成图表',
         iconCls : 'page_refreshIcon',
         handler : function() {
            var params = formPanel.getForm().getValues();
            params.start = 0;
            params.limit = bbar.pageSize;
            Ext.Ajax.request({
               url     : './alarmStatistics.ered?reqCode=fcf2DColumnMsInit',
               success : function(response, opts) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  var xmlstring = resultArray.xmlstring;
                  var chartWidth = resultArray.width;
                  // panelFor2DChart.setWidth(chartWidth);
                  // panelFor2DChart.render();
                  updateChartXML('my2Dc_MsChart', xmlstring);
               },
               failure : function(response, opts) {
                  Ext.MessageBox.alert('提示', '获取报表数据失败');
               },
               params  : params
            });
         }
      }, '-', {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            Ext.getCmp('alarmStatisticsFormTable').getForm().reset();
         }
      }]
   });

   var tabPanel = new Ext.TabPanel({
      region         : 'center',
      activeTab      : 0,
      deferredRender : false,
      items          : [grid, resChartPanel, new Ext.Panel({
         title  : '<span style="font-weight:normal">告警统计[2D柱状图]</span>',
         layout : 'border',
         items  : [panelFor2DChart, {
            xtype  : 'panel',
            region : 'south',
            heigth : 60,
            border : false,
            html   : '<div style="z-index:9999999;background:#FF0;top:0;left:0;font-size:12px;line-height:24px;color:#F00;padding: 0 10px;">提示：可以先筛选查询条件，再点击[生成图表]按钮，系统会根据您选择的条件进行图表展示，如果要清空查询条件，请点击[重置]按钮</div>'
         }]
      })]
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [formPanel, tabPanel]
   });

});