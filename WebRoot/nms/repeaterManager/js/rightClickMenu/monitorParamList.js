Ext.namespace("monitorParamList");

monitorParamList.createWindow = function() {

   var repeater = Ext.getCmp('tree').getSelectionModel().getSelectedNode().text;
   var id = Ext.getCmp('tree').getSelectionModel().getSelectedNode().id;
   var repeaterid = Ext.getCmp('tree').getSelectionModel().getSelectedNode().id;
   var nodeId = formatNodeId(repeaterid);
   repeaterid = nodeId.id;
   var panel = new Ext.Panel({
      region : 'west',
      height : 100,
      title  : '查询站点',
      width  : 100,
      html   : repeater
   });

   var paramPanel = new Ext.TabPanel({
      region         : 'center',
      activeTab      : 0,
      deferredRender : false,
      height         : 200
   });

   var presenceCm = new Ext.grid.ColumnModel([{
      header    : '监控参量',
      dataIndex : 'paramcode',
      width     : 100
   }, {
      header    : '监控量名称',
      id        : 'name',
      dataIndex : 'paramname'
   }]);

   /*
    * var exitRecord = new Ext.data.Record.create([{ name : 'paramcode' }, {
    * name : 'paramname' }]);
    * 
    * var exitStore = new Ext.data.Store({ id : 'exitStore', proxy : new
    * Ext.data.HttpProxy({ url : 'repeaterInformation.ered?reqCode=exit' }),
    * reader : new Ext.data.JsonReader({ totalProperty : 'TOTALCOUNT', root :
    * 'ROOT' }, exitRecord) });
    * 
    * var noexitStore = new Ext.data.Store({ id : 'noexitStore', proxy : new
    * Ext.data.HttpProxy({ url : 'repeaterInformation.ered?reqCode=noExit' }),
    * reader : new Ext.data.JsonReader({ totalProperty : 'TOTALCOUNT', root :
    * 'ROOT' }, exitRecord) });
    */

   exitStore.load({
      params : {
         repeaterid : repeaterid,
         start      : 0,
         limit      : 10000
      }
   });
   noexitStore.load({
      params : {
         repeaterid : repeaterid,
         start      : 0,
         limit      : 10000
      }
   });
   var presencePanel = new Ext.grid.GridPanel({
      store            : exitStore,
      cm               : presenceCm,
      enableColumnMove : false,
      title            : '存在的监控量',
      autoExpandColumn : 'name'
      // ,
   // viewConfig:{
   // forceFit:true
   // }
}  );

   var nopresencePanel = new Ext.grid.GridPanel({
      store            : noexitStore,
      cm               : presenceCm,
      enableColumnMove : false,
      title            : '不存在的监控量',
      autoExpandColumn : 'name1'
      // ,
   // viewConfig:{
   // forceFit:true
   // }
}  );

   paramPanel.add(presencePanel);
   paramPanel.add(nopresencePanel);
   paramPanel.activate(presencePanel);
   var monitorParamWinodw = new Ext.Window({
      id            : 'monitorParamWinodw',
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '监控参量列表', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 500, // 窗口宽度
      height        : document.body.clientHeight, // 窗口高度
      // tbar : tb, // 工具栏
      closable      : true, // 是否可关闭
      collapsible   : true,
      titleCollapse : true,
      resizable     : true,
      maximizable   : true, // 设置是否可以最大化
      modal         : true,
      border        : false, // 边框线设置
      pageY         : 120, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
      constrain     : true,
      items         : [panel, paramPanel],
      // 设置窗口是否可以溢出父容器
      buttonAlign   : 'center',
      buttons       : [{
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            Ext.Ajax.request({
               url     : './repeaterInforamtion1.ered?reqCode=queryConnFlag',
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  if (json.connectflag == '2') {
                     Ext.Msg.alert("系统提示","站点不在线，请先连接！");
                  }
                  else {
                     Ext.MessageBox.show({
                        title        : '系统提示',
                        msg          : "正在查询，请稍等...如果要停止，请点击取消！",
                        progressText : 'processing now,please wait...',
                        width        : 300,
                        wait         : true,
                        buttons      : Ext.Msg.CANCEL,
                        fn           : function(btn, text) {
                           if (btn == 'cancel') {
                              Ext.Ajax.request({
                                 url     : './repeaterInforamtion1.ered?reqCode=doCancelForQ',
                                 success : function(response) {
                                    // var json =
                                    // Ext.decode(response.responseText);
                                 },
                                 params  : {
                                    repeaterid : repeaterid
                                 }
                              });
                           }
                        },
                        waitConfig   : {
                           interval : 150
                        }
                     });
                     Ext.Ajax.request({
                        url     : './repeaterInforamtion1.ered?reqCode=readList',
                        success : function(response) {
                           var json = Ext.decode(response.responseText);

                        },
                        params  : {
                           repeaterid : repeaterid
                        }
                     });
                  }
               },
               params  : {
                  repeaterid : repeaterid
               }
            });

         }
      }, {
         text    : '清空',
         handler : function() {
            exitStore.removeAll();
            noexitStore.removeAll();
         }
      }, {
         text    : '关闭',
         handler : function() {
            monitorParamWinodw.close();
         }
      }]
   });
   /**
    * 
    */
   function queryParams() {
      Ext.Ajax.request({
         url     : './main.ered?reqCode=queryParams',
         params  : {
            repeaterid : repeaterid
         },
         success : function(response) {
            var resultArray = Ext.util.JSON.decode(response.responseText);
            store.reload();
            Ext.Msg.alert('提示', '查询成功!');
         },
         failure : function(response) {
            var resultArray = Ext.util.JSON.decode(response.responseText);
            Ext.Msg.alert('提示', '查询失败!');
         }
      });
   }
   return monitorParamWinodw;
};