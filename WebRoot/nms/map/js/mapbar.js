var menuTree = null;
Ext.onReady(function() {
   var root = new Ext.tree.AsyncTreeNode({
      text     : '站点地区',
      expanded : true,
      id       : 'root_01'
   });
   menuTree = new Ext.tree.TreePanel({
      id         : 'tree',
      loader     : new Ext.tree.TreeLoader({
         baseAttrs  : {},
         baseParams : {
            'user_province' : user_dept_province,
            'user_city'     : user_dept_city,
            'datetime'      : new Date().getTime()
         },
         dataUrl    : './map.ered?reqCode=queryStationItems'
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
      node_pid = node.attributes.pid;
      node_le = node.attributes.le;
      if (menuid != 'root_01') {
         if (node_pid == "" || node_pid == null) {
            alert(menuname + "  还没配置经纬度，无法定位！");
            return false;
         }
         else if ((node_le == null || node_le == "")
                  && (menuid.indexOf('station') == -1 && menuid.indexOf('substation') == -1)) {
            alert(menuname + "  还没配置显式缩放层级，无法准确定位！");
            return false;
         }

      }
      if (menuid.indexOf('province') != -1) {
         goProvince(node_pid, node_le);
      }
      else if (menuid.indexOf('city') != -1) {
         goCity(node_pid, node_le);
      }
      else if (menuid.indexOf('station') != -1 || menuid.indexOf('substation') != -1) {
         goStation(node_pid, 11);
      }
      else {
         goInitArea();
      }
   });
   menuTree.root.select();

   var areaPointMenu = new Ext.menu.Menu({
      items : [{
         id      : 'areaPoint_setbtn',
         text    : '设置经纬度',
         iconCls : 'edit1Icon',
         handler : function() {
            initEditorForEdit();
         }
      }]
   });

   function createContextMenu(nodeid) {
      if (nodeid.indexOf('province') != -1 || nodeid.indexOf('city') != -1) {
         return areaPointMenu;
      }
   }

   // 添加树节点右击菜单
   menuTree.on('contextmenu', function(node, e) {
      e.preventDefault();
      node.select();
      var contextMenu = createContextMenu(node.id);
      contextMenu.showAt(e.getXY());
   });

   var editorWindow, editorForm;
   editorForm = new Ext.form.FormPanel({
      labelAlign : 'right',
      labelWidth : 80,
      frame      : true,
      items      : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            defaultType : 'textfield',
            items       : [{
               xtype : 'hidden',
               name  : 'siteid'
            }, {
               fieldLabel : '编号',
               anchor     : '100%',
               fieldClass : 'x-custom-field-disabled',
               name       : 'sitecode',
               allowBlank : false,
               disabled   : true
            }, {
               fieldLabel : '名称',
               anchor     : '100%',
               fieldClass : 'x-custom-field-disabled',
               name       : 'sitename',
               allowBlank : false,
               disabled   : true
            }, {
               fieldLabel : '经度',
               name       : 'x',
               anchor     : '100%',
               allowBlank : false,
               labelStyle : 'color:A62017;'
            }, {
               fieldLabel : '纬度',
               name       : 'y',
               anchor     : '100%',
               allowBlank : false,
               labelStyle : 'color:A62017;'
            }, {
               fieldLabel     : '地图显式层级',
               name           : 'le',
               xtype          : 'spinnerfield',
               incrementValue : 2,
               minValue       : 1,
               maxValue       : 14,
               labelStyle     : 'color:A62017;',
               allowBlank     : false,
               anchor         : '100%'
            }]
         }]
      }]
   });
   editorWindow = new Ext.Window({
      layout        : 'fit',
      width         : 280, // 窗口宽度
      height        : 210, // 窗口高度
      closable      : false, // 是否可关闭
      collapsible   : true, // 是否可收缩
      maximizable   : true, // 设置是否可以最大化
      border        : false, // 边框线设置
      constrain     : true, // 设置窗口是否可以溢出父容器
      pageY         : 100, // 页面定位Y坐标
      animateTarget : Ext.getBody(),
      pageX         : document.body.clientWidth / 2 - 380 / 2, // 页面定位X坐标
      resizable     : true,
      draggable     : true,
      closeAction   : 'hide',
      title         : '设置经纬度信息',
      iconCls       : 'page_editIcon',
      modal         : false,
      titleCollapse : true,
      buttonAlign   : 'right',
      animCollapse  : true,
      animateTarget : Ext.getBody(),
      items         : [editorForm],
      buttons       : [{
         text    : '保存',
         iconCls : 'acceptIcon',
         handler : function() {
            saveEditor();
         }
      }, {
         text    : '重置',
         id      : 'btnReset_',
         iconCls : 'tbar_synchronizeIcon',
         handler : function() {
            clearForm(editorForm.getForm());
         }
      }, {
         text    : '关闭',
         iconCls : 'deleteIcon',
         handler : function() {
            editorWindow.hide();
         }
      }]
   });

   /**
    * 设置经纬度信息
    */
   function initEditorForEdit() {
      var node = menuTree.getSelectionModel().getSelectedNode();
      editorForm.form.reset();
      editorForm.form.setValues({
         'siteid'   : node.attributes.siteid,
         'sitecode' : node.attributes.id.split("_")[1],
         'sitename' : node.attributes.text,
         'x'        : node.attributes.x,
         'y'        : node.attributes.y,
         'le'       : node.attributes.le
      });
      editorWindow.show();
      editorWindow.setTitle('<span style="font-weight:normal">设置经纬度信息</span>');
   }

   /**
    * 设置经纬度信息
    */
   function saveEditor() {
      if (!editorForm.form.isValid()) {
         return;
      }
      editorForm.form.submit({
         url       : './map.ered?reqCode=saveSitePointInfo',
         waitTitle : '提示',
         method    : 'POST',
         waitMsg   : '正在处理数据,请稍候...',
         success   : function(form, action) {
            editorWindow.hide();
            var node = menuTree.getSelectionModel().getSelectedNode();
            // refreshNode(node.id);
            node.parentNode.reload();
            Ext.MessageBox.alert('提示', action.result.msg);
         },
         failure   : function(form, action) {
            Ext.MessageBox.alert('提示', action.result.msg);
         }
      });
   };

   /**
    * 刷新指定节点
    */
   function refreshNode(nodeid) {
      var node = menuTree.getNodeById(nodeid);
      /* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
      if (Ext.isEmpty(node)) {
         menuTree.root.reload();
         alert("menuTree.root.reload()");
         return;
      }
      if (node.attributes.leaf) {
         node.parentNode.reload();
         alert("node.parentNode.reload()");
      }
      else {
         node.reload();
         alert("node.reload()");
      }
   }

   var mapPanel = new Ext.Panel({
      title     : '地图栏',
      layout    : 'fit',
      border    : false,
      // html : '<div id="mapbar"></div>',
      contentEl : 'mapbar',
      tbar      : [{
         id      : 'stationPoint_setbtn',
         text    : '设置',
         iconCls : 'page_addIcon',
         handler : function() {
            setMapPointJWD();
         }
      }, '当前设置的站点是：', {
         id         : 'currentStation',
         xtype      : 'textfield',
         anchor     : '100%',
         fieldClass : 'x-custom-field-disabled',
         disabled   : true
      }, '<div id="saveStatuTip" style="display:none;"><font color="red">未保存！</font></div>', {
         id       : 'stationPoint_cancelbtn',
         text     : '取消设置',
         iconCls  : 'page_addIcon',
         disabled : true,
         handler  : function() {
            doCancelBtnHandle();
         }
      }, {
         id       : 'stationPoint_savebtn',
         text     : '保存',
         iconCls  : 'page_addIcon',
         disabled : true,
         handler  : function() {
            doSaveBtnHandle();
         }
      }],
      listeners : {
         afterrender : function() {
            initMap();
         }
      }
   });

   var paramInfoPanel = new Ext.form.FormPanel({
      id         : 'paramInfoPanel',
      labelAlign : 'right',
      labelWidth : 40,
      frame      : true,
      items      : [{
         layout : 'column',
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            defaultType : 'textfield',
            items       : [{
               id         : 'pointLon',
               name       : 'pointLon',
               fieldLabel : '经度',
               anchor     : '100%',
               fieldClass : 'x-custom-field-disabled',

               allowBlank : false,
               disabled   : true
            }, {
               id         : 'pointLat',
               name       : 'pointLat',
               fieldLabel : '纬度',
               anchor     : '100%',
               fieldClass : 'x-custom-field-disabled',
               allowBlank : false,
               disabled   : true
            }, {
               id         : 'le',
               name       : 'le',
               fieldLabel : '层级',
               anchor     : '100%',
               fieldClass : 'x-custom-field-disabled',
               allowBlank : false,
               disabled   : true
            }]
         }]
      }]
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({ 
      layout : 'border',
      items  : [{
         width      : 240,
         minSize    : 120,
         maxSize    : 300,
         split      : true,
         border     : false,
         layout     : 'border',
         region     : 'west',
         items      : [{
            title      : '<span class="commoncss">功能菜单</span>',
            iconCls    : 'layout_contentIcon',
            tools      : [{
               id      : 'refresh',
               handler : function() {
                  menuTree.root.reload()
               }
            }],
            region     : 'center',
            autoScroll : true,
            items      : [menuTree]
         }, {
            title      : '<span class="commoncss">属性</span>',
            iconCls    : 'layout_contentIcon',
            height     : 130, 
            region     : 'south',
            frame      : true,
            autoScroll : true,
            items      : [paramInfoPanel]
         }]
      }, {
         id     : 'mapPanelParent',
         region : 'center',
         layout : 'fit',
         border : false,
         items  : [mapPanel]
      }]
   });

});
