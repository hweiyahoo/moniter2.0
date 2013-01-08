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
   Ext.Ajax.request({
      url    : './saveRepeater.ered?reqCode=updateVal1Item',
      params : {
         dirtydata : packageChangeValueForStatue(),
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
               url    : './saveRepeater.ered?reqCode=sendCommondReturn',
               params : {
                  repeaterid : repeaterid_,
                  pcmd       : '03',
                  dirtydata  : packageChangeValueForStatue()
               }
            });
         }
      },
      failure : function(response) {
         var resultArray = Ext.util.JSON.decode(response.responseText);
         Ext.Msg.alert('提示', resultArray.msg);
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
            // var queryWindow = openConnection.createWindow();
            // queryWindow.show();
            Ext.Msg.alert("", "站点不在线，请稍后再试！");
         }
         else if (json.connectflag == '0') {
            Ext.Msg.alert("", "当前有人正在操作该站点，请稍后重试！");
         }
         else {// 连接成功
            Ext.Ajax.request({
               url    : './repeaterInforamtion1.ered?reqCode=sendCommondReturn',
               // success : function(res) {
               // var json2 = Ext.decode(res.responseText);
               // var themsg = json2.msg;
               // tempStore.reload();// 刷新页面的远程值
               // alert(themsg);
               // },
               params : {
                  repeaterid : repeaterid_,
                  pcmd       : '02',
                  dirtydata  : packageValueForQueryForStatue()
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
   // if (!valid.validate()) return false;
   Ext.Msg.confirm('请确认', '确定要保存吗？', function(btn, text) {
      if (btn == 'yes') {
         Ext.Ajax.request({
            url     : './saveRepeater.ered?reqCode=updateVal1Item',
            params  : {
               dirtydata : packageChangeValueForStatue(),
               datetime  : new Date().getTime()
            },
            success : function(response) {
               Ext.Msg.alert('', '保存成功');
            }
         });
      }
   });
});

function packageChangeValueForStatue() {
   var old_value, new_value, id, id_able, paramcode, paramcode_able;
   var jsonStore = '';
   $j("input[name=selects]").each(function(i) {
      if ($j(this).attr('checked')) {
         var $td_item = $j(this).parents('tr').find('td[id=td_item]');
         old_value = $td_item.find('[name=h_val1]').val();
         var $checkedItem = $td_item.find('[type=radio]:checked');
         new_value = $checkedItem.val();
         // alert('old_value=' + old_value + '\r\n new_value=' + new_value);
         // if (old_value != new_value) {
         id = $j(this).attr('id').split('_')[1];
         paramcode = $j(this).val().split('_')[1];
         id_able = $checkedItem.attr('id').split('_')[1];
         paramcode_able = $checkedItem.attr('id').split('_')[2];
         jsonStore += ',{"recid":"' + id + '",';
         jsonStore += '"paramcode":"' + paramcode + '",';
         jsonStore += '"recid_able":"' + id_able + '",';
         jsonStore += '"paramcode_able":"' + paramcode_able + '",';
         jsonStore += '"val1":"' + new_value + '"}';
         // }
      }
   });
   if (jsonStore != '') {
      jsonStore = jsonStore.substring(1);
      jsonStore = '[' + jsonStore + ']';
      // alert(jsonStore);
   }
   return jsonStore;
};

function packageValueForQueryForStatue() {
   var id, id_able, paramcode, paramcode_able;
   var jsonStore = '';
   $j("input[name=selects]").each(function(i) {
      if ($j(this).attr('checked')) {
         var $td_item = $j(this).parents('tr').find('td[id=td_item]');
         var $checkedItem = $td_item.find('[type=radio]:checked');
         id = $j(this).attr('id').split('_')[1];
         paramcode = $j(this).val().split('_')[1];
         id_able = $checkedItem.attr('id').split('_')[1];
         paramcode_able = $checkedItem.attr('id').split('_')[2];
         jsonStore += ',{"recid":"' + id + '",';
         jsonStore += '"paramcode":"' + paramcode + '",';
         jsonStore += '"recid_able":"' + id_able + '",';
         jsonStore += '"paramcode_able":"' + paramcode_able + '"}';
      }
   });
   if (jsonStore != '') {
      jsonStore = jsonStore.substring(1);
      jsonStore = '[' + jsonStore + ']';
   }
   return jsonStore;
};
