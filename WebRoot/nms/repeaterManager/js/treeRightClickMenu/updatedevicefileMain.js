Ext.namespace("updateDevice");

updateDevice.createWindow = function() {
   var filename = "";
   var path = "";
   var filecrc = "";
   // 复选框
   var sm = new Ext.grid.CheckboxSelectionModel({
      singleSelect : true
   });

   // 定义自动当前页行号
   // var rownum = new Ext.grid.RowNumberer({
   // header : 'NO',
   // width : 28
   // });

   // 定义列模型
   var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
      id        : 'filename',
      type      : 'string',
      header    : '文件名称',
      dataIndex : 'filename'
   }, {
      id        : 'filecrc',
      type      : 'string',
      header    : '文件识别码',
      dataIndex : 'filecrc'
   }, {
      id        : 'path',
      type      : 'string',
      header    : '文件路径',
      dataIndex : 'path',
      hidden    : true
   }]);

   // 日志
   var journalCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
      id        : 'context',
      type      : 'string',
      header    : '日志内容',
      dataIndex : 'context'
   }]);

   /**
    * 数据存储
    */

   var store = new Ext.data.Store({
      proxy  : new Ext.data.HttpProxy({
         url : './updatedevicefile.ered?reqCode=queryItems'
      }),
      reader : new Ext.data.JsonReader({
         totalProperty : 'TOTALCOUNT',
         root          : 'ROOT'
      }, [{
         name : 'filename',
         type : 'string'
      }, {
         name : 'filecrc',
         type : 'string'
      }, {
         name : 'path',
         type : 'string'
      }])
   });

   // 每页显示条数下拉选择框
   var pagesize_combo = new Ext.form.ComboBox({
      name          : 'pagesize',
      triggerAction : 'all',
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
   // 改变每页显示条数reload数据
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

   // 分页工具栏
   var bbar = new Ext.PagingToolbar({
      pageSize    : number,
      store       : store,
      displayInfo : true,
      displayMsg  : '显示{0}条到{1}条,共{2}条',
      plugins     : new Ext.ux.ProgressBarPager(), // 分页进度条
      emptyMsg    : "没有符合条件的记录",
      items       : ['-', '&nbsp;&nbsp;', pagesize_combo]
   });

   // 表格工具栏
   var tbar = new Ext.Toolbar({
      items : [{
         text    : '选择文件',
         iconCls : 'uploadIcon',
         handler : function() {
            firstWindow.show();
         }
      }, '-',
      /*
       * { text : '成功率测试', iconCls : 'commentsIcon', handler : function() {
       * win_swfupload.show(); } }, '-',
       */
      {
         text    : '开始',
         iconCls : 'acceptIcon',
         handler : function() {
            delFiles();
         }
      }, '-', {
         text    : '停止升级',
         iconCls : 'deleteIcon',
         handler : function() {
            stop();
         }
      }, '-', {
         text    : '清空日志',
         iconCls : 'page_cleanIcon',
         handler : function() {
            updatelogConsole.clear();
         }
      }]
   });

   // 页面初始自动查询数据
   store.load({
      params : {
         start : 0,
         limit : bbar.pageSize
      }
   });

   // 表格实例
   var grid = new Ext.grid.GridPanel({
      height     : 300,
      frame      : true,
      autoScroll : true,
      region     : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
      store      : store, // 数据存储
      stripeRows : true, // 斑马线
      cm         : cm, // 列模型
      sm         : sm, // 复选框
      tbar       : tbar, // 表格工具栏
      bbar       : bbar,// 分页工具栏
      viewConfig : {
         // 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
         forceFit : true
      },
      loadMask   : {
         msg : '正在加载表格数据,请稍等...'
      }
   });

   var firstForm = new Ext.form.FormPanel({
      // id : 'firstForm',
      name        : 'firstForm',
      fileUpload  : true, // 一定要设置这个属性,否则获取不到上传对象的
      labelWidth  : 60,
      defaultType : 'textfield',
      labelAlign  : 'right',
      bodyStyle   : 'padding:5 5 5 5',
      items       : [{
         fieldLabel : '选择文件',
         // id : 'file1',
         name       : 'file1', // 必须为file1/file2/file3/file4/file5.目前Web标准上传模式支持最多5个文件的批量上传
         xtype      : 'fileuploadfield', // 上传字段
         allowBlank : false,
         anchor     : '100%'
      }, {
         // id : 'filename',
         // fieldLabel : '文件名称',
         // hidden : true,
         xtype      : 'hidden',
         name       : 'filename',
         disabled   : true,
         fieldClass : 'x-custom-field-disabled',
         anchor     : '100%'
      }]
   });

   var firstWindow = new Ext.Window({
      title         : '<span style="font-weight:normal">选择升级文件</span>', // 窗口标题
      layout        : 'fit', // 设置窗口布局模式
      width         : 500, // 窗口宽度
      height        : 100, // 窗口高度
      closable      : true, // 是否可关闭
      collapsible   : true,
      titleCollapse : true,
      resizable     : true,
      maximizable   : true, // 设置是否可以最大化
      closeAction   : 'hide',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      // pageY : 20, // 页面定位X坐标
      pageX         : document.body.clientWidth / 2 - 500 / 2, // 页面定位Y坐标
      items         : [firstForm], // 嵌入的表单面板
      buttons       : [{ // 窗口底部按钮配置
         text    : '上传', // 按钮文本
         iconCls : 'uploadIcon', // 按钮图标
         handler : function() { // 按钮响应函数
            submitTheForm();
         }
      }, { // 窗口底部按钮配置
         text    : '重置', // 按钮文本
         iconCls : 'tbar_synchronizeIcon', // 按钮图标
         handler : function() { // 按钮响应函数
            firstForm.form.reset();
         }
      }]
   });

   /**
    * 开始升级
    */
   function delFiles() {
      // 开始升级文件
      var node = Ext.getCmp('tree').getSelectionModel().getSelectedNode();
      var nodeId = formatNodeId(node.id);
      repeaterid = nodeId.id;
      var stationId = nodeId.stationid;
      var statsubid = node.attributes.statsubid;
      // alert(stationId+"---"+statsubid);
      var record = grid.getSelectionModel().getSelected();
      if (Ext.isEmpty(record)) {
         Ext.Msg.alert("提示", "请选择上传文件");
         return;
      }
      var fileName = record.get('filename');
      var filePath = record.get('path');
      var fileCrc = record.get('filecrc');
      // alert(fileName);
      // if (filename == "" || path == "" || filecrc == "") {
      // Ext.Msg.alert("提示", "请选择上传文件");
      // }

      Ext.Ajax.request({
         url     : "updatedevicefile.ered?reqCode=doUpdate",
         success : function(response) {
            var json = Ext.decode(response.responseText);
            Ext.Msg.alert('提示', json.msg);
         },
         params  : {
            repeaterid  : repeaterid,
            crcStr      : fileCrc,
            filePathStr : filePath,
            fileNameStr : fileName,
            stationId   : stationId,
            statsubid   : statsubid
         }
      });
   }

   /**
    * 表单提交(表单自带Ajax提交)
    */
   function submitTheForm() {
      if (!firstForm.form.isValid()) {
         return;
      }

      firstForm.form.submit({
         url       : 'updatedevicefile.ered?reqCode=doUploadFile',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在上传文件,请稍候...',
         timeout   : 60000, // 60s
         success   : function(form, action) {
            filename = action.result.filename;
            path = action.result.path;
            filecrc = action.result.filecrc;
            Ext.MessageBox.alert('提示', action.result.msg);
            // alert(filename);
            // alert(path);
            // alert(filecrc);
            firstForm.form.reset();
            firstWindow.hide();
            store.reload();
         },
         failure   : function(form, action) {
            Ext.MessageBox.alert('提示', '文件上传失败');
         }
      });
   }

   // 获取选择行
   function getCheckboxValues() {
      // 返回一个行集合JS数组
      var rows = grid.getSelectionModel().getSelections();
      if (Ext.isEmpty(rows)) {
         Ext.MessageBox.alert('提示', '您没有选中任何数据!');
         return;
      }
      // 将JS数组中的行级主键，生成以,分隔的字符串
      var strChecked = jsArray2JsString(rows, 'devicefileid');
      Ext.MessageBox.alert('提示', strChecked);
      // 获得选中数据后则可以传入后台继续处理
   }

   function stop() {
      var node = Ext.getCmp('tree').getSelectionModel().getSelectedNode();
      var nodeId = formatNodeId(node.id);
      repeaterid = nodeId.id;
      var stationId = nodeId.stationid;
      var statsubid = node.attributes.statsubid;
      Ext.Ajax.request({
         url     : 'updatedevicefile.ered?reqCode=cancle',
         success : function(response) {
            var json = Ext.decode(response.responseText);
            Ext.Msg.alert('提示', json.msg);
         },
         params  : {
            stationId  : stationId,
            statsubid  : statsubid,
            repeaterid : repeaterid
         }
      });
   };

   var updatelogConsole = new Ext.ux.LogPanel({
      id         : 'updatelogConsole',
      title      : '升级日志',
      height     : 200,
      closable   : true, // 是否可关闭
      autoScroll : true,
      region     : 'south'
   });

   var updateWindow = new Ext.Window({
      id          : 'updateDeviceWindow',
      // renderTo : 'super', // 和JSP页面的DIV元素ID对应
      title       : '远程升级', // 窗口标题
      iconCls     : 'imageIcon',
      // layout : 'fit', // 设置窗口布局模式
      layout      : 'border',
      // closeAction : 'hide',
      width       : 500, // 窗口宽度
      height      : document.body.clientHeight, // 窗口高度
      // tbar : tb, // 工具栏
      closable    : true, // 是否可关闭
      collapsible : true, // 是否可收缩
      maximizable : true, // 设置是否可以最大化
      modal       : true,
      border      : false, // 边框线设置
      pageY       : 120, // 页面定位Y坐标
      pageX       : document.body.clientWidth / 2 - 400 / 2, // 页面定位X坐标
      constrain   : true,
      items       : [grid, updatelogConsole]
   });

   return updateWindow;

};