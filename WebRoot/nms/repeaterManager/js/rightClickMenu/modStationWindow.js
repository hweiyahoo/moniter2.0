Ext.ns("ModStation");

ModStation.createWindow = function(record, id, type) {
   var result;

   var old = record.get('stationid');

   var flag = 0;// 判断是否为初次加载

   var devicetypeStore = new Ext.data.Store({
      proxy     : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=devicetype'
      }),
      reader    : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }]),
      listeners : { // 监听设备类型store改变以后在对设备类型下拉框进去设值，由于form展现出来以后store的数据才加载完成，所以出此下策
         datachanged : function(cb) {
            if (flag == 0) {
               Ext.getCmp('devtype-id').setValue(record.get('devicetype'));
            }
         }
      }

   });

   devicetypeStore.load({
      params : {
         protype : record.get('protype')
      }
   });

   // 地市
   var cityStore = new Ext.data.Store({
      proxy     : new Ext.data.HttpProxy({
         url : 'cbx.ered?reqCode=queryCode&cbxName=site'
      }),
      reader    : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }]),
      listeners : {
         datachanged : function(cb) {
            if (flag == 0) {
               Ext.getCmp('city-id').setValue(record.get('city'));
            }
         }
      }
   });

   cityStore.load({
      params : {
         parentsite : record.get('province')
      }
   });
   //
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

   // // 基站
   // var basestatcodeStore = new Ext.data.Store({
   // proxy : new Ext.data.HttpProxy({
   // url : 'baseStatCodeCombo.ered?reqCode=baseStatCode'
   // }),
   // reader : new Ext.data.ArrayReader({}, [{
   // name : 'value'
   // }, {
   // name : 'text'
   // }]),
   // listeners : {
   // datachanged : function(cb) {
   // if (flag == 0) {
   //               
   // }
   // }
   // }
   // })

   var modStatForm = new Ext.form.FormPanel({
      title       : '基本参数',
      region      : 'center',
      labelAlign  : 'right',
      border      : true,
      collapsible : false,
      // reader : reader,
      buttonAlign : 'center',
      labelWidth  : 80,
      id          : 'modStatForm',
      bodyStyle   : 'padding:5 5 0', // 表单元素和表单面板的边距
      items       : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel    : '协议类型',
               xtype         : 'combo',
               id            : 'protype-id',
               name          : 'protype-name',
               editable      : false,
               hiddenName    : 'protype', // 提交到后台的input的name
               // ，对应下面store里的''id，必须要填
               store         : protocolStore,
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               anchor        : '100%',
               listeners     : {
                  select : function(cb) {
                     flag = 1;
                     modStatForm.getForm().findField("devtype-id").setValue("");
                     var value = cb.getValue();
                     devicetypeStore.removeAll();
                     devicetypeStore.load({
                        params : {
                           protype : value
                        }
                     });
                  }
               }
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '直放站名称',
               anchor     : '100%',
               name       : 'stationname',
               allowBlank : false
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel    : '设备类型',
               xtype         : 'combo',
               id            : 'devtype-id',
               name          : 'devtype-name',
               hiddenName    : 'devicetype', // 提交到后台的input的name
               // ，对应下面store里的''id，必须要填
               store         : devicetypeStore,
               editable      : false,
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               anchor        : '100%'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel    : '省份',
               xtype         : 'combo',
               id            : 'province-id',
               name          : 'province-name',
               hiddenName    : 'province', // 提交到后台的input的name
               // ，对应下面store里的''id，必须要填
               store         : siteStore,
               editable      : false,
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               anchor        : '100%',
               listeners     : {
                  select : function(cb) {
                     flag = 1;
                     modStatForm.getForm().findField("city-id").setValue("");
                     var value = cb.getValue();
                     cityStore.removeAll();
                     cityStore.load({
                        params : {
                           parentsite : value
                        }
                     });
                  }
               }
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel    : '地市',
               xtype         : 'combo',
               id            : 'city-id',
               name          : 'city',
               hiddenName    : 'city', // 提交到后台的input的name ，对应下面store里的''id，必须要填
               store         : cityStore,
               editable      : false,
               allowBlank    : false,
               mode          : 'local',
               triggerAction : 'all',
               valueField    : 'value',
               displayField  : 'text',
               anchor        : '100%',
               listeners     : {
                  select : function(cb) {
                     var city = cb.getValue();
                     var province = Ext.getCmp('province-id').getValue();
                     Ext.Ajax.request({// 获取当前省市下已有多少个主机
                        url     : 'repeaterCount.ered?reqCode=getCount',
                        success : function(response) {
                           var json = Ext.decode(response.responseText);
                           var count = json.num;
                           Ext.getCmp('stationid').setValue(province + city + count);
                        },
                        params  : {
                           province : province,
                           city     : city
                        }
                     });
                  }
               }
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel    : '直放站编号',
               anchor        : '100%',
               name          : 'stationid',
               id            : 'stationid',
               allowBlank    : false,
               maxLength     : 8,
               maxLengthText : '直放站编号最长为8位',
               vtype         : 'alphanum',
               vtypeText     : '请输入16进制的编号'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel    : '设备编号',
               xtype         : 'combo',
               id            : 'statsub-id',
               name          : 'statsub-name',
               editable      : false,
               hiddenName    : 'statsubid', // 提交到后台的input的name
               // ，对应下面store里的''id，必须要填
               store         : subIdStore,
               mode          : 'local',
               triggerAction : 'all',
               displayField  : 'text',
               anchor        : '100%'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '电话',
               id         : 'telephone',
               anchor     : '100%',
               name       : 'stattel'
            }]
         }, {
            columnWidth : 1.0,
            layout      : 'form',
            labelWidth  : 250, // 标签宽度
            border      : false,
            items       : [{
               xtype      : 'label',
               fieldLabel : 'FF:"单机"式直放站  00:多机中的主机',
               anchor     : '100%'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : 'IP',
               anchor     : '100%',
               name       : 'ip'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'datefield',
            border      : false,
            items       : [{
               fieldLabel : '安装日期',
               anchor     : '100%',
               name       : 'setdate',
               format     : 'Y年Md日'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel    : '基站',
               xtype         : 'combo',
               id            : 'basestatcode-id',
               name          : 'basestatcode-name',
               hiddenName    : 'basestatcode', // 提交到后台的input的name
               // ，对应下面store里的''id，必须要填
               store         : cityStore,
               mode          : 'local',
               triggerAction : 'all',
               displayField  : 'text',
               anchor        : '100%'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '安装地点',
               anchor     : '100%',
               name       : 'site'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '序列号',
               anchor     : '100%',
               name       : 'serid'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '经度',
               anchor     : '100%',
               name       : 'x'
            }]
         }, {
            columnWidth : 0.5,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '纬度',
               anchor     : '100%',
               name       : 'y'
            }]
         }]
      }, {
         fieldLabel : '记录信息',
         xtype      : 'textarea',
         anchor     : '100%',
         name       : 'note',
         emptyText  : '记录信息...'
      }],
      buttons     : [{
         text    : '保存',
         width   : 40,
         handler : function() {
            var saveflag = 0;
            if (!modStatForm.getForm().isValid()) {
               return;
            }
            if (type == 'host') {
               var num;
               Ext.Ajax.request({
                  url     : './saveRepeaterInfo.ered?reqCode=subCount',
                  success : function(response) {
                     num = response.responseText;
                     if ((old != Ext.getCmp('stationid').getValue()) && num != 0) {
                        Ext.Msg.confirm('请确认', '是否需要把从机设备编号改成与主机一致', function(btn, text) {
                           if (btn == 'yes') {
                              saveflag = 1;
                              edit(saveflag, num);
                           }
                           else {
                              saveflag = 0;
                              edit(saveflag, num);
                           }
                        });
                     }
                     else {
                        saveflag = 0;
                        edit(saveflag, num);
                     }
                  },
                  params  : {
                     parentrepid : id
                  }
               });
            }
            else {
               saveflag = 0;
               edit(saveflag, 0);
            }

         }
      }, {
         text    : '关闭',
         width   : 40,
         handler : function() {
            modStatWindow.close();
         }
      }],
      listeners   : {
         render : function(cb) {
            modStatForm.form.loadRecord(record);
         }
      }
   });

   function edit(saveflag, num) {
      // 修改
      Ext.lib.Ajax.request('POST', 'saveRepeaterInfo.ered?reqCode=updateItem', {
         success : function(resp) {
            var Result = Ext.decode(resp.responseText);
            Ext.Msg.alert('信息', Result.msg);
            var selectModel = Ext.getCmp('tree').getSelectionModel();
            var selectNode = selectModel.getSelectedNode();
            selectNode.parentNode.reload();
            // selectNode.select();
         },
         failure : function() {
            Ext.Msg.alert('错误', "修改失败");
         }
      }, modStatForm.getForm().getValues(true) + '&flag=' + saveflag + '&repeaterid=' + id
         + '&oldStationid=' + record.get('stationid') + '&loginuserid=' + parent.userid + '&num='
         + num);
   }

   // modStatForm.form.loadRecord(record);
   // Ext.getCmp('devtype-id').setValue('34');

   // modStatForm.form.load({
   // url : 'repeaterInforamtion1.ered?reqCode=getAllFields&id=' + nodeID,
   // waitMsg : '正在载入数据...',
   // success : function(form, action) {
   // var protocol = modStatForm.form.findField('protype').getValue();
   // devicetypeStore.load({
   // params : {
   // protype : protocol
   // }
   // });
   // },
   // failure : function(form, action) {
   // Ext.MessageBox.alert('编辑', '载入失败');
   // }
   // });

   var modStatWindow = new Ext.Window({
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title         : '基本参数', // 窗口标题
      iconCls       : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout        : 'border',
      width         : 600, // 窗口宽度
      height        : 400, // 窗口高度
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
      items         : [modStatForm],
      // 设置窗口是否可以溢出父容器
      buttonAlign   : 'right'
   });
   /*
    * Ext.lib.Ajax.request({ url : './servlet/RepeaterInfoServlet', success :
    * function(response) { var json = Ext.decode(response.responseText); if
    * (json.failure) { Ext.Msg.alert("错误", "无法获取数据!"); } else { var data =
    * json.data; Ext.getCmp('modStatForm').getForm().load(data); } }, failure :
    * function() { Ext.Msg.alert('错误', "删除失败"); }, params : { optype : 'init',
    * id : id } });
    */

   // Ext.getCmp('modStatForm').getForm().load({url:'./servlet/RepeaterInfoServlet?id='+id+'&optype=init'});
   return modStatWindow;
}