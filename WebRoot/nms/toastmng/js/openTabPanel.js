/**
 * 显式告警信息
 */
function showAlarmTabPanel(repeaterid, flag, alarmtype) {
   var treeNode, url, name, menuid, pathCh, icon;
   url =
         'alarmLog.ered?reqCode=init&repeaterid=' + repeaterid + '&flag=' + flag + '&alarmtype='
            + alarmtype;
   name = '告警日志';
   menuid = '01020105';
   pathCh = '监控平台 -> 监控管理 -> 告警日志 -> 日志处理';
   icon = 'tab_blank.png ';

   var mainTabs = Ext.getCmp('mainTabs');
   var id = "tab_id_" + menuid;
   var n = mainTabs.getComponent(id);
   if (n) {
      mainTabs.remove(n);
   }
   addTab(url, name, menuid, pathCh, icon);
   mainTabs.setActiveTab(n);
}

/**
 * 跳转到公告/短信界面
 */
function showNoticeTabPanel() {
   var treeNode, url, name, menuid, pathCh, icon;
   url = 'receive.ered?reqCode=init';
   name = '公告/短信阅读';
   menuid = '010503';
   pathCh = '监控平台 -> 个人事务 -> 公告/短信阅读';
   icon = 'tab_blank.png ';

   var mainTabs = Ext.getCmp('mainTabs');
   var id = "tab_id_" + menuid;
   var n = mainTabs.getComponent(id);
   if (n) {
      mainTabs.remove(n);
   }
   addTab(url, name, menuid, pathCh, icon);
   mainTabs.setActiveTab(n);
}
