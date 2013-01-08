/**
 * 设备监控
 * 
 * @author huangwei
 * @since 2011-08-11
 */
Ext.onReady(function() {
   var root = new Ext.tree.AsyncTreeNode({
      text     : '站点地区',
      expanded : true,
      id       : 'root_01'
   });
   var menuTree = new Ext.tree.TreePanel({
      id         : 'tree',
      loader     : new Ext.tree.TreeLoader({
         baseAttrs  : {},
         baseParams : {
            'user_province' : user_dept_province,
            'user_city'     : user_dept_city
         },
         dataUrl    : './devicemnt.ered?reqCode=queryStationItems'
      }),
      root       : root,
      title      : '',
      applyTo    : 'menuTreeDiv',
      autoScroll : false,
      animate    : false,
      useArrows  : false,
      border     : false,
      tbar       : [{
         text    : '展开',
         iconCls : 'expand-allIcon',
         handler : function() {
            menuTree.expandAll();
         }
      }, '-', {
         text    : '收缩',
         iconCls : 'collapse-allIcon',
         handler : function() {
            menuTree.collapseAll();
            menuTree.root.expand();
         }
      }]
   });

   menuTree.on('click', function(node) {
      menuid = node.attributes.id;
      menuname = node.attributes.text;
      parentrepid = node.attributes.parentrepid;
      repeaterid = node.attributes.repeaterid;
      store.load({
         params   : {
            start       : 0,
            limit       : bbar.pageSize,
            menuid      : menuid,
            parentrepid : parentrepid
         },
         callback : function(r, options, success) {
            for (var i = 0; i < r.length; i++) {
               var record = r[i];
               var repeaterid_g = record.data.repeaterid;
               if (repeaterid_g == repeaterid) {
                  grid.getSelectionModel().selectRow(i);
                  return;
               }
            }
         }
      });
   });
   menuTree.root.select();

   var contextMenu = new Ext.menu.Menu({
      id    : 'siteContextMenu',
      items : [{
         id      : 'openConnection_btnByMenu',
         text    : '连接站点',
         handler : function(node) {
            var sitewindow = openConnection.createWindow();
            sitewindow.show();
         }
      }, {
         id      : 'closeConnection_btnByMenu',
         text    : '关闭站点',
         handler : function() {
            var node = menuTree.getSelectionModel().getSelectedNode();// 获得树节点
            var noteInfo = formatNodeId(node.id);
            var repeaterid = noteInfo.id;
            Ext.Ajax.request({
               url     : './btnConnectClick.ered?reqCode=close',
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  var msg = json.msg;
                  Ext.Msg.alert(msg);
                  node.parentNode.reload();
               },
               params  : {
                  repeaterid : repeaterid
               }
            });
         }
      }, '-', {
         id      : 'addRepeater_btnByMenu',
         text    : '新增站点',
         handler : function(node) {
            var window = AddRepeater.createWindow();
            window.show();
         }
      }, {
         id      : 'addSubMachine_btnByMenu',
         text    : '添加子机',
         handler : function(node) {
            var selectModel = menuTree.getSelectionModel(); // 获取树选择模型
            var selectNode = selectModel.getSelectedNode(); // 获取当前树选中节点对象
            var nodeId = selectNode.id;
            var noteInfo = formatNodeId(nodeId);
            nodeId = noteInfo.id;
            Ext.Ajax.request({
               url     : 'repeaterStatus.ered?reqCode=getSubCount',
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  if (json.success) {
                     if (!json.nohint) {
                        Ext.Msg.confirm('信息', json.msg, function(btn) {
                           if (btn == 'yes') {
                              var deviceTypeWindow = addSubMachine.createWindow(nodeId);
                              deviceTypeWindow.show();
                           }
                        });
                     }
                     else {
                        var deviceTypeWindow = addSubMachine.createWindow(nodeId);
                        deviceTypeWindow.show();
                     }
                  }
                  else {
                     Ext.Msg.alert('信息', json.msg);
                  }
               },
               params  : {
                  parentrepid : nodeId
               }
            });
         }
      }, {
         id      : 'copyHost_btnByMenu',
         text    : '站点复制',
         handler : function(node) {
            var node = menuTree.getSelectionModel().getSelectedNode();
            var noteInfo = formatNodeId(node.id);
            var flag = noteInfo.type;
            var nodeId = noteInfo.id;
            if (flag == 'host') {
               Ext.Ajax.request({
                  url     : 'saveRepeater.ered?reqCode=copyHost',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     Ext.Msg.alert('信息', json.msg);
                     // if (node.attributes.leaf) {
                     node.parentNode.reload();
                     // }
                     // else {
                     // node.reload();
                     // }
                  },
                  params  : {
                     repeaterid : nodeId
                  }
               });// 复制主机
            }
            else if (flag == 'sub') {// 复制子机
               Ext.Ajax.request({
                  url     : 'saveRepeater.ered?reqCode=copySub',
                  success : function(response) {
                     var json = Ext.decode(response.responseText);
                     Ext.Msg.alert('信息', json.msg);
                     if (node.attributes.leaf) {
                        node.parentNode.reload();
                     }
                     else {
                        node.reload();
                     }
                  },
                  params  : {
                     repeaterid : nodeId
                  }
               });
            }
         }
      }, {
         id      : 'deleHost_btnByMenu',
         text    : '删除站点',
         handler : function() {
            var node = menuTree.getSelectionModel().getSelectedNode();
            var noteInfo = formatNodeId(node.id);
            var flag = noteInfo.type;
            var nodeId = noteInfo.id;

            Ext.Msg.confirm('请确认', '您确定要删除节点：' + node.text, function(btn, text) {
               if (btn == 'yes') {
                  if (flag == 'host') {// 删除主机
                     Ext.Ajax.request({
                        url     : 'saveRepeater.ered?reqCode=deleHost',
                        success : function(response) {
                           var json = Ext.decode(response.responseText);
                           Ext.Msg.alert('信息', json.msg);
                           node.parentNode.reload();
                           store.reload();
                        },
                        params  : {
                           repeaterid : nodeId,
                           flag       : 'host'// 标示是主机还是子机
                        }
                     });
                  }
                  else if (flag == 'sub') {
                     Ext.Ajax.request({
                        url     : 'saveRepeater.ered?reqCode=deleHost',
                        success : function(response) {
                           var json = Ext.decode(response.responseText);
                           Ext.Msg.alert('信息', json.msg);
                           node.parentNode.reload();
                           store.reload();
                        },
                        params  : {
                           repeaterid : nodeId,
                           flag       : 'sub'
                        }
                     });
                  }
               }
            });
         }
      }, '-', {
         id      : 'modStation_btnByMenu',
         text    : '站点基本参数',
         handler : function() {
            var node = menuTree.getSelectionModel().getSelectedNode();
            var noteInfo = formatNodeId(node.id);
            var flag = noteInfo.type;
            var nodeID = noteInfo.id;
            var type = noteInfo.type;
            Ext.Ajax.request({
               url     : 'saveRepeater.ered?reqCode=isModem',
               success : function(response) {
                  var json = Ext.decode(response.responseText);
                  if (json.flag == 1) {
                     Ext.Msg.alert("", "该站点正在短信连接中!");
                     return;
                  }
                  else {
                     var record = Ext.data.Record.create([{ // 定义 弹出框里的数据结构
                        name : 'protype'
                     }, {
                        name : 'stationname'
                     }, {
                        name : 'devicetype'
                     }, {
                        name : 'province'
                     }, {
                        name : 'city'
                     }, {
                        name : 'stationid'
                     }, {
                        name : 'statsubid'
                     }, {
                        name : 'stattel'
                     }, {
                        name : 'ip'
                     }, {
                        name : 'setdate'
                     }, {
                        name : 'basestatcode'
                     }, {
                        name : 'site'
                     }, {
                        name : 'serid'
                     }, {
                        name : 'channelname'
                     }, {
                        name : 'x'
                     }, {
                        name : 'y'
                     }, {
                        name : 'note'
                     }]);
                     var temp;
                     Ext.Ajax.request({
                        url     : 'repeaterInforamtion1.ered?reqCode=getAllFields&repeaterid='
                                  + nodeID,
                        success : function(response) {
                           var json = Ext.decode(response.responseText);
                           temp = new record(json); // 装载弹出框数据
                           var window = ModStation.createWindow(temp, nodeID, type);
                           window.show();
                        }
                     });

                  }
               },
               params  : {
                  repeaterid : nodeID
               }
            });
         }
      }, '-', {
         id      : 'monitorParamList_btnByMenu',
         text    : '读取监控列表',
         handler : function() {
            var window = monitorParamList.createWindow();
            window.show();
         }
      }, {
         id      : 'initMonitorboard_btnByMenu',
         text    : '监控板初始化',
         handler : function() {
            var window = initMonitorboard.createWindow();
            window.show();
         }
      }, {
         id      : 'updateDevice_btnByMenu',
         text    : '远程升级',
         handler : function() {
            var window = updateDevice.createWindow();
            window.show();
         }
      }]
   });

   // 菜单右击事件
   menuTree.on('contextmenu', function(node, e) {
      e.preventDefault();
      menuid = node.attributes.id;
      menuname = node.attributes.text;
      var noteInfo = formatNodeId(menuid);
      var nodeId = noteInfo.id;
      store.load({
         params   : {
            start  : 0,
            limit  : bbar.pageSize,
            menuid : menuid
         },
         callback : function(r, options, success) {
            for (var i = 0; i < r.length; i++) {
               var record = r[i];
               var repeaterid = record.data.repeaterid;
               if (repeaterid == nodeId) {
                  grid.getSelectionModel().selectRow(i);
               }
            }
         }
      });
      node.select();
      // 屏蔽省份地市右击菜单 modify by huangwei
      var noteInfo = formatNodeId(node.id);
      if (noteInfo.type != null) {
         contextMenu.showAt(e.getXY());
      }
   });

   var sm = new Ext.grid.CheckboxSelectionModel({
      singleSelect : true
   });
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
      header    : '设备编号',
      dataIndex : 'statsubid',
      width     : 80
   }, {
      header    : '直放站名称',
      dataIndex : 'stationname',
      width     : 140,
      sortable  : true
   }, {
      header    : '站点状态',
      dataIndex : 'alarmtype',
      width     : 70,
      renderer  : function(value) {
         if (value == '10')
            return '<a href="javascript:void(0);"><font color="F9DE39">一般警告</font></a>';
         else if (value == '20')
            return '<a href="javascript:void(0);"><font color="F98039">重要告警</font></a>';
         else if (value == '30')
            return '<a href="javascript:void(0);"><font color="F92939">严重告警</font></a>';
         else
            return '<font color="8DD73C">正常</font>';
      }
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

   /**
    * 数据存储
    */
   var store = new Ext.data.Store({
      storeId : 'stationItemsForManagStore',
      proxy   : new Ext.data.HttpProxy({
         url : './devicemnt.ered?reqCode=queryStationItemsForManage'
      }),
      reader  : new Ext.data.JsonReader({
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
      }, {
         name : 'alarmtype'
      }])
   });

   // 翻页排序时带上查询条件
   store.on('beforeload', function() {
      var node = menuTree.getSelectionModel().getSelectedNode();
      if (node != null) {
         menuid = node.attributes.id;
         menuname = node.attributes.text;
         parentrepid = node.attributes.parentrepid;
         repeaterid = node.attributes.repeaterid;
         this.baseParams = {
            'user_province' : user_dept_province,
            'user_city'     : user_dept_city,
            menuid          : menuid,
            parentrepid     : parentrepid
         }
      }
      else {
         this.baseParams = {
            'user_province' : user_dept_province,
            'user_city'     : user_dept_city
         }
      }
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
      value         : '50',
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
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_combo]
   });

   var grid = new Ext.grid.GridPanel({
      title      : '<span style="font-weight:normal">直放站站点详细信息</span>',
      iconCls    : 'application_view_listIcon',
      autoScroll : true,
      region     : 'center',
      store      : store,
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      },
      stripeRows : true,
      frame      : true,
      // autoExpandColumn : 'remark',
      cm         : cm,
      sm         : sm,
      tbar       : [{
         id      : 'setMonitorParams_btnByGridTools',
         text    : '设置',
         iconCls : 'page_addIcon',
         handler : function() {
            setInit();
         }
      }, '-', {
         id      : 'addRepeater_btnByGridTools',
         text    : '新增',
         iconCls : 'page_addIcon',
         handler : function() {
            var window = AddRepeater.createWindow();
            window.show();
         }
      }, {
         id      : 'deleHost_btnByGridTools',
         text    : '删除',
         iconCls : 'page_delIcon',
         handler : function() {
            var record = grid.getSelectionModel().getSelected();
            if (Ext.isEmpty(record)) {
               Ext.Msg.alert('信息', '请先选择要删除的数据！');
               return;
            }
            Ext.Msg.confirm('请确认', "删除数据不可恢复，您确定要删除吗？", function(btn, text) {
               if (btn == 'yes') {
                  showWaitMsg();
                  Ext.Ajax.request({
                     url     : 'saveRepeater.ered?reqCode=deleHost',
                     success : function(response) {
                        var json = Ext.decode(response.responseText);
                        Ext.Msg.alert('信息', json.msg);
                        var node = menuTree.getSelectionModel().getSelectedNode();
                        node.parentNode.reload();
                        store.reload();
                     },
                     params  : {
                        repeaterid : record.get('repeaterid'),
                        flag       : 'sub'
                     }
                  });
               }
            });

         }
      }, '-', {
         id      : 'queryRepeater_btnByGridTools',
         text    : '查询',
         iconCls : 'page_findIcon',
         handler : function() {
            qWindow.show();
         }
      }, {
         text    : '刷新',
         id      : 'flush_btnByGridTools',
         iconCls : 'arrow_refreshIcon',
         handler : function() {
            store.reload();
         }
      }, '-', {
         text    : '导入站点',
         id      : 'import_btnByGridTools',
         iconCls : 'uploadIcon',
         handler : function() {
            showImportWindow();
         }
      }, {
         id      : 'exportExcel_btn',
         text    : '导出站点',
         iconCls : 'page_excelIcon',
         handler : function() {
            Ext.Msg.confirm('信息', '确定按照现在的查询条件导出站点吗？', function(btn) {
               if (btn == 'yes') {
                  var url =
                            './devicemnt.ered?reqCode=exportExcel&start=0&limit=' + bbar.pageSize
                               + '&';
                  var node = menuTree.getSelectionModel().getSelectedNode();
                  if (node != null) {
                     url += 'menuid=' + node.attributes.id;
                  }
                  else {
                     // qWindow.show();
                     url += qForm.getForm().getValues(true);
                  }
                  exportExcel(url);
               }
            });
         }
      }, '-', {
         text    : '打开报文窗口',
         id      : 'monitorLog_btn',
         iconCls : 'tableIcon',
         handler : function() {
            monitorLogPanel(this);
         }
      }],
      bbar       : bbar
   });

   /**
    * 报文回显窗口开关handel
    */
   var f = 0;
   function monitorLogPanel(btn) {
      var debugLogPanelObj = Ext.getCmp('debuglogConsole');
      if (f == 1) {
         debuglogConsole.collapse();// 收缩
         f = 0;
         btn.setText('打开报文窗口');
      }
      else {
         debuglogConsole.expand(); // 展开
         f = 1;
         btn.setText('关闭报文窗口');
      }
   };

   /**
    * add by yzz 2011.10.17
    */
   function showImportWindow() {
      Ext.getCmp('theFile').reset();
      importWindow.show();
   }

   var importPanel = new Ext.FormPanel({
      id          : 'importFormpanel',
      defaultType : 'textfield',
      labelAlign  : 'right',
      labelWidth  : 100,
      frame       : true,
      fileUpload  : true,
      items       : [{
         fieldLabel : '选择导入的文件',
         id         : 'theFile',
         name       : 'theFile',
         inputType  : 'file',
         allowBlank : false,
         anchor     : '99%'
      }]
   });

   /**
    * 导入窗口
    */
   var importWindow = new Ext.Window({
      layout        : 'fit',
      width         : 380,
      height        : 100,
      draggable     : true,
      closeAction   : 'hide',
      title         : '导入基站信息',
      modal         : false,
      collapsible   : true,
      titleCollapse : true,
      resizable     : true,
      titleCollapse : true,
      maximizable   : true,
      buttonAlign   : 'right',
      border        : false,
      constrain     : true,
      items         : [importPanel],
      buttons       : [{
         text    : '导入',
         iconCls : 'acceptIcon',
         handler : function() {
            var theFile = Ext.getCmp('theFile').getValue();
            if (Ext.isEmpty(theFile)) {
               Ext.Msg.alert('提示', '请先选择您要导入的xls文件...');
               return;
            }
            if (theFile.substring(theFile.length - 4, theFile.length) != ".xls") {
               Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件!');
               return;
            }
            importPanel.form.submit({
               url       : './saveRepeater.ered?reqCode=importExcel',
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  store.reload();
                  menuTree.root.reload();
                  importWindow.hide();
                  Ext.MessageBox.alert('提示', action.result.msg);
               },
               failure   : function(form, action) {
                  store.reload();
                  importWindow.hide();
                  Ext.MessageBox.alert('提示', action.result.msg);
               }
            });
         }
      }, {
         text    : '关闭',
         id      : 'btnReset',
         iconCls : 'deleteIcon',
         handler : function() {
            importWindow.hide();
         }
      }]
   });

   store.load({
      params : {
         start           : 0,
         limit           : bbar.pageSize,
         'user_province' : user_dept_province,
         'user_city'     : user_dept_city
      }
   });

   grid.on('rowclick', function(grid, rowIndex, event) {
      var record = grid.getSelectionModel().getSelections()[0];
      positionTreeNode(record);
   });

   grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
      var store = grid.getStore();
      var record = store.getAt(rowIndex);
      var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
      // alert(fieldName + '===' + columnIndex);
      if (fieldName == 'alarmtype' && columnIndex == 6) {// 跳转到警告信息
         var repeaterid = record.get('repeaterid');
         var alarmtype = record.get('alarmtype');
         if (alarmtype == '10' || alarmtype == '20' || alarmtype == '30') {
            parent.showAlarmTabPanel(repeaterid, '1', alarmtype);
         }
      }
   });

   var selectRepeaterWindow = new Ext.Window({
      id            : 'selectRepeaterWindow',
      iconCls       : 'page_settingIcon',
      layout        : 'fit',
      width         : document.body.clientWidth,
      height        : document.body.clientHeight,
      pageY         : 0,
      // pageX : document.body.clientWidth / 2 - 420 / 2,
      closeAction   : 'hide',
      listeners     : {
         'beforeclose' : {
            fn : function() {
            }
         }
      },
      buttonAlign   : 'right',
      constrain     : true,
      expandOnShow  : true,
      boder         : false,
      resizable     : false,
      draggable     : true,
      modal         : false,
      collapsible   : true,
      titleCollapse : true,
      hidden        : true
   });

   /**
    * 设置参数窗口
    */
   function setInit() {
      var rows = grid.getSelectionModel().getSelections();
      if (Ext.isEmpty(rows)) {
         Ext.Msg.alert('提示', '请先选中要设置的站点!');
         return;
      }
      if (rows.length > 1) {
         Ext.Msg.alert('提示', '只允许选择一个站点进行设置!');
         return;
      }

      var protype = jsArray2JsString(rows, 'protype');
      var repeaterid = jsArray2JsString(rows, 'repeaterid');
      var stationname = jsArray2JsString(rows, 'stationname');

      selectRepeaterWindow.show();
      selectRepeaterWindow.expand(false);
      selectRepeaterWindow.setTitle('<span style="font-weight:normal">【 ' + stationname
                                    + ' 】监控参数设置窗口</span>');
      var url = './devicemnt.ered?reqCode=setInit';
      selectRepeaterWindow.load({
         url        : url,
         discardUrl : false,
         nocache    : false,
         scripts    : true,
         timeout    : 30,
         params     : {
            protype    : protype,
            repeaterid : repeaterid
         }
      });

   }

   var debuglogConsole = new Ext.ux.LogPanel({
      id          : 'debuglogConsole',
      title       : '报文回显窗口',
      iconCls     : 'tableIcon',
      height      : 350,
      collapsible : true,
      collapsed   : true,
      border      : false,
      closable    : true, // 是否可关闭
      autoScroll  : true,
      region      : 'south',
      tbar        : [{
         text    : '清空内容',
         iconCls : 'page_cleanIcon',
         handler : function() {
            Ext.getCmp('debuglogConsole').clear();
         }
      }, '-', new Ext.form.Checkbox({
         id      : 'showAlarm',
         checked : true
      }), '接受告警报文', '-', new Ext.form.Checkbox({
         id      : 'showHeart',
         checked : true
      }), '接受心跳包报文', '->', '图标说明：', '<span class="nmsAlarmIcon">告警</span>', '-',
      '<span class="nmsErrorIcon">错误</span>', '-', '<span class="nmsHeartIcon">心跳包</span>', '-',
      '<span class="nmsInfoIcon">信息</span>'],
      listeners   : {
         'beforecollapse' : function() {
            Ext.getCmp('monitorLog_btn').setText('打开报文窗口');
            f = 0;
         },
         'beforeexpand'   : function() {
            Ext.getCmp('monitorLog_btn').setText('关闭报文窗口');
            f = 1;
         }
      }
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [{
         title       : '<span style="font-weight:normal">直放站站点</span>',
         iconCls     : 'layout_contentIcon',
         tools       : [{
            id      : 'refresh',
            handler : function() {
               menuTree.root.reload()
            }
         }],
         collapsible : true,
         width       : 210,
         minSize     : 160,
         maxSize     : 280,
         split       : true,
         region      : 'west',
         autoScroll  : true,
         // collapseMode:'mini',
         items       : [menuTree]
      }, {
         region : 'center',
         layout : 'border',
         items  : [grid, debuglogConsole]
      }]
   });

   /**
    * 刷新指定节点
    */
   function refreshNode(nodeid) {
      var node = menuTree.getNodeById(nodeid);
      /* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
      if (Ext.isEmpty(node)) {
         menuTree.root.reload();
         return;
      }
      if (node.attributes.leaf) {
         node.parentNode.reload();
      }
      else {
         node.reload();
      }
   };

   /**
    * *** add by huangwei for dmQuery ***
    */
   var provinceCombo = new Ext.form.ComboBox({
      hiddenName     : 'province',
      fieldLabel     : '所在省份',
      emptyText      : '请选择省份...',
      triggerAction  : 'all',
      store          : siteStore,
      displayField   : 'text',
      valueField     : 'value',
      mode           : 'local',
      forceSelection : true,
      typeAhead      : true,
      resizable      : false,
      editable       : false,
      anchor         : '100%',
      listeners      : {
         'select' : function() {
            cityCombo.reset();
            var value = provinceCombo.getValue();
            cityStore.load({
               params : {
                  parentsite : value
               }
            })
         }
      }
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
      hiddenName     : 'city',
      fieldLabel     : '所在地市',
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
      anchor         : '100%',// 宽度百分比
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
      anchor         : '100%'
   });

   var qForm = new Ext.form.FormPanel({
      border      : false,
      labelWidth  : 80, // 标签宽度
      labelAlign  : 'right', // 标签对齐方式
      bodyStyle   : 'padding:3 5 0', // 表单元素和表单面板的边距
      buttonAlign : 'center',
      height      : 120,
      items       : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .5,
            layout      : 'form',
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '直放站编号',
               name       : 'stationid',
               xtype      : 'textfield', // 设置为数字输入框类型
               anchor     : '100%'
            }, provinceCombo, protocolCombo]
         }, {
            columnWidth : .5,
            layout      : 'form',
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : '直放站名称',
               name       : 'stationname',
               allowBlank : true,
               maxLength  : 6,
               anchor     : '100%'
            }, cityCombo, devicetypeCombo]
         }]
      }]
   });

   var qWindow = new Ext.Window({
      title         : '<span class="commoncss">查询条件</span>', // 窗口标题
      layout        : 'fit', // 设置窗口布局模式
      width         : 500, // 窗口宽度
      height        : 160, // 窗口高度
      closable      : true, // 是否可关闭
      closeAction   : 'hide', // 关闭策略
      collapsible   : false, // 是否可收缩
      border        : false, // 边框线设置
      constrain     : true,
      titleCollapse : true,
      model         : true,
      resizable     : false,
      maximizable   : true,
      animateTarget : Ext.getBody(),
      pageY         : 10, // 页面定位Y坐标
      pageX         : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
      // 设置窗口是否可以溢出父容器
      buttonAlign   : 'right',
      items         : [qForm],
      buttons       : [{
         text    : '查询',
         iconCls : 'previewIcon',
         handler : function() {
            queryBalanceInfo(qForm.getForm());
            qWindow.hide();
         }
      }, {
         text    : '重置',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            qForm.getForm().reset();
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            qWindow.hide();
         }
      }]
   });

   /**
    * 定位到树节点
    */
   function positionTreeNode(record) {
      // 当前选择数据的相关属性
      var province = record.get('province');
      var city = record.get('city');
      var repeaterid = record.get('repeaterid');
      var stationid = record.get('stationid');
      var statsubid = record.get('statsubid');
      var nodeid = stationid + "_" + repeaterid;
      if (statsubid == '00' || statsubid == 'FF') {// 主机
         menuTree.getRootNode().expand();
         menuTree.getRootNode().cascade(function(n) {
            var id = n.attributes.id;
            if (id.indexOf("province_" + province) != -1) {
               n.expand();
            }
            if (id.indexOf("city_" + province + "_" + city) != -1) {
               n.expand();
            }
            if (id.indexOf(stationid + "_" + statsubid) != -1) {
               menuTree.getSelectionModel().select(n, Ext.EventObject, true);
               return false;
            }
         });
      }
      else {// 丛机
         menuTree.getRootNode().expand();
         menuTree.getRootNode().cascade(function(n) {
            var id = n.attributes.id;
            if (id.indexOf("province_" + province) != -1) {
               n.expand();
            }
            if (id.indexOf("city_" + province + "_" + city) != -1) {
               n.expand();
            }
            if (id.indexOf("station_" + stationid + "_") != -1) {
               n.expand();

            }
            if (id.indexOf(stationid + "_" + statsubid) != -1) {
               menuTree.getSelectionModel().select(n, Ext.EventObject, true);
               return false;
            }
         });
      }
   };

   function unselectTreeNode() {
      // 取消树节点选中，避免节点过滤站点
      var node = menuTree.getSelectionModel().getSelectedNode();
      if (node != null) {
         node.unselect();
      }
   };

   // 查询表格数据
   function queryBalanceInfo(pForm) {
      unselectTreeNode();
      var params = pForm.getValues();
      params.start = 0;
      params.limit = bbar.pageSize;
      params.menuid = '';
      store.load({
         params   : params,
         callback : function(r, options, success) {
         }
      });
   };

});