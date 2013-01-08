Ext.namespace("initMonitorboard");

var repeaterid;
var tel;
var stationid;
var statsubid;
var channelname;
var protype;
var oldStationid;
initMonitorboard.createWindow = function() {
   nodeID = Ext.getCmp('tree').getSelectionModel().getSelectedNode().id;
   var nodeInfo = formatNodeId(nodeID);
   repeaterid = nodeInfo.id;
   Ext.Ajax.request({
      url     : 'repeaterInformation.ered?reqCode=information',
      success : function(response) {
         var json = Ext.decode(response.responseText);
         tel = json.tel;
         stationid = json.stationid;
         oldStationid = json.stationid;
         statsubid = json.statsubid;
         channelname = json.channelname;// COM1
         protype = json.protype;
         form.form.reset();
         form.form.setValues({
            'stationid'   : stationid,
            'statsubid'   : statsubid,
            'repeatertel' : tel
         });
      },
      params  : {
         repeaterid : repeaterid
      }
   });

   var password = new Ext.form.TextField({
      fieldLabel : '超级密码',
      id         : 'superpwd',
      minLength  : 6,
      maxLength  : 30,
      inputType  : 'password', // 密码
      allowBlank : false
   });

   var subId = new Array();
   for (var i = 0; i < 256; i++) {
      var temp = complete.complete((i.toString(16)).toUpperCase(), '0', 2);
      subId[i] = new Array(temp, temp);// 赋值，从00-FF
   }
   // subId[65]=new Array('FF','FF');
   // 设备编号
   var subIdStore = new Ext.data.ArrayStore({
      fields : ['text', 'SubStatId'],
      data   : subId
   });

   var form = new Ext.form.FormPanel({
      id          : 'monitorboardForm',
      labelAlign  : 'right',
      region      : 'center',
      labelWidth  : 100,
      buttonAlign : 'center',
      width       : 750,
      items       : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype      : 'textfield',
               fieldLabel : '设置站点编号',
               id         : 'stationid',
               name       : 'stationid',
               allowBlank : false,
               vtype      : 'alphanum',
               vtypeText  : '请输入16进制的编号'

            }, {
               fieldLabel    : '设备编号',
               xtype         : 'combo',
               id            : 'statsub-id',
               name          : 'statsub-name',
               hiddenName    : 'statsubid', // 提交到后台的input的name
               // ，对应下面store里的''id，必须要填
               store         : subIdStore,
               mode          : 'local',
               triggerAction : 'all',
               displayField  : 'text',
               anchor        : '60%',
               allowBlank    : false,
               vtype         : 'alphanum',
               vtypeText     : '设备编号从00-FF'
            }, {
               xtype      : 'textfield',
               fieldLabel : '设置电话号码',
               id         : 'repeatertel',
               name       : 'repeatertel',
               allowBlank : false
            }]
         }, {
            columnWidth : .50,
            layout      : 'form',
            border      : false,
            items       : [{
               xtype      : 'textfield',
               fieldLabel : '查询站点编号',
               id         : 'stationidquery',
               name       : 'stationidquery',
               readOnly   : true
            }, {
               xtype      : 'textfield',
               fieldLabel : '查询设备编号',
               id         : 'statsubidquery',
               name       : 'statsubidquery',
               readOnly   : true
            }, {
               xtype      : 'textfield',
               fieldLabel : '查询电话号码',
               id         : 'repeatertelquery',
               name       : 'repeatertelquery',
               readOnly   : true
            }, {
               xtype : 'hidden',
               name  : 'ispass'
            }]
         }]
      }, password],
      buttons     : [{
         text    : '设置',
         handler : function() {
            if (!form.getForm().isValid()) return;
            var selectModel = Ext.getCmp('tree').getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            if (Ext.isEmpty(selectNode)) {
               Ext.Msg.alert('提示', '没有选中任何节点!');
            }
            var nodeId = selectNode.id;// station_0E010002_1953
            var nodeInfo = formatNodeId(nodeId);
            var repeaterId = nodeInfo.id;
            Ext.Ajax.request({// 判断站点是否连接成功
               url     : './repeaterInforamtion1.ered?reqCode=queryConnFlag',
               params  : {
                  repeaterid : repeaterId
               },
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  if (json.connectflag == '2') {
                     Ext.Msg.alert("", "请先连接站点！");
                  }
                  else {
                     if (json.connectflag == '0') {
                        Ext.Msg.alert("", "有人在操作该站点！");
                     }
                     else {
                        var vspwd = Ext.getCmp('superpwd').getValue();

                        if (vspwd == 'sunnada') {
                           form.form.findField('ispass').setValue("true");
                           Ext.Ajax.request({
                              url     : './devSetBoardInit.ered?reqCode=configReturn',
                              params  : {
                                 stationid    : Ext.getCmp('stationid').getValue(),
                                 statsubid    : Ext.getCmp('statsub-id').getValue(),
                                 tel          : Ext.getCmp('repeatertel').getValue(),
                                 oldStationid : oldStationid,
                                 protype      : protype,
                                 repeaterid   : repeaterid,
                                 channelname  : channelname
                              },
                              success : function(res) {
                                 var json2 = Ext.decode(res.responseText);
                                 var success = json2.success;
                                 var themsg = json2.msg;
                                 if (!success) {
                                    Ext.MessageBox.alert('', themsg);
                                    initMonitorboardWindow.close();
                                 }
                                 else {
                                    Ext.MessageBox.alert('', themsg);
                                    initMonitorboardWindow.close();
                                 }
                              },
                              failure : function(response) {
                                 Ext.MessageBox.alert('提示', '设置失败');
                              }

                           });
                        }
                        else {
                           form.form.findField('ispass').setValue("false");
                           Ext.Msg.alert('提示', "超级密码出错!");
                        }
                     }
                  }
               },
               failure : function(response) {
                  Ext.MessageBox.alert('提示', '判断站点是否连接:失败');
               }

            });
         }
      }, {
         text    : '查询',
         handler : function() {
            var selectModel = Ext.getCmp('tree').getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            if (Ext.isEmpty(selectNode)) {
               Ext.Msg.alert('提示', '没有选中任何节点!');
            }
            var nodeId = selectNode.id;// station_0E010002_1953
            var nodeInfo = formatNodeId(nodeId);
            var repeaterId = nodeInfo.id;
            Ext.Ajax.request({// 判断站点是否连接成功
               url     : './repeaterInforamtion1.ered?reqCode=queryConnFlag',
               params  : {
                  repeaterid : repeaterId
               },
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  if (json.connectflag == '2') {
                     Ext.Msg.alert("请先连接站点！");
                  }
                  else {
                     if (json.connectflag == '0') {
                        Ext.Msg.alert("有人在操作该站点！");
                     }
                     else {
                        var vspwd = Ext.getCmp('superpwd').getValue();

                        if (vspwd == 'sunnada') {
                           form.form.findField('ispass').setValue("true");
                           Ext.Ajax.request({
                              url     : './devSetBoardInit.ered?reqCode=searchReturn',
                              params  : {
                                 stationid   : Ext.getCmp('stationid').getValue(),
                                 statsubid   : Ext.getCmp('statsub-id').getValue(),
                                 tel         : Ext.getCmp('repeatertel').getValue(),
                                 protype     : protype,
                                 repeaterid  : repeaterid,
                                 channelname : channelname
                              },
                              success : function(res) {
                                 var json2 = Ext.decode(res.responseText);
                                 var themsg = json2.msg;
                                 Ext.MessageBox.alert('', themsg);
                              },
                              failure : function(response) {
                                 Ext.MessageBox.alert('提示', '查询失败');
                              }

                           });
                        }
                        else {
                           form.form.findField('ispass').setValue("false");
                           Ext.Msg.alert("超级密码出错!");
                        }

                     }
                  }
               },
               failure : function(response) {
                  Ext.MessageBox.alert('提示', '判断站点是否连接:失败');
               }

            });
         }
      }, {
         text    : '取消',
         handler : function() {
            initMonitorboardWindow.close();
         }
      }]
   });

   var initMonitorboardWindow = new Ext.Window({
      id            : 'initMonitorboardWindow',
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '监控板初始化', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 800, // 窗口宽度
      height        : 200, // 窗口高度
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

      items         : [form],
      // 设置窗口是否可以溢出父容器
      buttonAlign   : 'right'
   });
   return initMonitorboardWindow;
};