/**
 * CRC计算工具
 * 
 * @author 杨智铮,bug modify by huangwei
 * @since 2011-09-13
 */
Ext.onReady(function() {
   /**
    * 计算CRC按钮
    */
   var calculateCRCButton = new Ext.Button({
      text     : '计算CRC值',
      // autoShow : true,
      id       : 'calculateCRCButton',
      disabled : false,
      width    : 60,
      handler  : function() {
         var CRCString = CRCFromPanel.getForm().findField('dataString').getValue();
         Ext.Ajax.request({
            url     : './CRCUtil.ered?reqCode=calculateCRC',
            success : function(response) {
               var resultArray = Ext.util.JSON.decode(response.responseText);
               var CRCOrder = resultArray.CRCOrder;
               var CRCInvertOrder = resultArray.CRCInvertOrder;
               CRCFromPanel.getForm().findField('CRCOrder').setValue(CRCOrder);
               CRCFromPanel.getForm().findField('CRCInvertOrder').setValue(CRCInvertOrder);
            },
            params  : {
               CRCString : CRCString
            }
         });
      }
   });
   /**
    * 字符串转换成ASCII按钮
    */
   var transformToAsciiButton = new Ext.Button({
      text     : '转换成ASCII ->>>',
      autoShow : true,
      id       : 'transformToAsciiButton',
      disabled : false,
      width    : 60,
      handler  : function() {
         if (!StringFromPanel.form.isValid()) {
            return;
         }
         var i;
         var stringText = StringFromPanel.getForm().findField('stringText').getValue();
         var transformToAsciiString = "";
         var code, hexCode;
         for (i = 0; i < stringText.length; i++) {
            code = stringText.charCodeAt(i);
            hexCode = code.toString(16);
            transformToAsciiString = transformToAsciiString + hexCode;
         }
         StringFromPanel.getForm().findField('asciiText').setValue(transformToAsciiString);
      }
   });

   /**
    * ASCII转换成字符串按钮
    */
   var transformToStringButton = new Ext.Button({
      text     : '<<<- 转换成字符串',
      autoShow : true,
      id       : 'transformToStringButton',
      disabled : false,
      width    : 60,
      handler  : function() {
         if (!StringFromPanel.form.isValid()) {
            return;
         }
         var asciiText = StringFromPanel.getForm().findField('asciiText').getValue();
         Ext.Ajax.request({
            url     : './CRCUtil.ered?reqCode=transformToString',
            success : function(response) {
               var resultArray = Ext.util.JSON.decode(response.responseText);
               var transformString = resultArray.transformString;
               StringFromPanel.getForm().findField('stringText').setValue(transformString);
            },
            params  : {
               asciiText : asciiText
            }
         });
      }
   });
   /**
    * CRC计算
    */
   CRCFromPanel = new Ext.form.FormPanel({
      region     : 'north',
      labelAlign : 'right',
      title      : 'CRC计算',
      height     : 240,
      labelWidth : 60,
      frame      : true,
      id         : 'CRCFromTable',
      name       : 'CRCFromTable',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            labelWidth  : 300, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel : '数据串(注意:计算范围从第一个字符到最后一个字符)',
               anchor     : '100%'
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .60,
            layout      : 'form',
            labelWidth  : 10, // 标签宽度
            border      : false,
            items       : [{
               xtype  : 'textarea',
               name   : 'dataString',
               id     : 'dataString',
               anchor : '100%'
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : 1,
            layout      : 'form',
            labelAlign  : 'center',
            defaultType : 'textfield',
            border      : false,
            items       : [calculateCRCButton]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .60,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : 'CRC正序值', // 标签
               anchor     : '100%',
               id         : 'CRCOrder',
               name       : 'CRCOrder',
               fieldClass : 'x-custom-field-disabled',
               disabled   : true
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .60,
            layout      : 'form',
            labelWidth  : 80, // 标签宽度
            defaultType : 'textfield',
            border      : false,
            items       : [{
               fieldLabel : 'CRC倒序值', // 标签
               anchor     : '100%',
               id         : 'CRCInvertOrder',
               name       : 'CRCInvertOrder',
               fieldClass : 'x-custom-field-disabled',
               disabled   : true
            }]
         }]
      }]
   });
   /**
    * 字符串与ASCII码转换
    */
   StringFromPanel = new Ext.form.FormPanel({
      // renderTo : 'CRCFromTable',
      region     : 'center',
      labelAlign : 'right',
      title      : 'ASCII码与字符串之间的相互转换',
      labelWidth : 60,
      frame      : true,
      id         : 'StringFromTable',
      name       : 'StringFromTable',
      items      : [{
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel : '字符串', // 标签
               anchor     : '100%'
            }]
         }, {
            columnWidth : .2, 
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel : '操作', // 标签
               anchor     : '100%'
            }]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 60, // 标签宽度
            border      : false,
            items       : [{
               fieldLabel : 'ASCII码', // 标签
               anchor     : '100%'
            }]
         }]
      }, {
         layout : 'column',
         border : false,
         items  : [{
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 10, // 标签宽度
            border      : false,
            items       : [{
               xtype     : 'textarea',
               name      : 'stringText',
               id        : 'stringText',
               anchor    : '92%', 
               vtype     : 'alphanum',
               vtypeText : '请输入英文字母或者数字'
            }]
         }, {
            columnWidth : .2,
            layout      : 'form',
            labelWidth  : 10, // 标签宽度
            border      : false,
            items       : [transformToAsciiButton, transformToStringButton]
         }, {
            columnWidth : .33,
            layout      : 'form',
            labelWidth  : 10, // 标签宽度
            border      : false,
            items       : [{
               xtype     : 'textarea',
               name      : 'asciiText',
               id        : 'asciiText',
               anchor    : '92%',
               vtype     : 'alphanum',
               vtypeText : '请输入英文字母或者数字'
            }]
         }]
      }, {
         xtype  : 'panel',
         border : false,
         html   : '<br><div style="font-size:12px;margin-left:10px">(提示:转换目前只支持英文和数字，不支持汉字！)</div>'
      }]
   });

   /**
    * 布局
    */
   var viewport = new Ext.Viewport({
      layout : 'border',
      items  : [CRCFromPanel, StringFromPanel]
   });

});