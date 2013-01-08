
/**
 * 地图操作方法 auth: huangwei
 */
function initMap() {
   var point = maplet.getCenter();
   // Ext.getCmp('pointLon').setValue(point.lon);
   // Ext.getCmp('pointLat').setValue(point.lat);
   // Ext.getCmp('pid').setValue(maplet.getCenter().pid);
   // Ext.getCmp('le').setValue(maplet.getZoomLevel());
   Ext.getCmp('paramInfoPanel').form.setValues({
      'pointLon' : point.lon,
      'pointLat' : point.lat,
      'le'       : maplet.getZoomLevel()
   });
};

/**
 * 获取鼠标单击点地图经纬度
 */
function getClickPointJWD(event, point) {
   // var center = maplet.getCenter();
   // Ext.getCmp('pointLon').setValue(point.lon);
   // Ext.getCmp('pointLat').setValue(point.lat);
   // Ext.getCmp('pid').setValue(point.pid);
   // Ext.getCmp('le').setValue(maplet.getZoomLevel());
   // setFormValue
   Ext.getCmp('paramInfoPanel').form.setValues({
      'pointLon' : point.lon,
      'pointLat' : point.lat,
      'le'       : maplet.getZoomLevel()
   });
};

function goProvince(pid, le) {
   maplet.centerAndZoom(new MPoint(pid), le);
};

function goCity(pid, le) {
   maplet.centerAndZoom(new MPoint(pid), le);
};

function goStation(pid, le) {
   maplet.centerAndZoom(new MPoint(pid), le);
};

function goInitArea() {
   maplet.centerAndZoom(new MPoint(initPoint), le);
};

var selectNode = null;
var selectMarker = null;
function setMapPointJWD() {
   selectNode = menuTree.getSelectionModel().getSelectedNode();
   if (selectNode != null && selectNode.id.indexOf("station") == -1) {
      Ext.Msg.alert('提示', '请在左边树中选择需要设置站点位子的节点！');
      return false;
   }
   Ext.getCmp('stationPoint_cancelbtn').enable();
   Ext.getCmp('stationPoint_savebtn').enable();
   Ext.getCmp('stationPoint_setbtn').disable();
   Ext.getCmp('currentStation').setValue(selectNode.text);
   Ext.getDom('saveStatuTip').style.display = "block";

   var station_pid = selectNode.attributes.pid;
   var station_le = selectNode.attributes.le;
   station_le = station_le == null ? 11 : station_le;
   if (selectNode.attributes.pid == '') {
      updateModel = "new";
      createNewStationPoint();
   }
   else {
      goStation(station_pid, station_le);
      var repeaterid = selectNode.attributes.id.split("_")[3];
      selectMarker = eval("marker_" + repeaterid);
      updateIconPosition(selectMarker, true);
      selectMarker.setEditable(true);
   }
};

function doCancelBtnHandle() {
   Ext.getCmp('stationPoint_cancelbtn').disable();
   Ext.getCmp('stationPoint_savebtn').disable();
   Ext.getCmp('stationPoint_setbtn').enable();
   Ext.getCmp('currentStation').setValue("");
   Ext.getDom('saveStatuTip').style.display = "none";

   var station_pid = selectNode.attributes.pid;
   var station_le = selectNode.attributes.le;
   station_le = station_le == null ? 11 : station_le;

   if (selectNode.attributes.pid == '') {
      selectMarker.bEditable = true;
      selectMarker.dragAnimation = true;
      maplet.removeOverlay(selectMarker);
      maplet.setMode("pan"); // 设定地图为拖动(正常)状态
      MEvent.removeListener(myEventListener);// 注销事件
      myEventListener = MEvent.bind(maplet, "click", this, getClickPointJWD);
      // location.reload();
   }
   else {
      goStation(station_pid, station_le);
      updateIconPosition(selectMarker, false);
      selectMarker.setEditable(false);
   }
   updateModel = null;
   selectMarker = null;
};

