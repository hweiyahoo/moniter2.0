var $j = jQuery.noConflict();

// 列表复选框
$j('#selectAll').unbind('click').bind('click', function() {
   if ($j(this).attr('checked')) {
      $j("input[name=selects]").each(function() {
         $j(this).attr("checked", "checked")
      })
   }
   else {
      $j("input[name=selects]").each(function() {
         $j(this).attr("checked", "")
      })
   }
});

// trim处理
function replaceChar(elem) {
   elem.value = elem.value.replace(/[^\d]/g, '');
}
var $j = jQuery.noConflict();

// 获取选中id
function getSelectsValue() {
   var selectedValue = {};
   return selectedValue;
};

/**
 * 为行选择复选框添加单击事件
 */
$j("input[name=selects]").click(function() {
   var $td_item = $j(this).parents('tr').find('td[id=td_item]');
   var hasEditor = $j(this).attr('hasEditor');
   if (hasEditor != "0") {
      var $editorObj = $td_item.find('[name=val1]');
      if ($j(this).attr('checked')) {
         var validatClass = $j(this).attr('validatClass');
         $editorObj.attr('class', validatClass);
      }
      else {
         $editorObj.attr('class', '');
      }
   }
});

function validatClickSel() {
   var temp = 0;
   $j("input[name=selects]").each(function(i) {
      if ($j(this).attr('checked')) {
         temp = 1;
         return;
      }
   });
   if (temp == 1) {
      return true;
   }
   else {
      return false;
   }

}

/**
 * 进行参数持久化到数据库的时候，调用此方法来比较，那些数据有变动，方法会自动过滤未修改的值。
 * 
 * @return {}
 */
function packageChangeValue() {
   var old_value, new_value, id, paramcode;
   var jsonStore = '';
   $j("input[name=selects]").each(function(i) {
      if ($j(this).attr('checked')) {
         var $td_item = $j(this).parents('tr').find('td[id=td_item]');
         old_value = $td_item.find('[name=h_val1]').val();
         if ($td_item.children().is('input[type=radio]')
             || $td_item.children().is('input[type=checkbox]')) {
            new_value = $td_item.find('[name=val1]:checked').val();
         }
         else {
            new_value = $td_item.find('[name=val1]').val();
         }
         // alert('old_value=' + old_value + '\r\n new_value=' + new_value);
         // if (old_value != new_value) {
         id = $j(this).attr('id').split('_')[1];
         paramcode = $j(this).val().split('_')[1];
         jsonStore += ',{"recid":"' + id + '",';
         jsonStore += '"paramcode":"' + paramcode + '",';
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
}

/**
 * 返回选择的参数设置的value
 * 
 * @return {}
 */
function packageValueForQuery() {
   var old_value, new_value;
   var str = '';
   $j("input[name=selects]").each(function(i) {
      if ($j(this).attr('checked')) {
         var $td_item = $j(this).parents('tr').find('td[id=td_item]');
         if ($td_item != null) {
            old_value = $td_item.find('[name=h_val1]').val();
            if ($td_item.children().is('input[type=radio]')
                || $td_item.children().is('input[type=checkbox]')) {
               new_value = $td_item.find('[name=val1]:checked').val();
            }
            else {
               new_value = $td_item.find('[name=val1]').val();
            }
            if (old_value != new_value && new_value != null) {
               str += ',' + new_value;
            }
            else {
               str += ',' + old_value;
            }
         }
      }
   });
   if (str != '') {
      str = str.substring(1);
      // alert(str);
   }
   return str;
};

/**
 * 返回选择的参数设置的code
 * 
 * @return {}
 */
function packageCodeForQuery() {
   var paramcode;
   var str = '';
   $j("input[name=selects]").each(function(i) {
      if ($j(this).attr('checked')) {
         var $td_item = $j(this).parents('tr').find('td[id=td_item]');
         if ($td_item != null) {
            paramcode = $j(this).val().split('_')[1];
            str += ',' + paramcode;
         }
      }
   });
   if (str != '') {
      str = str.substring(1);
      // alert(str);
   }
   return str;
}

/*
 * 主要判断是否开启刷新功能
 */
function validRefleshUrl(defaultUrl) {
   if (defaultUrl.indexOf('&isautoreflesh=1') != -1) { // 解决页面切换的bug
      return true;
   }
   else {
      return false;
   }
}

function refleshContentFunc() {
   var contentPanel = Ext.getCmp('contentPanel_id');
   var defaultUrl = contentPanel.getUpdater().defaultUrl;
   if (validRefleshUrl(defaultUrl)) { // 解决页面切换的bug
      contentPanel.getUpdater().refresh();
   }
}

$j('#reflesh_ckb').unbind('click').bind('click', function() {
   if ($j(this).attr('checked')) {// 开启自动刷新功能
      isautoreflesh = "-1"
      var temp_inval = $j('#invaltime').val();
      if (!isNaN(parseInt(temp_inval))) {
         invaltime = parseInt(temp_inval);
      }
      $j("#time_div").CRcountDown({
         startNumber : invaltime,
         callBack    : refleshContentFuncToTimer
      }).css("color", "red");
   }
   else {// 关闭自动刷新功能
      $j("#time_div").pause();
   }
});

function refleshContentFuncToTimer() {
   var contentPanel = Ext.getCmp('contentPanel_id');
   var defaultUrl = contentPanel.getUpdater().defaultUrl;
   if (isautoreflesh == "1") { // 进入重复刷新功能
      var end = defaultUrl.indexOf("&isautoreflesh=1");
      if (end != -1) {
         defaultUrl = defaultUrl.substring(0, end);
         defaultUrl += "&isautoreflesh=1&invaltime=" + invaltime;
         contentPanel.getUpdater().setDefaultUrl(defaultUrl);
      }
   }
   else if (isautoreflesh == "-1") { // 第一次开启自动刷新功能，要添加刷新标识和间隔参数
      defaultUrl += "&isautoreflesh=1&invaltime=" + invaltime;
      contentPanel.getUpdater().setDefaultUrl(defaultUrl);
   }
   refleshContentFunc();
};

if (isautoreflesh == "1") {
   $j("#time_div").CRcountDown({
      startNumber : invaltime,
      callBack    : refleshContentFuncToTimer
   }).css("color", "red");
}

var valid = new Validation('form', {
   immediate    : true,
   focusOnError : true
});
