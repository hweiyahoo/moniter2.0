/**
 * 命令策略管理
 * 
 * @author huangwei
 * @since 2011-07-22
 */
Ext.onReady(function() {

   // 轮询策略grid
   var ploy_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
      hidden    : true,
      header    : '策略ID',
      dataIndex : 'pollployid',
      width     : 60
   }, {
      header    : '策略名称',
      dataIndex : 'pollployname',
      width     : 120
   }, {
      header    : '协议编号',
      dataIndex : 'protype',
      hidden    : true,
      width     : 80
   }, {
      header    : '协议名称',
      dataIndex : 'proname',
      width     : 160
   }, {
      header    : '设备类型编号',
      dataIndex : 'devicetype',
      hidden    : true,
      width     : 80
   }, {
      header    : '设备类型名称',
      dataIndex : 'hardname',
      width     : 200
   }, {
      header    : '轮询计划开始时间',
      dataIndex : 'pollbegintime',
      width     : 140
   }, {
      hidden    : true,
      header    : '轮询间隔（分钟）',
      dataIndex : 'pollintervaltime',
      width     : 120
   }, {
      hidden    : true,
      header    : '轮询次数',
      dataIndex : 'polltimes',
      width     : 80
   }, {
      header    : '备注',
      id        : 'note',
      dataIndex : 'note'
   }, {
      header    : '轮询状态',
      dataIndex : 'pollstatus',
      width     : 80,
      renderer  : function(value) {
         if (value == 0)
            return '未轮询';
         else if (value == 1)
            return '<font color=blue>正在轮询...</font>';
         else if (value == 2) return '<font color=green>轮询完毕</font>';
      }
   }, {
      header    : '启用标识',
      dataIndex : 'flag',
      width     : 80,
      renderer  : function(value) {
         if (value == 1)
            return '<img title="启用" src="./resource/image/nms/tick.png"/>';
         else if (value == 0)
            return '<img title="未启用" src="./resource/image/nms/cross.png"/>';
         else
            return value;
      }
   }]);

   var ploy_store = new Ext.data.Store({
      storeId : 'ploy_store',
      proxy   : new Ext.data.HttpProxy({
         url : './repcfg.ered?reqCode=queryItems'
      }),
      reader  : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'pollployid'
      }, {
         name : 'pollbegintime'
      }, {
         name : 'pollintervaltime'
      }, {
         name : 'pollployname'
      }, {
         name : 'polltimes'
      }, {
         name : 'note'
      }, {
         name : 'flag'
      }, {
         name : 'protype'
      }, {
         name : 'proname'
      }, {
         name : 'devicetype'
      }, {
         name : 'hardname'
      }, {
         name : 'moncodeids'
      }, {
         name : 'pollstatus'
      }, {
         name : 'actualstarttime'
      }])
   });

   // 表格工具栏
   var ploy_tbar = new Ext.Toolbar({
      items : [{
         id      : 'newPoll_btn',
         text    : '新增',
         iconCls : 'page_addIcon',
         handler : function() {
            formPanel.form.reset();
            addWindow.show();
         }
      }, {
         id      : 'editPoll_btn',
         text    : '修改',
         iconCls : 'page_editIcon',
         handler : function() {
            initEditWindow();
         }
      }, {
         id      : 'setPoll_btn',
         text    : '轮询监控量',
         iconCls : 'page_editIcon',
         handler : function() {
            initMoniterParamsWindow();
         }
      }, {
         id      : 'delPoll_btn',
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteItems();
         }
      }, {
         id      : 'refreshPoll_btn',
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            ploy_store.reload();
         }
      }, {
         id       : 'enablePoll_btn',
         text     : '启用',
         disabled : 'true',
         iconCls  : 'acceptIcon',
         handler  : function() {
            ployEnabled(1);
         }
      }, {
         id       : 'diseablePoll_btn',
         text     : '停止',
         disabled : 'true',
         iconCls  : 'deleteIcon',
         handler  : function() {
            ployEnabled(0);
         }
      }, '<font color=red>只允许启动一个轮询</font>', '->', {
         id      : 'pollStart_btn',
         text    : '轮询开始',
         iconCls : 'page_refreshIcon',
         handler : function() {
            Ext.Msg.confirm('请确认', '您确定要马上开始轮询吗？', function(btn, text) {
               if (btn == 'yes') {
                  Ext.Ajax.request({
                     url     : './repcfg.ered?reqCode=pollStart',
                     success : function(response) {
                        ploy_store.reload();
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        if (resultArray.msg != '') Ext.Msg.alert('提示', resultArray.msg);
                     },
                     failure : function(response) {
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        if (resultArray.msg != '') Ext.Msg.alert('提示', resultArray.msg);
                     },
                     params  : {}
                  });
               }
            });
         }
      }, {
         id      : 'pollStop_btn',
         text    : '轮询结束',
         iconCls : 'page_refreshIcon',
         handler : function() {
            Ext.Msg.confirm('请确认', '您确定要马上结束轮询吗？', function(btn, text) {
               if (btn == 'yes') {
                  Ext.Ajax.request({
                     url     : './repcfg.ered?reqCode=pollStop',
                     success : function(response) {
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        if (resultArray.msg != '') Ext.Msg.alert('提示', resultArray.msg);
                     },
                     failure : function(response) {
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        if (resultArray.msg != '') Ext.Msg.alert('提示', resultArray.msg);
                     },
                     params  : {}
                  });
               }
            });
         }
      }]
   });

   var ploy_grid = new Ext.grid.GridPanel({
      title            : '轮询策略维护',
      region           : 'north',
      height           : 300,
      store            : ploy_store,
      stripeRows       : true,
      frame            : true,
      autoExpandColumn : 'note',
      cm               : ploy_cm,
      tbar             : ploy_tbar
   });
   ploy_store.load({
      params : {
         start : 0,
         limit : 100
      }
   });
   // 翻页排序时带上查询条件
   ploy_store.on('beforeload', function() {
      store.load({
         params : {
            start : 0,
            limit : 100
         }
      });
   });

   var sel_record;
   ploy_grid.addListener('rowclick', function() {
      sel_record = ploy_grid.getSelectionModel().getSelected();
      store.load({
         params : {
            start      : 0,
            limit      : 100,
            pollployid : sel_record.get("pollployid")
         }
      });
   });

   ploy_grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
      var store = grid.getStore();
      var record = store.getAt(rowIndex);
      var flag = record.get('flag');
      if (flag == 1) {
         flag = 0;
         Ext.getCmp('diseablePoll_btn').enable();
         Ext.getCmp('enablePoll_btn').disable();
      }
      else {
         flag = 1;
         Ext.getCmp('enablePoll_btn').enable();
         Ext.getCmp('diseablePoll_btn').disable();
      }
   });

   function ployEnabled(flag) {
      sel_record = ploy_grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(sel_record)) {
         Ext.Msg.alert('提示', '请先选中要操作的轮询策略!');
         return;
      }
      var pollployid = sel_record.get('pollployid');
      var pollployname = sel_record.get('pollployname');
      var pollbegintime = sel_record.get('pollbegintime');
      var tipContent = "";
      if (flag == 1) {
         tipContent = "您确定要启用 “" + pollployname + "” 轮询策略吗？";
      }
      else {
         tipContent = "您确定要停用 “" + pollployname + "” 轮询策略吗？";
      }
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './repcfg.ered?reqCode=ployEnabled',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  ploy_store.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  pollployid    : pollployid,
                  flag          : flag,
                  pollbegintime : pollbegintime
               }
            });
         }
      });
   }

   // 协议类型
   var protocolCombo = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      fieldLabel     : '协议类型',
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      anchor         : '70%',// 宽度百分比
      listeners      : {
         select : function() {
            devicetypeCombo.reset();
            var value = protocolCombo.getValue();
            devicetypeStore.load({
               params : {
                  protype : value
               }
            })
         }
      }
   });

   // 设备类型
   var devicetypeStore = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=devicetype'
      }),
      reader : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }])
   });

   var devicetypeCombo = new Ext.form.ComboBox({
      name           : 'devicetype',
      hiddenName     : 'devicetype',
      fieldLabel     : '设备类型',
      emptyText      : '请选择设备类型...',
      triggerAction  : 'all',
      store          : devicetypeStore,
      displayField   : 'text',
      valueField     : 'value',
      mode           : 'local',
      forceSelection : true,
      typeAhead      : true,
      resizable      : false,
      editable       : false,
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      anchor         : '70%'
   });

   var addWindow;
   var formPanel;
   formPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      id         : 'addForm',
      name       : 'addForm',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '轮询策略编号',
               name       : 'pollployid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield',
               anchor     : '40%'
            }, {
               fieldLabel : '轮询策略名称',
               name       : 'pollployname',
               xtype      : 'textfield',
               maxLength  : 30,
               labelStyle : 'color:A62017;',
               allowBlank : false,
               anchor     : '70%'
            }, protocolCombo, devicetypeCombo, {
               fieldLabel : '轮询开始时间',
               name       : 'pollbegintime',
               xtype      : 'datetimefield',
               labelStyle : 'color:A62017;',
               allowBlank : false,
               minValue   : CurrentDay, // 允许选择的最小日期
               anchor     : '70%'
            },
            // {
            // fieldLabel : '轮询间隔时间',
            // name : 'pollintervaltime',
            // xtype : 'spinnerfield',
            // incrementValue : 1,
            // minValue : 1,
            // maxValue : 100,
            // labelStyle : 'color:A62017;',
            // allowBlank : false,
            // anchor : '40%'
            // }, {
            // fieldLabel : '轮询次数',
            // name : 'polltimes',
            // xtype : 'spinnerfield',
            // incrementValue : 1,
            // minValue : 1,
            // maxValue : 10,
            // labelStyle : 'color:A62017;',
            // allowBlank : false,
            // anchor : '40%'
            // },
            {
               fieldLabel : '备注',
               name       : 'note',
               xtype      : 'textarea',
               anchor     : '100%',
               maxLength  : 100
            }]
         }]
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 400, // 窗口宽度
      height        : 330, // 窗口高度
      closable      : true, // 是否可关闭
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增轮询策略',
      iconCls       : 'page_addIcon',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      resizable     : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
      listeners     : {
         'hide' : {
            fn : function() {
               clearForm(formPanel.getForm());
               // enabledCombo.setValue('1');
            }
         }
      },
      items         : [formPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (addWindow.getComponent('addForm').form.isValid()) {
               addWindow.getComponent('addForm').form.submit({
                  url       : './repcfg.ered?reqCode=insertItem',
                  waitTitle : '提示',
                  method    : 'POST',
                  waitMsg   : '正在处理数据,请稍候...',
                  success   : function(form, action) {
                     ploy_store.reload();
                     var msg = action.result.msg;
                     Ext.Msg.confirm('请确认', msg + '是否继续添加?', function(btn, text) {
                        if (btn == 'yes') {
                           addWindow.getComponent('addForm').form.reset();
                        }
                        else {
                           addWindow.hide();
                        }
                     });
                  },
                  failure   : function(form, action) {
                     var msg = action.result.msg;
                     Ext.MessageBox.alert('提示', '出错啦:<br>' + msg);
                  }
               });
            }
            else {
               // 表单验证失败
            }
         }
      }, {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(formPanel.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            addWindow.hide();
         }
      }]
   });

   // 协议类型
   var protocolCombo_ = new Ext.form.ComboBox({
      name           : 'protype',
      hiddenName     : 'protype',
      fieldLabel     : '协议类型',
      store          : protocolStore,
      mode           : 'local',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      fieldLabel     : '协议类型',
      emptyText      : '请选择协议类型...',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      anchor         : '70%',// 宽度百分比
      listeners      : {
         select : function() {
            devicetypeCombo_.reset();
            var value = protocolCombo_.getValue();
            devicetypeStore.load({
               params : {
                  protype : value
               }
            })
         }
      }
   });

   var devicetypeCombo_ = new Ext.form.ComboBox({
      name           : 'devicetype',
      hiddenName     : 'devicetype',
      fieldLabel     : '设备类型',
      emptyText      : '请选择设备类型...',
      triggerAction  : 'all',
      store          : devicetypeStore,
      displayField   : 'text',
      valueField     : 'value',
      mode           : 'local',
      forceSelection : true,
      typeAhead      : true,
      resizable      : false,
      editable       : false,
      allowBlank     : false,
      labelStyle     : 'color:A62017;',
      anchor         : '70%'
   });
   var editWindow, editFormPanel;
   editFormPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      name       : 'editFormPanel',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '轮询策略编号',
               id         : 'pollployid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield',
               anchor     : '40%'
            }, {
               fieldLabel : '轮询策略名称',
               name       : 'pollployname',
               xtype      : 'textfield',
               maxLength  : 30,
               labelStyle : 'color:A62017;',
               allowBlank : false,
               anchor     : '70%'
            }, protocolCombo_, devicetypeCombo_, {
               fieldLabel : '轮询开始时间',
               name       : 'pollbegintime',
               xtype      : 'datetimefield',
               labelStyle : 'color:A62017;',
               allowBlank : false,
               minValue   : CurrentDay, // 允许选择的最小日期
               anchor     : '70%'
            },

            // {
            // fieldLabel : '轮询间隔时间',
            // name : 'pollintervaltime',
            // xtype : 'spinnerfield',
            // incrementValue : 1,
            // minValue : 1,
            // maxValue : 100,
            // labelStyle : 'color:A62017;',
            // allowBlank : false,
            // anchor : '40%'
            // }, {
            // fieldLabel : '轮询次数',
            // name : 'polltimes',
            // xtype : 'spinnerfield',
            // incrementValue : 1,
            // minValue : 1,
            // maxValue : 10,
            // labelStyle : 'color:A62017;',
            // allowBlank : false,
            // anchor : '40%'
            // },
            {
               fieldLabel : '备注',
               name       : 'note',
               xtype      : 'textarea',
               anchor     : '100%',
               maxLength  : 100
            }, {
               name  : 'pollployid',
               xtype : 'hidden'
            }]
         }]
      }]
   });

   editWindow = new Ext.Window({
      id            : 'editWindow',
      layout        : 'fit',
      width         : 400, // 窗口宽度
      height        : 330, // 窗口高度
      resizable     : true,
      draggable     : true,
      closable      : true, // 是否可关闭
      collapsible   : false, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      closeAction   : 'hide',
      title         : '修改轮询策略',
      iconCls       : 'page_editICon',
      modal         : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
      items         : [editFormPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (!editFormPanel.form.isValid()) {
               return;
            }
            editFormPanel.form.submit({
               url       : './repcfg.ered?reqCode=updateItem',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  editWindow.hide();
                  ploy_store.reload();
                  Ext.MessageBox.alert('提示', action.result.msg);
               },
               failure   : function(form, action) {
                  var msg = action.result.msg;
                  Ext.MessageBox.alert('提示', '保存失败:<br>' + msg);
               }
            });
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            editWindow.hide();
         }
      }]

   });

   /**
    * 初始化代码修改出口
    */
   function initEditWindow() {
      var record = ploy_grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择需要修改的轮询策略！');
         return;
      }
      devicetypeCombo_.reset();
      devicetypeStore.load({
         params   : {
            protype : record.get('protype')
         },
         callback : function(r, options, success) {
            if (success == false) {
               Ext.Msg.alert("ERROR", "设备类型数据加载失败，请重新尝试...");
            }
            else {
               editWindow.show();
               editFormPanel.getForm().loadRecord(record);
               Ext.getCmp('pollployid_').setValue(record.get('pollployid'));
            }
         }
      });
   }

   function initMoniterParamsWindow() {
      var record = ploy_grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择需要操作的轮询策略！');
         return;
      }
      var protype = sel_record.get('protype');
      var devicetype = sel_record.get('devicetype');

      var setMoniterParamsWindow = new Ext.Window({
         id          : 'setMoniterParamsWindow',
         layout      : 'fit',
         width       : document.body.clientWidth - 30,
         height      : document.body.clientHeight - 60,
         resizable   : false,
         maximizable : true,
         closeAction : 'close',
         modal       : true,
         listeners   : {
            'beforeclose' : {
               fn : function() {
                  ploy_store.reload();
               }
            }
         },
         title       : '轮询监控量参数设置',
         iconCls     : 'group_linkIcon',
         pageY       : 15,
         pageX       : document.body.clientWidth / 2 - (document.body.clientWidth - 30) / 2,
         buttonAlign : 'right',
         constrain   : true,
         boder       : false,
         autoLoad    : {
            url     : './repcfg.ered?reqCode=initForSetMoniterParams',
            text    : '引擎正在驱动页面,请等待...',
            scripts : true,
            params  : {
               pollployid : sel_record.get('pollployid'),
               protype    : sel_record.get('protype')
            }
         }
      });
      setMoniterParamsWindow.show();
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = ploy_grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选择要删除的轮询策略!');
         return;
      }
      var pollployid = rows[0].get('pollployid');
      var tipContent;
      if (store.getCount() == 0) {
         tipContent = '您确定要删除吗？';
      }
      else {
         tipContent = '我们将一并删除该轮询策略中的轮询站点设置，您确定要删除吗？';
      }
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './repcfg.ered?reqCode=deleteItem',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  ploy_store.reload();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  pollployid : pollployid
               }
            });
         }
      });
   }

   // 选中的轮询站点grid
   var sm = new Ext.grid.CheckboxSelectionModel();
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      hidden    : true,
      header    : '直放站ID',
      dataIndex : 'repeaterid',
      width     : 60
   }, {
      header    : '直放站编号',
      dataIndex : 'stationid',
      width     : 80
   }, {
      header    : '直放站名称',
      dataIndex : 'stationname',
      width     : 140,
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
      proxy  : new Ext.data.HttpProxy({
         url : './repcfg.ered?reqCode=queryChoiseRepeaters'
      }),
      reader : new Ext.data.JsonReader({
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
      items : [{
         id      : 'selectRepeaterInit_btn',
         text    : '选择站点',
         iconCls : 'page_addIcon',
         handler : function() {
            selectRepeaterInit();
         }
      }, {
         id      : 'removeRepeater_btn',
         text    : '删除站点',
         iconCls : 'page_delIcon',
         handler : function() {
            removeRepeater();
         }
      }, {
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            store.reload();
         }
      }]
   });

   var grid = new Ext.grid.GridPanel({
      title      : '需要轮询的直放站站点',
      region     : 'center',
      store      : store,
      stripeRows : true,
      frame      : true,
      cm         : cm,
      sm         : sm,
      bbar       : bbar,
      tbar       : tbar
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [grid, ploy_grid]
   });

   function removeRepeater() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选择要删除的站点!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'repeaterid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './repcfg.ered?reqCode=deleteChoisedRepeater',
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
                  strChecked : strChecked,
                  pollployid : sel_record.get('pollployid')
               }
            });
         }
      });
   };

   /**
    * 视频选择列表
    */
   function selectRepeaterInit() {
      if (!sel_record) {
         Ext.MessageBox.alert('提示', '请先选择轮询策略，如果没有可选的轮询策略，请先添加！');
         return false;
      };

      var paramcodes = sel_record.get('moncodeids');
      var pollployname = sel_record.get('pollployname');
      if (paramcodes == null || paramcodes == '' || paramcodes.length == 0) {
         Ext.MessageBox.alert('提示', '请先选择轮询策略[' + pollployname + ']还未设置轮询监控量参数，请先设置监控量参数！');
         return false;
      };

      var protype = sel_record.get('protype');
      var devicetype = sel_record.get('devicetype');
      var selectRepeaterWindow = new Ext.Window({
         id          : 'selectRepeaterWindow',
         layout      : 'fit',
         width       : document.body.clientWidth - 100,
         height      : document.body.clientHeight - 60,
         resizable   : false,
         maximizable : true,
         closeAction : 'close',
         modal       : true,
         listeners   : {
            'beforeclose' : {
               fn : function() {
                  store.reload();
               }
            }
         },
         title       : '直放站站点选择',
         iconCls     : 'group_linkIcon',
         pageY       : 15,
         pageX       : document.body.clientWidth / 2 - (document.body.clientWidth - 100) / 2,
         buttonAlign : 'right',
         constrain   : true,
         boder       : false,
         autoLoad    : {
            url     : './repcfg.ered?reqCode=initForSelectRepeater',
            text    : '引擎正在驱动页面,请等待...',
            scripts : true,
            params  : {
               pollployid : sel_record.get('pollployid'),
               protype    : sel_record.get('protype'),
               devicetype : sel_record.get('devicetype')
            }
         }
      });
      selectRepeaterWindow.show();
   }

});