function doSaveBtnHandle() {
   if (selectMarker == null || selectNode == null) {
      Ext.Msg.alert('提示', '选择数据过期，请重新选择需要设置的站点!');
      return false;
   }
   var x = selectMarker.pt.lon;
   var y = selectMarker.pt.lat;
   var le = maplet.getZoomLevel();
   var repeaterid = selectNode.attributes.id.split("_")[3];
   var tipContent =
                    "当前坐标点<font color='red'><br>经度:" + x + "<br>维度:" + y + "<br>缩放级别:" + le
                       + "</font>";
   Ext.Msg.confirm('请确认', tipContent + '<br>您确定要保存吗？', function(btn, text) {
      if (btn == 'yes') {
         showWaitMsg();
         Ext.Ajax.request({
            url     : './map.ered?reqCode=saveStationPointInfo',
            success : function(response) {
               var resultArray = Ext.util.JSON.decode(response.responseText);
               // location.reload();

               Ext.getCmp('paramInfoPanel').form.setValues({
                  'pointLon' : x,
                  'pointLat' : y,
                  'le'       : le
               });

               Ext.Msg.alert('提示', resultArray.msg);
               if (updateModel == "new") {
                  location.reload();
               }
               else {
                  doCancelBtnHandle();
               }
               selectNode.parentNode.reload(function(r, options, success) {
                  if (success == false) {
                     Ext.Msg.alert("ERROR", "There was an error parsing the Country Combo.");
                  }
                  else {
                     positionTreeNode();
                  }
               });
            },
            failure : function(response) {
               var resultArray = Ext.util.JSON.decode(response.responseText);
               Ext.Msg.alert('提示', resultArray.msg);
               selectMarker = null;
            },
            params  : {
               repeaterid : repeaterid,
               x          : x,
               y          : y,
               le         : le
            }
         });
      }
   });
};

function updateIconPosition(markerObj, isEditMode) {
   var pic = "mark.gif";
   if (isEditMode) {
      pic = "mark2.gif";
   }
   markerObj.icon.updateImage("./resource/image/nms/" + pic);
};

function positionTreeNode() {
   menuTree.getRootNode().cascade(function(n) {
      var id = n.attributes.id;
      if (n.id == selectNode.id) {
         menuTree.getSelectionModel().select(n, Ext.EventObject, true);
         return false;
      }
   });
};

function setCursorStyle() {
   maplet.setCursorStyle("default", "./resource/image/nms/mark3.gif");
   // maplet.setCursorStyle("pointer", "./resource/image/nms/mark3.gif");
   // maplet.setCursorStyle("move", "./resource/image/nms/mark3.gif");
   // maplet.setCursorStyle("crosshair", "./resource/image/nms/mark3.gif");
}

function resetCursorStyle() {
   maplet.setCursorStyle("default", "");
   maplet.setCursorStyle("pointer", "");
   maplet.setCursorStyle("move", "");
   maplet.setCursorStyle("crosshair", "");
}

function createNewStationPoint() {
   MEvent.removeListener(myEventListener);// 注销事件
   myEventListener = MEvent.bind(maplet, "click", this, addStationPoint); // 注册click事件句柄
   // maplet.setMode("bookmark");// 设定为添加标记模式
   // maplet.setCursorIcon("./resource/image/nms/mark3.gif"); // 添加鼠标跟随标签
   setCursorStyle();

};

function addStationPoint(event, point) {
   selectMarker =
                  new MMarker(
                              point, // 坐标
                              new MIcon("./resource/image/nms/mark2.gif", 24, 24), null,
                              new MLabel(Ext.getCmp('currentStation').getValue())// 小标签
                  );
   selectMarker.bEditable = true;
   selectMarker.dragAnimation = true;
   maplet.addOverlay(selectMarker);// 添加标注
   selectMarker.setEditable(true); // 设定标注编辑状态
   maplet.setMode("pan"); // 设定地图为拖动(正常)状态
   resetCursorStyle();
   // le = maplet.getZoomLevel(); // 获取当前缩放级别
   MEvent.removeListener(myEventListener);// 注销事件
   myEventListener = MEvent.bind(maplet, "click", this, getClickPointJWD);
};