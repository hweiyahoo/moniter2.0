/**
 * 告警日志
 * 
 * @author 杨智铮,bug modify by huangwei
 * @since 2011-07-25
 */
Ext.onReady(function() {

   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      dataIndex : 'alarmid',
      header    : '告警ID',
      hidden    : true
   }, {
      header    : '处理标识',
      dataIndex : 'flag',
      width     : 60,
      renderer  : function(value) {
         if (value == 1) {
            return '<span style="color:A62017;font-weight:bold;">未恢复</span>';
         }
         else if (value == 2) {
            return '<span style="color:green;font-weight:bold;">已恢复</span>';
         }
      }
   }, {
      header    : '站点名称',
      dataIndex : 'stationname',
      width     : 120
   }, {
      header    : '告警内容',
      dataIndex : 'detail',
      width     : 150
   }, {
      header    : '告警个数',
      hidden    : true,
      dataIndex : 'aitemnum',
      width     : 60
   }, {
      header    : '告警类别',
      dataIndex : 'alarmtype',
      hidden    : true
   }, {
      header    : '告警级别',
      dataIndex : 'alarmtypename',
      width     : 60,
      renderer  : function(value) {
         if (value == '一般告警')
            return '<font color="F9DE39">一般告警</font>';
         else if (value == '重要告警')
            return '<font color="F98039">重要告警</font>';
         else if (value == '严重告警') return '<font color="F92939">严重告警</font>';
      }
   }, {
      header    : '协议类型编号',
      dataIndex : 'protype',
      hidden    : true
   }, {
      header    : '协议类型',
      dataIndex : 'protypename',
      width     : 140
   }, {
      header    : '设备类型编号',
      dataIndex : 'devicetype',
      hidden    : true
   }, {
      header    : '设备类型',
      dataIndex : 'devicename',
      width     : 200
   }, {
      header    : '省份编码',
      dataIndex : 'province',
      hidden    : true
   }, {
      header    : '省份',
      dataIndex : 'provincename',
      width     : 60
   }, {
      header    : '地市编码',
      dataIndex : 'city',
      hidden    : true
   }, {
      header    : '地市',
      dataIndex : 'cityname',
      width     : 60
   }, {
      header    : '告警时间',
      dataIndex : 'alarmtime',
      width     : 140
   }, {
      header    : '恢复时间',
      dataIndex : 'recovertime',
      width     : 140
   }]);

   var store = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : './alarmLog.ered?reqCode=queryItems'
      }),
      baseParams : {
         repeaterid : repeaterid_,
         flag       : flag_,
         alarmtype  : alarmtype_
      },
      reader     : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'alarmid',
         type : 'string'
      }, {
         name : 'stationname',
         type : 'string'
      }, {
         name : 'detail',
         type : 'string'
      }, {
         name : 'aitemnum',
         type : 'string'
      }, {
         name : 'alarmtype',
         type : 'string'
      }, {
         name : 'alarmtypename',
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
         name : 'alarmtime',
         type : 'string'
      }, {
         name : 'recovertime',
         type : 'string'
      }, {
         name : 'flag',
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
      id         : 'alarmLogGrid',
      name       : 'alarmLogGrid',
      title      : '告警日志',
      height     : 400,
      store      : store,
      region     : 'center',
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      // autoExpandColumn : 'detail',
      cm         : cm,
      sm         : sm,
      tbar       : [{
         id      : 'dowithAlarm_btn',
         text    : '处理',
         iconCls : 'acceptIcon',
         handler : function() {
            dowithAlarm();
         }
      }, '-', {
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
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            Ext.getCmp('alarmLogFormTable').getForm().reset();
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
      anchor         : '60%'// 宽度百分比
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
      anchor         : '60%'// 宽度百分比
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
      anchor         : '50%'// 宽度百分比
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
      anchor         : '50%'// 宽度百分比
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

   var flagCombo = new Ext.form.ComboBox({
      id             : 'flag_id',
      name           : 'flagText',
      hiddenName     : 'flag',
      typeAhead      : true,
      triggerAction  : 'all',
      lazyRender     : true,
      mode           : 'local',
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['', '全部'], ['1', '未恢复'], ['2', '已恢复']]
      }),
      valueField     : 'value',
      displayField   : 'text',
      editable       : false,
      forceSelection : true,
      fieldLabel     : '恢复标识', 
      emptyText      : '请选择',
      anchor         : '50%'
   });

   var formPanel;
   formPanel = new Ext.form.FormPanel({
      // renderTo : 'alarmStatisticsFormTable',
      region     : 'north',
      labelAlign : 'right',
      height     : 100,
      labelWidth : 60,
      frame      : true,
      id         : 'alarmLogFormTable',
      name       : 'alarmLogFromTable',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .5,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [protocolCombo, deviceTypeCombo, flagCombo]
         }, {
            columnWidth : .5,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [provinceCombo, cityCombo]
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

   /**
    * 单击按钮设为已处理
    */
   function dowithAlarm() {
      var rows = grid.getSelectionModel().getSelections();
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要处理的告警!');
         return;
      }
      var fields = '';
      var fields_ = '';
      for (var i = 0; i < rows.length; i++) {
         var flag = rows[i].get('flag');
         if (flag == 2) {
            fields =
                     fields + '“' + rows[i].get('stationname') + "” 的告警为 “" + rows[i].get('detail')
                        + "”" + '<br>';
         }
         else {
            fields_ =
                      fields_ + '“' + rows[i].get('stationname') + "” 的告警为 “"
                         + rows[i].get('detail') + "”" + '<br>';
         }
      }

      if (fields != '') {
         Ext.Msg.alert('提示', '<b>您选中的告警包含已经处理过的：</b><br>' + fields
                             + '<font color=red>处理过的不能进行处理，请重新选择！</font>');
         return;
      }
      var tipconent = "您确定要把 :<br>" + fields_ + "设置成处理标识吗？"
      Ext.Msg.confirm('请确认', tipconent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            var alarmid = jsArray2JsString(rows, 'alarmid');
            Ext.Ajax.request({
               url     : './alarmLog.ered?reqCode=updateFlag',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  alarmid : alarmid
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
            flag       : Ext.getCmp('flag_id').getValue(),
            protype    : Ext.getCmp('protype_id').getValue(),
            devicetype : Ext.getCmp('devicetype_id').getValue(),
            province   : Ext.getCmp('province_id').getValue(),
            city       : Ext.getCmp('city_id').getValue()
         }
      });
   }
   /**
    * 带上查询条件翻页排序
    */

   store.on('beforeload', function() {
      this.baseParams = {
         flag       : Ext.getCmp('flag_id').getValue(),
         protype    : Ext.getCmp('protype_id').getValue(),
         devicetype : Ext.getCmp('devicetype_id').getValue(),
         province   : Ext.getCmp('province_id').getValue(),
         city       : Ext.getCmp('city_id').getValue()
      };
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