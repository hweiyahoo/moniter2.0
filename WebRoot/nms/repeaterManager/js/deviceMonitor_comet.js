/**
 * 刷新参数设置面板 for lxy
 * 
 * @param {}
 *           reqCode
 */
function refleshContentCall(reqCode) {
   var selectRepeaterWindow = Ext.getCmp('selectRepeaterWindow');

   if (selectRepeaterWindow != null && selectRepeaterWindow.isVisible) {
      var contentPanel = Ext.getCmp('contentPanel_id');
      if (contentPanel != null) {
         var defaultUrl = contentPanel.getUpdater().defaultUrl;
         // alert(reqCode);
         // alert(defaultUrl);
         // alert(defaultUrl.indexOf(reqCode));
         if (defaultUrl != null && defaultUrl.indexOf(reqCode) != -1) {
            contentPanel.getUpdater().refresh();
         }
      }
   }
};

/**
 * 刷新设备监控树节点 for lxy
 * 
 * @param {}
 *           nodeid
 */
function refreshNodeCall(nodeid) {
   var node;
   var menuTree = Ext.getCmp('tree');
   menuTree.getRootNode().expand();
   menuTree.getRootNode().cascade(function(n) {
      if (n.attributes.id.indexOf(nodeid) != -1) {
         node = n;
         return false;
      }
   });
   if (Ext.isEmpty(node)) {
      menuTree.root.reload();
      return;
   }
   else {
      node.parentNode.reload();
   }
   // if (node.attributes.leaf) {
   // node.parentNode.reload();
   // }
   // else {
   // node.reload();
   // }
};

/**
 * 刷新设备监控参数列表 for lxy
 * 
 * @param {}
 *           repeaterId
 */
function refreshMonitorParamList(repeaterId) {
   var monitorParamWinodw = Ext.getCmp('monitorParamWinodw');
   if (monitorParamWinodw != null && monitorParamWinodw.isVisible) {
      var nodeId = formatNodeId(Ext.getCmp('tree').getSelectionModel().getSelectedNode().id);
      if (repeaterId == nodeId.id) {
         exitStore.load({
            params : {
               repeaterid : repeaterId,
               start      : 0,
               limit      : 10000
            }
         });
         noexitStore.load({
            params : {
               repeaterid : repeaterId,
               start      : 0,
               limit      : 10000
            }
         });
         Ext.Msg.alert('提示', '读取完毕！');
      }
   }
};

/**
 * 刷新监控面板参数 for xjm
 * 
 * @param {}
 *           vstationid
 * @param {}
 *           vstatsubid
 * @param {}
 *           vtel
 * @param {}
 *           stationid
 * @param {}
 *           statsubid
 */
function refreshMonitorBoardParam(vstationid, vstatsubid, vtel, stationid, statsubid) {
   // vstationid, vstatsubid, vtel, comm_seq, stationid, statsubid
   var initMonitorboardWindow = Ext.getCmp('initMonitorboardWindow');
   if (initMonitorboardWindow != null && initMonitorboardWindow.isVisible) {
      var stationid_ = Ext.getCmp('monitorboardForm').form.findField('stationid').getValue();
      var statsubid_ = Ext.getCmp('monitorboardForm').form.findField('statsubid').getValue();
      var ispass = Ext.getCmp('monitorboardForm').form.findField('ispass').getValue();
      if (ispass == "true") {
         if (stationid_ == stationid && statsubid == statsubid_) {
            Ext.getCmp('monitorboardForm').form.findField('stationidquery').setValue(vstationid);
            Ext.getCmp('monitorboardForm').form.findField('statsubidquery').setValue(vstatsubid);
            Ext.getCmp('monitorboardForm').form.findField('repeatertelquery').setValue(vtel);
            Ext.StoreMgr.get('stationItemsForManagStore').reload();
         }
      }
   }
};

/**
 * 格式化监控设备树节点id。返回相应地市信息 for hw
 * 
 * @param {}
 *           deptid
 * @return {}
 */
function formatDMDeptId(deptid) {
   var dmdeptid = {};
   var province, city;
   deptid = deptid.substring(6, deptid.length); // 定位到有效位置
   if (deptid.length >= 3) {
      province = deptid.substring(0, 3);
   }
   if (deptid.length >= 6) {
      city = deptid.substring(3, 3);
   }
   dmdeptid.province = parseInt(province, 10);
   dmdeptid.city = parseInt(city, 10);
   return dmdeptid;
};

/**
 * 更新设备更新日志面板内容 for mlb
 * 
 * @param {}
 *           msg
 * @return {}
 */
function updateLogPanel(stationid_, statsubid_, msg) {
   var node = Ext.getCmp('tree').getSelectionModel().getSelectedNode();
   var nodeId = formatNodeId(node.id);
   var stationid = nodeId.stationid;
   var statsubid = node.attributes.statsubid;
   var updateDeviceWindow = Ext.getCmp('updateDeviceWindow');
   if (updateDeviceWindow != null && updateDeviceWindow.isVisible) {
      if (stationid_ == stationid && statsubid == statsubid_) {
         Ext.getCmp('updatelogConsole').log(msg);
      }
   }
};

/**
 * 
 * @param {}
 *           msg
 */
function debugLogPanel(logtype, heartAlarm, datetime, nodeid, msg) {
   var node;
   var menuTree = Ext.getCmp('tree');
   menuTree.getRootNode().expand();
   menuTree.getRootNode().cascade(function(n) {
      if (n.attributes.id.indexOf(nodeid) != -1) {
         // alert(n.attributes.text);
         node = n;
         return false;
      }
   });
   if (node != null) {
      var stationname = node.attributes.text;
      msg = datetime + '[' + stationname + ']' + msg;
      var showAlarm = Ext.getCmp('showAlarm');
      var showHeart = Ext.getCmp('showHeart');
      if (heartAlarm == '0') {// 显式普通交互报文数据
         Ext.getCmp('debuglogConsole').log(logtype, msg);
      }
      else if (showHeart.checked && heartAlarm == '1') {// 显式心跳包报文数据
         Ext.getCmp('debuglogConsole').log(logtype, msg);
      }
      else if (showAlarm.checked && heartAlarm == '2') {// 显式告警报文数据
         Ext.getCmp('debuglogConsole').log(logtype, msg);
      }
   }
};

/**
 * 推送握手
 */
function init() {
   dwr.engine.setActiveReverseAjax(true);
   DMParamPush.handshake();
};
window.onload = init;
