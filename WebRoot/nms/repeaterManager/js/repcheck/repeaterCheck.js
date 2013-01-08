/**
 * 轮询报表
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {
   var beginchecktime;
   var endchecktime;
   var pollid;
   var repeaterid;
   var titleName = ["轮询名称", "站点名称", "参数名称", "参数值", "轮询开始时间", "接收时间"];

   var arrKey = ["pollployname", "stationname", "paramname", "value", "pollbegintime", "time"];

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : '轮询名称',
      width     : 120, 
      dataIndex : 'pollployname'
   }, {
      width     : 80,
      header    : '站点编号',
      dataIndex : 'stationid'
   }, {
      width     : 120,
      header    : '站点名称',
      dataIndex : 'stationname'
   }, {
      width     : 140, 
      header    : '协议类型',
      dataIndex : 'proname'
   }, {
      width     : 160, 
      header    : '设备类型',
      dataIndex : 'hardname'
   }, {
      width     : 60,
      header    : '省份',
      dataIndex : 'provincename'
   }, {
      width     : 60,
      header    : '地市',
      dataIndex : 'cityname'
   }, {
      width     : 150, 
      header    : '参数名称',
      dataIndex : 'paramname'
   }, {
      width     : 150,
      header    : '参数值',
      dataIndex : 'value'
   }, {
      header    : '轮询开始时间',
      dataIndex : 'pollbegintime',
      width     : 140
   }, {
      header    : '接收时间',
      dataIndex : 'time',
      width     : 140 
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterCheck.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'pollployname'
      }, {
         name : 'stationid'
      }, {
         name : 'stationname'
      }, {
         name : 'paramname'
      }, {
         name : 'value'
      }, {
         name : 'pollbegintime'
      }, {
         name : 'time'
      }, {
         name : 'proname'
      }, {
         name : 'hardname'
      }, {
         name : 'provincename'
      }, {
         name : 'cityname'
      }, {
         name : 'stattel'
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

   var grid = new Ext.grid.GridPanel({
      id         : 'repeaterCheckGrid',
      name       : 'repeaterCheckGrid',
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
            queryInfo();
         }
      }, '-', {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            Ext.getCmp('repCheckForm').getForm().reset();
         }
      }, '-', {
         id      : 'importExcel_btn',
         text    : '导出Excel',
         iconCls : 'page_excelIcon',
         handler : function() {
            Ext.Msg.confirm('信息', '确定要导出EXCEL？', function(btn) {
               if (btn == 'yes') {
                  var url =
                            './repeaterCheck.ered?reqCode=exportExcel&start=0&limit='
                               + bbar.pageSize + '&' + formPanel.getForm().getValues(true);
                  exportExcel(url);
               }
            });
         }
      }],
      bbar       : bbar
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = formPanel.getForm().getValues();
   });

   var pollNameStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterCheck.ered?reqCode=pollComboBox'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   /**
    * 轮询名称
    */
   var pollName = new Ext.form.ComboBox({
      id             : 'pollName_id',
      name           : 'pollployid',
      hiddenName     : 'pollployid',
      store          : pollNameStore,
      mode           : 'remote',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '轮询名称',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%',// 宽度百分比
      listeners      : {
         select : function(cb) {
            var id = cb.getValue();
            repeaterName.removeAll();
            beginStore.removeAll();
            endStore.removeAll();
            repeaterName.load({
               params : {
                  pollployid : id
               }
            });
            beginStore.load({
               params : {
                  pollployid : id
               }
            });
            endStore.load({
               params : {
                  pollployid : id
               }
            });
         }
      }
   });

   var repeaterName = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterCheck.ered?reqCode=repeaterComboBox'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var repeaterCombo = new Ext.form.ComboBox({
      id             : 'repeaterCombo_id',
      name           : 'repeaterCombo',
      hiddenName     : 'repeater',
      store          : repeaterName,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '站点名称',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var beginStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterCheck.ered?reqCode=beginComboStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var beginchecktimeCombo = new Ext.form.ComboBox({
      name           : 'beginchecktime',
      hiddenName     : 'beginchecktime',
      store          : beginStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '轮询开始时间',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var endStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './repeaterCheck.ered?reqCode=endComboStore'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var endchecktimeCombo = new Ext.form.ComboBox({
      name           : 'endchecktime',
      hiddenName     : 'endchecktime',
      store          : endStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '轮询结束时间',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '100%'// 宽度百分比
   });

   var formPanel = new Ext.form.FormPanel({
      region     : 'north',
      labelAlign : 'right',
      height     : 40,
      labelWidth : 60,
      frame      : true,
      id         : 'repCheckForm',
      name       : 'repCheckForm',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .25,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [pollName]
         }, {
            columnWidth : .25,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [repeaterCombo]
         }, {
            columnWidth : .25,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [beginchecktimeCombo]
         }, {
            columnWidth : .25,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [endchecktimeCombo]
         }]
      }]
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [formPanel, grid]
   });

   // 页面初始化加载数据
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   // 查询表格数据
   function queryInfo() {
      var params = formPanel.getForm().getValues();
      params.start = 0;
      params.limit = bbar.pageSize;
      store.load({
         params   : params,
         callback : function(r, options, success) {
         }
      });
   };
});