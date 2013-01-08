/**
 * 监视通讯数据
 * 
 * @author xujinmei
 * @since 2011-07-26
 */

Ext.onReady(function() {
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
      hidden    : true,
      header    : 'ID',
      dataIndex : 'cmdid'
   }, {
      header    : '收发标志',
      dataIndex : 'flag',
      hidden    : false,
      width     : 70,
      sortable  : true,
      renderer:function(value){
      	if(value=='0')
      		return '收';
      	else
      		return '发';
      }
   }, {
      header    : '协议内容',
      dataIndex : 'cmddetail',
      hidden    : false,
      width     : 310,
      sortable  : true
   }, {
      header    : '直放站编号',
      dataIndex : 'siteid',
      width     : 180
   }, {
      header    : '命令字与含义',
      dataIndex : 'cmd',
      width     : 90
   }, {
      header    : '时间',
      dataIndex : 'insertdate',
      sortable  : true,
      width     : 130
   }, {
      header    : '站点电话',
      dataIndex : 'sitetel',
      width     : 80
   }, {
      header    : '窗体标题',
      dataIndex : 'windowtitle',
      width     : 130
   }, {
      header    : '通讯名称',
      dataIndex : 'com',
      hidden    : false,
      width     : 70,
      sortable  : true
   }]);
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
   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './comdata.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'cmdid'
      }, {
         name : 'flag'
      }, {
         name : 'cmddetail'
      }, {
         name : 'siteid'
      }, {
         name : 'cmd'
      }, {
         name : 'insertdate'
      }, {
         name : 'sitetel'
      }, {
         name : 'windowtitle'
      }, {
         name : 'com'
      }])
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

   // var cmpPanel = Ext.get("devcomdatamainPanel");
   var grid = new Ext.grid.GridPanel({
      readerTo   : 'gridTable',
      title      : '监视通讯数据',
      region     : 'center',
      width      : document.body.clientWidth,
      height     : document.body.clientHeight,
      store      : store,
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      // autoExpandColumn : 'team_desc',
      cm         : cm,
      tbar       : [
      /*{
         text    : '新增',
         iconCls : 'page_addIcon',
         handler : function() {
            addWindow.show();
         }
      }, '-', {
         text    : '修改',
         iconCls : 'page_edit_1Icon',
         handler : function() {
            ininEditWindow();
         }
      }, '-', {
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            deleteItems();
         }
      }, '-',*/
      {
         text    : '刷新',
         iconCls : 'page_refreshIcon',
         handler : function() {
            store.reload();
         }
      }, '->', {
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            queryCodeItem();
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
    * 新增
    */

   var addWindow;
   var formPanel;
   formPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 60,
      frame      : true,
      id         : 'addForm',
      name       : 'addForm',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '主ID号',
               name       : 'cmdid',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .63,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 70, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '收发标志', // 标签
               name       : 'flag', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议内容', // 标签
               name       : 'cmddetail', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 70, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '直放站编号', // 标签
               name       : 'siteid', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '命令字与含义',
               name       : 'cmd',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '站点电话', // 标签
               name       : 'sitetel', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '窗体标题', // 标签
               name       : 'windowtitle', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }]
      }, {
         columnWidth : .33,
         layout      : 'form',
         labelWidth  : 60, // 标签宽度
         defaultType : 'textfield',
         border      : false,
         items       : [{
            fieldLabel : '通讯名称', // 标签
            name       : 'com', // name:后台根据此name属性取值
            allowBlank : false,
            labelStyle : 'color:A62017;',
            anchor     : '100%'// 宽度百分比
         }]
      }]
   });
   addWindow = new Ext.Window({
      layout        : 'fit',
      width         : 480, // 窗口宽度
      height        : 230, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      animateTarget : Ext.getBody(),
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '新增通讯数据表数据',
      iconCls       : 'page_addIcon',
      modal         : true,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 650 / 2, // 页面定位X坐标
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
            if (runMode == '0') {
               Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
               return;
            }
            if (addWindow.getComponent('addForm').form.isValid()) {
               addWindow.getComponent('addForm').form.submit({
                  url       : './comdata.ered?reqCode=insertItem',
                  waitTitle : '提示',
                  method    : 'POST',
                  waitMsg   : '正在处理数据,请稍候...',
                  success   : function(form, action) {
                     store.reload();
                     var msg = '添加成功！';
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
                     var msg = action;
                     Ext.MessageBox.alert('提示', '出错啦:<br>' + '添加失败！');
                     // addWindow.getComponent('addForm').form.reset();
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

   /** *****************修改*********************** */

   var editWindow, editFormPanel;
   editFormPanel = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 60,
      frame      : true,
      name       : 'editFormPanel',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '主ID号',
               id         : 'cmdid_',
               disabled   : true,
               fieldClass : 'x-custom-field-disabled',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .63,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '收发标志',
               name       : 'flag',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '协议内容', // 标签
               name       : 'cmddetail', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 70, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '直放站编号', // 标签
               name       : 'siteid', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '命令字与含义',
               name       : 'cmd',
               allowBlank : false,
               labelStyle : 'color:A62017;',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '站点电话', // 标签
               name       : 'sitetel', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '窗体标题', // 标签
               name       : 'windowtitle', // name:后台根据此name属性取值
               allowBlank : false,
               labelStyle : 'color:A62017;',
               anchor     : '100%'// 宽度百分比
            }]
         }, {
            name  : 'cmdid',
            xtype : 'hidden'
         }]
      }, {
         columnWidth : .33,
         layout      : 'form',
         labelWidth  : 60, // 标签宽度
         defaultType : 'textfield',
         border      : false,
         items       : [{
            fieldLabel : '通讯名称', // 标签
            name       : 'com', // name:后台根据此name属性取值

            allowBlank : false,
            labelStyle : 'color:A62017;',
            anchor     : '100%'// 宽度百分比
         }]
      }]
   });

   editWindow = new Ext.Window({
      layout        : 'fit',
      width         : 480, // 窗口宽度
      height        : 230, // 窗口高度
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '修改通讯数据表',
      iconCls       : 'page_editICon',
      modal         : true,
      collapsible   : true,
      titleCollapse : true,
      maximizable   : true,
      buttonAlign   : 'right',
      border        : false,
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      pageY         : 100, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 650 / 2, // 页面定位X坐标
      constrain     : true,
      items         : [editFormPanel],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            if (!editFormPanel.form.isValid()) {
               return;
            }
            editFormPanel.form.submit({
               url       : './comdata.ered?reqCode=updateItem',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  editWindow.hide();
                  store.reload();
                  Ext.MessageBox.alert('提示', '通讯数据表修改成功!');
               },
               failure   : function(form, action) {
                  var msg = '通讯数据表修改失败!';
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
   function ininEditWindow() {
      var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         grid.getSelectionModel().selectFirstRow();
      }
      record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert('提示', '请先选择一条数据！');
         return;
      }
      editWindow.show();
      editFormPanel.getForm().loadRecord(record);
      Ext.getCmp('cmdid_').setValue(record.get('cmdid'));
   }

   /**
    * 删除
    */
   function deleteItems() {
      var rows = grid.getSelectionModel().getSelections();
      var fields = '';
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要删除的记录!');
         return;
      }
      var strChecked = jsArray2JsString(rows, 'cmdid');
      var tipContent;
      tipContent = '您确定要删除吗？';
      Ext.Msg.confirm('请确认', tipContent, function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './comdata.ered?reqCode=deleteItem',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  store.reload();
                  Ext.Msg.alert('提示', '删除成功!');
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', '删除失败!');
               },
               params  : {
                  strChecked : strChecked
               }
            });
         }
      });
   }

   /**
    * 查询代码表
    */
   function queryCodeItem() {
      store.load({
         params : {
            start : 0,
            limit : bbar.pageSize
         }
      });
   }

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [grid]
   });
});