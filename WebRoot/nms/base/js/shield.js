Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      header    : 'id',
      dataIndex : 'id',
      type      : 'string',
      hidden    : 'true'
   }, {
      header    : '协议类型',
      dataIndex : 'protype',
      type      : 'string'
   }, {
      header    : '参数编码',
      dataIndex : 'paramcode',
      type      : 'string'
   }, {
      header    : '参数名称',
      dataIndex : 'paramname',
      type      : 'string'
   }, {
      header    : '告警级别',
      dataIndex : 'alarmtype',
      type      : 'string'
   }, {
      header    : '备注',
      dataIndex : 'detail',
      type      : 'string'
   }, {
      header    : '是否屏蔽',
      dataIndex : 'shield',
      type      : 'string',
      renderer  : function(value) {
         if (value == '1') {
            return "<span style='color:red;'>是</span>";
         }
         else {
            return "否";
         }
      }
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './shield.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'id',
         type : 'string'
      }, {
         name : 'protype',
         type : 'string'
      }, {
         name : 'paramcode',
         type : 'string'
      }, {
         name : 'paramname',
         type : 'string'
      }, {
         name : 'alarmtype',
         type : 'string'
      }, {
         name : 'detail',
         type : 'string'
      }, {
         name : 'shield',
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
   });

   var grid = new Ext.grid.GridPanel({
      // renderTo : 'siteTableGrid',
      height     : 510,
      store      : store,
      region     : 'center',
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      viewConfig : {
         forceFit : true
      },
      // autoExpandColumn : 'note',
      sm         : sm,
      cm         : cm,
      bbar       : bbar,
      tbar       : [{
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            queryCodeItem();
         }
      }, {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            Ext.getCmp('shieldForm').getForm().reset();
         }
      }, '-', {
         id      : 'shield_btn',
         iconCls : 'acceptIcon',
         text    : '屏蔽',
         handler : function() {
            var rows = grid.getSelectionModel().getSelections();
            if (rows == '') {
               Ext.Msg.alert('提示', '请选择要屏蔽的告警');
               return false;
            }
            Ext.Msg.confirm('请确认', '您确定要执行“屏蔽”操作吗？', function(btn, text) {
               if (btn == 'yes') {
                  var strChecked = jsArray2JsString(rows, 'id');
                  Ext.Ajax.request({
                     url     : './shield.ered?reqCode=shield',
                     success : function(response) {
                        store.reload();
                     },
                     params  : {
                        checked : strChecked,
                        flag    : '1'
                     }
                  });
               }
            });

         }
      }, {
         id      : 'cencelShield_btn',
         iconCls : 'deleteIcon',
         text    : '取消屏蔽',
         handler : function() {
         	var rows = grid.getSelectionModel().getSelections();
         	if(rows==''){
         		Ext.Msg.alert('提示','请选择需要取消屏蔽的告警');
         		return false;
         	}
            Ext.Msg.confirm('请确认', '您确定要执行“取消屏蔽”操作吗？', function(btn, text) {
               if (btn == 'yes') {
                  
                  var strChecked = jsArray2JsString(rows, 'id');
                  Ext.Ajax.request({
                     url     : './shield.ered?reqCode=shield',
                     success : function(response) {
                        store.reload();
                     },
                     params  : {
                        checked : strChecked,
                        flag    : '0'
                     }
                  });
               }
            });
         }
      }]
   });
   
   // 页面初始化加载数据
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   store.on('beforeload', function() {
      this.baseParams = form.getForm().getValues();
   });
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
      anchor         : '60%'
   });

   var shieldStore = new Ext.data.ArrayStore({
      fields : ['value', 'text'],
      data   : [['0', '否'], ['1', '是']]
   });

   var shieldCombo = new Ext.form.ComboBox({
      id             : 'shield_id',
      name           : 'shield',
      hiddenName     : 'shield',
      store          : shieldStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '是否屏蔽',
      emptyText      : '请选择',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '60%'// 宽度百分比
   });

   var alarmCombo = new Ext.form.ComboBox({
      id             : 'alarm_id',
      name           : 'alarmtype',
      hiddenName     : 'alarmtype',
      store          : new Ext.data.ArrayStore({
         fields : ['value', 'text'],
         data   : [['10', '一般告警'], ['20', '重要告警'], ['30', '严重告警']]
      }),
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

   var form = new Ext.form.FormPanel({
      region     : 'north',
      labelAlign : 'right',
      height     : 70,
      labelWidth : 60,
      frame      : true,
      id         : 'shieldForm',
      name       : 'shieldForm',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [protocolCombo, shieldCombo]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数编码', // 标签
               anchor     : '60%',
               id         : 'code_id',
               name       : 'paramcode'
            }, alarmCombo]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '参数名称', // 标签
               anchor     : '60%',
               id         : 'name_id',
               name       : 'paramname'
            }]
         }]
      }]
   });

   function queryCodeItem() {
      var params = form.getForm().getValues();
      params.start = 0;
      params.limit = bbar.pageSize;
      store.load({
         params   : params,
         callback : function(r, options, success) {
         }
      });
   }

   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [grid, form]
   });
})