<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="设备监控" uxEnabled="true" isSubPage="true">
<eRedG4:import src="/nms/repeaterManager/js/nms.store.js"/>
<eRedG4:import src="/nms/repeaterManager/js/nms.siteTree.js"/>
<eRedG4:import src="/nms/repeaterManager/js/nms.onTabPanel.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/newRepeater.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/setRepeaterID.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/monitorParamList.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/initMonitorboard.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/modStationWindow.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/setReporting.js"/>
<eRedG4:import src="/nms/repeaterManager/js/treeRightClickMenu/openConnection.js"/>
<eRedG4:import src="/nms/repeaterManager/js/treeRightClickMenu/addSubMachine.js"/>
<eRedG4:import src="/resource/myux/logpanel.js"/>
<eRedG4:import src="/nms/repeaterManager/js/treeRightClickMenu/updatedevicefileMain.js"/>
<eRedG4:import src="/nms/util/complete.js"/>
<eRedG4:ext.comboxStore name="protocol"/>
<eRedG4:ext.comboxStore name="site" paramName="flag,type" paramValue="0,1"/>
<eRedG4:ext.comboxStore name="devicetype" storeName="devicetype"/>
<eRedG4:ext.comboxStore name="basetable" storeName="connType" paramName="type" paramValue="30"/>
<eRedG4:import src="/nms/repeaterManager/js/deviceMonitor.js"/>
<eRedG4:import src="/dwr/interface/DMParamPush.js" />
<eRedG4:import src="/dwr/engine.js" />
<eRedG4:import src="/dwr/util.js" />
<eRedG4:import src="/nms/repeaterManager/js/deviceMonitor_comet.js" />
<eRedG4:script>
   var root_menuname = 'test';
   var user_dept_province = '${params.province}';
   var user_dept_city = '${params.city}';
</eRedG4:script>
<eRedG4:body>
<eRedG4:div key="menuTreeDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>
<eRedG4:import src="/resource/rapid-validation/src/prototype_for_validation.js" />
<eRedG4:import src="/resource/rapid-validation/lib/tooltips.js" />
<eRedG4:import src="/resource/rapid-validation/src/validation_cn_utf-8.js" />
<eRedG4:import src="/resource/rapid-validation/styles/style_min.css" />
<eRedG4:import src="/resource/rapid-validation/styles/tooltips.css" />