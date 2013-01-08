/**
 * 地区编码管理
 * 
 * @author huangwei
 * @since 2011-10-27
 */
Ext.onReady(function() {
   var selectText = "";
   var selectValue = "";

   var memoStore = new Ext.data.Store({
      proxy      : new Ext.data.HttpProxy({
         url : 'memo.ered?reqCode=init'
      }),
      reader     : new Ext.data.JsonReader({}, [{
         name : 'value'
      }, {
         name : 'text'
      }]),
      baseParams : {}
   });

   var memotitle_combo = new Ext.form.ComboBox({
      name           : 'memotitle_combo',
      store          : memoStore,
      mode           : 'remote',
      triggerAction  : 'all',
      valueField     : 'value',
      displayField   : 'text',
      forceSelection : true,
      editable       : false,
      typeAhead      : true,
      width          : 120,
      autosize       : true,
      listeners      : {
         select      : function(combobox, recode, index) {
            Ext.Ajax.request({
               url     : './memo.ered?reqCode=queryItems',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  formPanel.form.findField('memocontent_show').setValue(resultArray.memocontent);
                  selectText = resultArray.memotitle;
                  selectValue = resultArray.memoid;
               },
               params  : {
                  memoid : combobox.getValue()
               }
            });
         },
         expand      : function() {
            memoStore.load();
         },
         afterrender : function(comb) {
            // comb.setValue('3');
            // comb.setRawValue(record.data.RNAME);
            // 预加载便签内容
            // selectIndexFirst();
         }
      }
   });

   var memotitle_text = new Ext.form.TextField({
      border     : false,
      hidden     : true,
      name       : 'memotitle',
      width      : 120,
      maxLength  : 20,
      allowBlank : false
   });

   // 表格工具栏
   var tbar = new Ext.Toolbar({
      items : ['切换标题：', memotitle_combo, memotitle_text, {
         id      : 'memoAddBtn',
         iconCls : 'page_addIcon',
         tooltip : '<span style="font-size:12px">添加</span>',
         handler : function() {
            doAdd();
         }
      }, {
         id      : 'memoEditBtn',
         iconCls : 'page_editIcon',
         tooltip : '<span style="font-size:12px">编辑</span>',
         handler : function() {
            doEdit();
         }
      }, {
         id      : 'memoDelBtn',
         iconCls : 'page_delIcon',
         tooltip : '<span style="font-size:12px">删除</span>',
         handler : function() {
            doDel();
         }
      }, {
         id      : 'memoSaveBtn',
         iconCls : 'acceptIcon',
         tooltip : '<span style="font-size:12px">保存</span>',
         hidden  : true,
         handler : function() {
            doSave();
         }
      }, {
         id      : 'memoCannelBtn',
         iconCls : 'deleteIcon',
         tooltip : '<span style="font-size:12px">取消</span>',
         hidden  : true,
         handler : function() {
            doCannel();
         }
      }]
   });

   var cmpPanel = Ext.get("portal_first_p");
   var formPanel = new Ext.form.FormPanel({
      applyTo : 'CRCFromTable',
      region  : 'center',
      border  : false,
      tbar    : tbar,
      frame   : false,
      border  : false,
      items   : [{
         bodyStyle : 'padding:5 5 5 5',
         layout    : 'fit',
         border    : false,
         items     : [{
            name        : 'memocontent_show',
            xtype       : 'textarea',
            fieldClass  : 'x-custom-field-disabled',
            disabled    : true,
            boxMaxWidth : cmpPanel.getComputedWidth() - 10,
            height      : cmpPanel.getComputedHeight() - 35,
            maxLength   : 1000
         }]
      }, {
         bodyStyle : 'padding:5 0 0 5',
         layout    : 'fit',
         border    : false,
         items     : [{
            name       : 'memocontent',
            xtype      : 'textarea',
            hidden     : true,
            allowBlank : false,
            width      : cmpPanel.getComputedWidth() - 10,
            height     : cmpPanel.getComputedHeight() - 55,
            maxLength  : 1000
         }]
      }, {
         xtype  : 'textfield',
         hidden : true,
         name   : 'memoid'
      }]
   });

   function isshowSaveBtn(flag) {
      if (flag == '1') {
         Ext.getCmp('memoAddBtn').hide();
         Ext.getCmp('memoDelBtn').hide();
         Ext.getCmp('memoEditBtn').hide();
         memotitle_combo.hide();
         formPanel.form.findField('memocontent_show').hide();
         memotitle_text.show();
         Ext.getCmp('memoSaveBtn').show();
         Ext.getCmp('memoCannelBtn').show();
         formPanel.form.findField('memocontent').show();

      }
      else if (flag == '0') {
         Ext.getCmp('memoAddBtn').show();
         Ext.getCmp('memoDelBtn').show();
         Ext.getCmp('memoEditBtn').show();
         memotitle_combo.show();
         formPanel.form.findField('memocontent_show').show();
         memotitle_text.hide();
         Ext.getCmp('memoSaveBtn').hide();
         Ext.getCmp('memoCannelBtn').hide();
         formPanel.form.findField('memocontent').hide();

      }
   };

   function setShowValue() {
      var strContent = formPanel.form.findField('memocontent').getValue();
      formPanel.form.findField('memocontent_show').setValue(strContent);
      memotitle_combo.setValue(memotitle_text.getValue());
   };

   function resetShowValue() {
      formPanel.form.findField('memocontent_show').setValue('');
      memotitle_combo.setValue('');
   };

   function doAdd() {
      isshowSaveBtn('1');
      memotitle_text.setValue('');
      formPanel.form.setValues({
         'memotitle'   : '',
         'memocontent' : '',
         'memoid'      : ''
      });
   };

   function doSave() {
      isshowSaveBtn('1');
      if (!formPanel.form.isValid() || !memotitle_text.isValid()) {
         return false;
      }
      Ext.Msg.confirm('请确认', '您确定要保存吗？', function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            var url = './memo.ered?reqCode=insertItem';
            var memoid = formPanel.form.findField('memoid').getValue();
            if (memoid != '') {
               url = './memo.ered?reqCode=updateItem';
            }
            formPanel.form.submit({
               url       : url,
               waitTitle : '提示',
               method    : 'POST',
               waitMsg   : '正在处理数据,请稍候...',
               success   : function(form, action) {
                  Ext.MessageBox.alert('提示', action.result.msg);
                  isshowSaveBtn('0');
                  selectValue = action.result.memoid;
                  selectText = action.result.memotitle;
                  setShowValue();
                  // selectIndexFirst();
               },
               failure   : function(form, action) {
                  var msg = action.result.msg;
                  Ext.MessageBox.alert('提示', msg);
               },
               params    : {
                  memotitle : memotitle_text.getValue()
               }
            });
         }
      });
   };

   function doEdit() {
      if (selectValue == '') {
         Ext.Msg.alert('提示', '请选择需要修改的便签！');
         return false;
      }
      isshowSaveBtn('1');
      memotitle_text.setValue(selectText);
      var strContent = formPanel.form.findField('memocontent_show').getValue();
      formPanel.form.setValues({
         'memocontent' : strContent,
         'memoid'      : selectValue
      });
   }

   function doDel() {
      if (selectValue == '') {
         Ext.Msg.alert('提示', '请选择需要修改的便签！');
         return false;
      }
      Ext.Msg.confirm('请确认', '删除的便签不可恢复，您确定要删除[' + selectText + ']吗？', function(btn, text) {
         if (btn == 'yes') {
            showWaitMsg();
            Ext.Ajax.request({
               url     : './memo.ered?reqCode=deleteItem',
               success : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  resetShowValue();
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               failure : function(response) {
                  var resultArray = Ext.util.JSON.decode(response.responseText);
                  Ext.Msg.alert('提示', resultArray.msg);
               },
               params  : {
                  'memoid' : selectValue
               }
            });
         }
      });
   };

   function doCannel() {
      isshowSaveBtn('0');
   };

   function selectIndexFirst() {
      memoStore.load({
         callback : function(r, options, success) {
            if (success == false) {
               Ext.Msg.alert("ERROR", "便签加载失败！");
            }
            else {
               if (memoStore.getTotalCount() > 0) {
                  memotitle_combo.selectByValue('5', true);
               }
            }
         }
      });
   };

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [formPanel]
   });
});