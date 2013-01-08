var $j = jQuery.noConflict();
$j('#alarmDetail').unbind('click').bind('click', function() {
   showAlarmTabPanel('','1');
   closeMsgBox();
});

$j('#noticeDetail').unbind('click').bind('click', function() {
   showNoticeTabPanel();
   closeMsgBox();
});

$j('#smsDetail').unbind('click').bind('click', function() {
   showNoticeTabPanel();
   closeMsgBox();
});

function closeMsgBox() {
   Ext.getCmp('msgboxShowWindow').close();
}
