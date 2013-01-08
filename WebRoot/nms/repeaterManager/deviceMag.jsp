<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="${sysTitle}" showLoading="false" exportParams="true">
<eRedG4:import src="/nms/repeaterManager/js/nms.store.js"/>
<eRedG4:import src="/nms/repeaterManager/js/nms.siteTree.js"/>
<eRedG4:import src="/nms/repeaterManager/js/nms.onTabPanel.js"/>
<eRedG4:import src="/nms/repeaterManager/js/nms.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/newRepeater.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/setRepeaterID.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/monitorParamList.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/initMonitorboard.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/modStationWindow.js"/>
<eRedG4:import src="/nms/repeaterManager/js/rightClickMenu/setReporting.js"/>
<eRedG4:import src="/nms/repeaterManager/js/treeRightClickMenu/openConnection.js"/>
<eRedG4:import src="/nms/repeaterManager/js/treeRightClickMenu/addSubMachine.js"/>
<eRedG4:import src="/nms/repeaterManager/js/treeRightClickMenu/queryRepeater.js"/>
<eRedG4:import src="/nms/util/complete.js"/>
<eRedG4:ext.comboxStore name="protocol"/>
<eRedG4:ext.comboxStore name="site" paramName="flag,type" paramValue="0,1"/>
<eRedG4:ext.comboxStore name="devicetype" storeName="devicetype"/>
<eRedG4:ext.comboxStore name="basetable" storeName="connType" paramName="type" paramValue="30"/>
<eRedG4:body>
		<div id="tree" style="width:20%; padding-left:0px; height:100%;"></div>
		<div id="panel1" style=" position:absolute; top:0px; left:20%; width:79%; height:100%;"></div>
</eRedG4:body>
</eRedG4:html>
