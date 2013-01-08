/**
 * 命令策略管理
 * 
 * @author huangwei
 * @since 2011-07-22
 */
Ext.onReady(function() {

   // 省
   var provinceCombo = new Ext.form.ComboBox({
      hiddenName     : 'area',
      fieldLabel     : '省',
      emptyText      : '请选择省份...',
      triggerAction  : 'all',
      store          : provinceStore,
      displayField   : 'text',
      valueField     : 'value',
      mode           : 'local', // 数据会自动读取,如果设置为local又调用了store.load()则会读取2次；也可以将其设置为local，然后通过store.load()方法来读取
      forceSelection : true,
      typeAhead      : true,
      resizable      : false,
      editable       : false,
      anchor         : '100%'
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
   // 地市
   var cityStore = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=site'
      }),
      reader     : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }]),
      baseParams : {}
   });

   var cityCombo = new Ext.form.ComboBox({
      hiddenName     : 'area',
      fieldLabel     : '城市',
      emptyText      : '请选择城市...',
      triggerAction  : 'all',
      store          : cityStore,
      displayField   : 'text',
      valueField     : 'value',
      mode           : 'local',
      forceSelection : true,
      typeAhead      : true,
      resizable      : false,
      editable       : false,
      anchor         : '100%'
   });

   // 通讯名称
   var communiNameCombo = new Ext.form.ComboBox({
      name          : 'communiName',
      hiddenName    : 'communiName',
      fieldLabel    : '通讯名称',
      triggerAction : 'all',
      mode          : 'local',
      store         : communiNameStore,
      valueField    : 'value',
      displayField  : 'text',
      value         : 'com1',
      editable      : false,
      anchor        : '100%'
   });

   // 选中的轮询站点grid
   var sm = new Ext.grid.CheckboxSelectionModel({
   // singleSelect : true
   });
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      hidden    : true,
      header    : '站点ID',
      dataIndex : 'repeaterid'
   }, {
      header    : '直放站编号',
      dataIndex : 'stationid',
      width     : 80
   }, {
      header    : '直放站名称',
      dataIndex : 'stationname',
      width     : 200, 
      sortable  : true
   }, {
      header    : '协议编号',
      dataIndex : 'devicetype',
      hidden    : true,
      width     : 80
   }, {
      header    : '协议名称',
      dataIndex : 'proname',
      width     : 100
   }, {
      header    : '设备类型编号',
      dataIndex : 'devicetype',
      hidden    : true,
      width     : 80
   }, {
      header    : '设备类型名称',
      dataIndex : 'hardname',
      width     : 140
   }, {
      header    : '省份',
      dataIndex : 'provincename',
      width     : 120
   }, {
      header    : '地市',
      dataIndex : 'cityname'
   }, {
      header    : '厂家',
      dataIndex : 'cmdname',
      width     : 120
   }, {
      header    : '连接方式',
      dataIndex : 'channelname',
      width     : 80
   }, {
      header    : '通讯名称',
      dataIndex : 'cmdname',
      width     : 140
   }]);

   var store = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : './repcfg.ered?reqCode=queryRepeaters'
      }),
      baseParams : {
         pollployid : pollployid_,
         protype    : protype_,
         devicetype : devicetype_,
         province   : provinceCombo.getValue(),
         city       : cityCombo.getValue()
      },
      reader     : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'repeaterid'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'devicetype'
      }, {
         name : 'hardname'
      }, {
         name : 'stationid'
      }, {
         name : 'stationname'
      }, {
         name : 'statsubid'
      }, {
         name : 'province'
      }, {
         name : 'provincename'
      }, {
         name : 'city'
      }, {
         name : 'cityname'
      }, {
         name : 'channelname'
      }, {
         name : 'channelcode'
      }])
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
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

   // 表格工具栏
   var tbar = new Ext.Toolbar({
      items : [provinceCombo, cityCombo, {
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            queryItem();
         }
      }, {
         text    : '清空',
         iconCls : 'page_cleanIcon',
         handler : function() {
            cleanQueryItem();
         }
      }, {
         text    : '添加',
         id      : 'selectRepeater_btn',
         iconCls : 'page_addIcon',
         // disabled : true,
         handler : function() {
            selectRepeater();
         }
      }]
   });

   function selectRepeater() {
      var rows = grid.getSelectionModel().getSelections();
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选择需要轮询的直放站站点！')
      }
      else {
         var strChecked = jsArray2JsString(rows, 'repeaterid');
         var channelname = jsArray2JsString(rows, 'channelname');
         var channelcode = jsArray2JsString(rows, 'channelcode');
         var stationnames = jsArray2JsString(rows, 'stationname');
         showWaitMsg();
         Ext.Ajax.request({
            url     : './repcfg.ered?reqCode=insertChoisedRepeater',
            success : function(response) {
               store.reload();
               var resultArray = Ext.util.JSON.decode(response.responseText);
               Ext.Msg.alert('提示', resultArray.msg);
               // Ext.getCmp('selectRepeater_btn').disable();
               validatePanel.body.update('请选择直放站站点！');
            },
            failure : function(response) {
               var resultArray = Ext.util.JSON.decode(response.responseText);
               Ext.Msg.alert('提示', resultArray.msg);
               // Ext.getCmp('selectRepeater_btn').disable();
               validatePanel.body.update('请选择直放站站点！');
            },
            params  : {
               strChecked  : strChecked,
               channelname : channelname,
               channelcode : channelcode,
               pollployid  : pollployid_,
               protype     : protype_,
               stationnames:stationnames
            }
         });
      }
   }

   function cleanQueryItem() {
      provinceCombo.reset();
      cityCombo.reset();
   }

   var grid = new Ext.grid.GridPanel({
      id         : 'selectRepeaterGrid',
      region     : 'center',
      store      : store,
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : false,
      border     : false,
      cm         : cm,
      sm         : sm,
      bbar       : bbar,
      tbar       : tbar
   });

   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   grid.addListener('rowclick', function() {
      var sel_record = grid.getSelectionModel().getSelected();
      var stationname = sel_record.get('stationname');
      var repeaterid = sel_record.get('repeaterid');
      validatePanel.setTitle('【' + stationname + ' VS 轮询策略】监控量参数对比结果');
      validatePanel.getEl().mask('正在进行[' + stationname + '] 监控量参数比对...请稍等');

      Ext.Ajax.request({
         url     : './repcfg.ered?reqCode=validateMoniterParams',
         success : function(response) {
            var resultArray = Ext.util.JSON.decode(response.responseText);
            var success = resultArray.success;
            if (success == 'false') {
               validatePanel.getEl().unmask();
               validatePanel.body.update('检查完毕>>>  ' + stationname + '中不包含的监控量参数：'
                                         + resultArray.msg + '        不允许被添加到轮询策略中！');
               // Ext.getCmp('selectRepeater_btn').disable();
               return;
            }
            validatePanel.getEl().unmask();
            validatePanel.body.update('检查完毕，监控量参数符合轮询要求，可以添加！');
            // Ext.getCmp('selectRepeater_btn').enable();
         },
         failure : function(response) {
            var resultArray = Ext.util.JSON.decode(response.responseText);
            validatePanel.getEl().unmask();
            validatePanel.body.update('检查完毕>>>  ' + stationname + '中不包含的监控量参数：' + resultArray.msg
                                      + '        不允许被添加到轮询策略中！');
            // Ext.getCmp('selectRepeater_btn').disable();
         },
         params  : {
            pollployid : pollployid_,
            repeaterid : repeaterid,
            protype    : protype_
         }
      });

      // validatePanel.html = '<p>后来改动的内容</p>';
   // validatePanel.render();

}  );

   function queryItem() {
      store.load({
         params : {
            start    : 0,
            limit    : bbar.pageSize,
            province : provinceCombo.getValue(),
            city     : cityCombo.getValue()
         }
      });
   };

   var validatePanel = new Ext.Panel({
      id     : 'validatePanel',
      layout : 'fit',
      region : 'south',
      title  : '【直放站站点 VS 轮询策略】监控量参数对比结果',
      frame  : false,
      border : false,
      height : 100,
      html   : '请选择直放站站点'
   });

   var cmpPanel = Ext.get("selectRepeaterWindow");
   var panel = new Ext.Panel({
      layout   : 'border',
      frame    : false,
      border   : false,
      width    : cmpPanel.getComputedWidth() - 10,
      height   : cmpPanel.getComputedHeight() - 30,
      renderTo : 'repeaterGridTable',
      items    : [grid, validatePanel]
   })
});