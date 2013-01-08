var $j = jQuery.noConflict();

$j('#btn_submit').unbind('click').bind('click', function() {
   if (!$j("#isoper").attr('checked')) {
      Ext.Msg.alert('提示', '请在操作栏上勾选允许操作！');
      return false;
   }
   if (!validatClickSel()) {
      Ext.Msg.alert('提示', '请选择需要设置的监控量参数！');
      return false;
   }
   if (!valid.validate()) {
      Ext.Msg.alert('提示', '参数设置有误，请注意红色边框的设置项！');
      return false;
   }
   Ext.Ajax.request({
      url     : './saveRepeater.ered?reqCode=updateVal1Item1',
      params  : {
         dirtydata : packageChangeValue(),
         datetime  : new Date().getTime()
      }
   });
   Ext.Ajax.request({
      url     : './repeaterInforamtion1.ered?reqCode=queryConnFlag',
      success : function(response) {
         var json = Ext.decode(response.responseText);
         if (json.connectflag == '2') {
            Ext.Msg.alert("", "站点不在线，请稍后再试！");
         }
         else if (json.connectflag == '0') {
            Ext.Msg.alert("", "当前有人正在操作该站点，请稍后重试！");
         }
         else {
            Ext.Ajax.request({
               url    : './saveRepeater.ered?reqCode=sendCommondReturn1',
               params : {
                  repeaterid : repeaterid_,
                  pcmd       : '03',
                  paramcode  : packageCodeForQuery(),
                  value      : packageValueForQuery()
               }
            });
         }
      },
      params  : {
         repeaterid : repeaterid_
      }

   });
});

$j('#btn_query').unbind('click').bind('click', function() {
   if (!$j("#isoper").attr('checked')) {
      Ext.Msg.alert('提示', '请在操作栏上勾选允许操作！');
      return false;
   }
   Ext.Ajax.request({// 判断站点是否连接成功
      url     : './repeaterInforamtion1.ered?reqCode=queryConnFlag',
      success : function(response) {
         var json = Ext.decode(response.responseText);
         if (json.connectflag == '2') {// 未连接
            Ext.Msg.alert("", "站点不在线，请稍后再试！");
         }
         else if (json.connectflag == '0') {
            Ext.Msg.alert("", "当前有人正在操作该站点，请稍后重试！");
         }
         else {// 连接成功
            Ext.Ajax.request({
               url    : './repeaterInforamtion1.ered?reqCode=sendCommondReturn1',
               // success : function(res) {
               // var json2 = Ext.decode(res.responseText);
               // var themsg = json2.msg;
               // tempStore.reload();// 刷新页面的远程值
               // alert(themsg);
               // },
               params : {
                  repeaterid : repeaterid_,
                  pcmd       : '02',
                  paramcode  : packageCodeForQuery()
               }
            });
         }
      },
      params  : {
         repeaterid : repeaterid_
      }
   });
});

$j('#btn_save').unbind('click').bind('click', function() {
   if (!$j("#isoper").attr('checked')) {
      Ext.Msg.alert('提示', '请在操作栏上勾选允许操作！');
      return false;
   }
   if (!validatClickSel()) {
      Ext.Msg.alert('提示', '请选择需要保存的监控量参数！');
      return false;
   }
   if (!valid.validate()) {
      Ext.Msg.alert('提示', '参数设置有误，请注意红色边框的设置项！');
      return false;
   }
   Ext.Msg.confirm('请确认', '确定要保存吗？', function(btn, text) {
      if (btn == 'yes') {
         Ext.Ajax.request({
            url     : './saveRepeater.ered?reqCode=updateVal1Item1',
            params  : {
               dirtydata : packageChangeValue(),
               datetime  : new Date().getTime()
            },
            success : function(response) {
               Ext.Msg.alert('', '保存成功');
            }
         });
      }
   });
});
