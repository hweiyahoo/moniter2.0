/**
 * 厂家管理
 * 
 * @author 杨智铮
 * @since 2011-07-25
 */
Ext.onReady(function() {
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      dataIndex : 'receive_id',
      header    : '接受ID',
      hidden    : true
   }, {
      header    : '通告ID',
      dataIndex : 'notice_id',
      hidden    : true
   }, {
      id        : 'type_id',
      header    : '发布类型',
      type      : 'string',
      dataIndex : 'type_id',
      width     : 80,
      renderer  : function(value) {
         if (value == '3') {
            return '<font color="green">站内短信</font>';
         }
         else if (value == '1') {
            return '<font color="F98039">告警</font>';
         }
         else if (value == '2') {
            return '<font color="red">公告</font>';
         }
      }
   }, {
      id        : 'unread',
      header    : '是否阅读',
      dataIndex : 'unread',
      type      : 'string',
      width     : 80,
      renderer  : function(value) {
         if (value == '0')
            return '<font color="red">未读</font>';
         else if (value == '1') return '<font color="black">已读</font>';
      }
   }, {
      id        : 'title',
      header    : '标题',
      dataIndex : 'title',
      type      : 'string'
   }, {
      header    : '发件人ID',
      dataIndex : 'user_id',
      hidden    : true
   }, {
      id        : 'publish_user',
      header    : '发件人',
      dataIndex : 'publish_user',
      width     : 100,
      type      : 'string'
   }, {
      id        : 'publish_time',
      header    : '发布时间',
      dataIndex : 'publish_time',
      width     : 140,
      type      : 'string'
   }, {
      id        : 'read_time',
      header    : '阅读时间',
      dataIndex : 'read_time',
      width     : 140,
      type      : 'string'
   }, {
      header    : '是否删除',
      dataIndex : 'isdelete',
      hidden    : true
   }]);

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './receive.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'receive_id',
         type : 'string'
      }, {
         name : 'notice_id',
         type : 'string'
      }, {
         name : 'title',
         type : 'string'
      }, {
         name : 'user_id',
         type : 'string'
      }, {
         name : 'type_id',
         type : 'string'
      }, {
         name : 'publish_user',
         type : 'string'
      }, {
         name : 'publish_time',
         type : 'string'
      }, {
         name : 'unread',
         type : 'string'
      }, {
         name : 'read_time',
         type : 'string'
      }, {
         name : 'isdelete',
         type : 'string'
      }])
   });
   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      this.baseParams = {
                        // protype : Ext.getCmp('protype').getValue()
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

   var grid = new Ext.grid.GridPanel({
      store            : store,
      region           : 'center',
      loadMask         : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows       : true,
      frame            : true,
      // viewConfig : {
      // forceFit : true
      // },
      autoExpandColumn : 'title',
      cm               : cm,
      sm               : sm,
      tbar             : [{
         text    : '阅读',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            ininEditWindow();
         }
      }, '-', {
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            queryCodeItem();
         }
      }, '-', {
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteItems();
         }
      }, '-', {
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            store.reload();
         }
      }, '-', {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            Ext.getCmp('selectFormTable').getForm().reset();
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

   grid.addListener('rowdblclick', ininEditWindow);

   var typeCombo = new Ext.form.ComboBox({
      name           : 'type_id',
      hiddenName     : 'type_id',
      id             : 'typeCombo',
      store          : noticetypeStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      allowBlank     : false,
      displayField   : 'text',
      fieldLabel     : '发布类型',
      emptyText      : '请选择...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      anchor         : '50%'// 宽度百分比
   });

   var selectPanel;
   selectPanel = new Ext.form.FormPanel({
      // renderTo : 'alarmStatisticsFormTable',
      region     : 'north',
      labelAlign : 'right',
      height     : 40,
      labelWidth : 60,
      frame      : true,
      id         : 'selectFormTable',
      name       : 'selectFormTable',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .5,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [typeCombo]
         }]
      }]
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [selectPanel, grid]
   });

   /**
    * 初始化代码修改出口
    */
   function ininEditWindow() {
      var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择一条信息！');
         return;
      }
      var rows = grid.getSelectionModel().getSelections();
      if (rows.length > 1) {
         Ext.Msg.alert('提示', '只允许选择一条信息进行阅读！');
         return;
      }
      var receive_id = record.get('receive_id');
      // Ext.Ajax.request({
      // url : './receive.ered?reqCode=updateItem',
      // success : function(response) {
      // var resultArray = Ext.util.JSON.decode(response.responseText);
      // store.reload();
      // },
      // params : {
      // receive_id : receive_id
      // }
      // });
      // editWindow.show();
      // editFormPanel.getForm().loadRecord(record);
      // Ext.getCmp('title_').setValue(record.get('title'));
      // Ext.getCmp('publish_user_').setValue(record.get('publish_user'));
      // Ext.getCmp('content_').setValue(record.get('content'));

      var noticeShowWindow = new Ext.Window({
         id          : 'noticeShowWindow',
         layout      : 'fit',
         width       : 650,
         height      : 450,
         maximizable : true,
         resizable   : true,
         border      : false,
         bodyBorder  : false,
         autoScroll  : true,
         closeAction : 'close',
         modal       : true,
         listeners   : {
            'beforeclose' : {
               fn : function() {
                  store.reload();
               }
            }
         },
         title       : '查看通告',
         iconCls     : 'group_linkIcon',
         buttonAlign : 'right',
         constrain   : true,
         // frame : false,
         autoLoad    : {
            url        : './receive.ered?reqCode=showNotice&datetime=' + new Date().getTime(),
            text       : '引擎正在驱动页面,请等待...',
            discardUrl : false,
            nocache    : false,
            scripts    : true,
            params     : {
               receive_id : receive_id
            }
         }
      });
      noticeShowWindow.show();

   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的公告信息!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'receive_id');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './receive.ered?reqCode=deleteItem',
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
                  strChecked : strChecked
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
            start   : 0,
            limit   : bbar.pageSize,
            type_id : Ext.getCmp('typeCombo').getValue()
         }
      });
   }

   /**
    * 刷新代码表格
    */
   function refreshCodeTable() {
      store.load({
         params : {
            start   : 0,
            limit   : bbar.pageSize,
            type_id : Ext.getCmp('typeCombo').getValue()
         }
      });
   }
});