<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="告警统计" uxEnabled="true" fcfEnabled="true">
<eRedG4:import src="/nms/logmgr/js/alarmStatistics.js" />
<eRedG4:import src="/nms/util/saveToExcel.js" />
<eRedG4:body>
	<eRedG4:ext.comboxStore name="protocol" />
	<eRedG4:ext.comboxStore name="site" storeName="province" paramName="flag,type" paramValue="0,1"/>
	<eRedG4:ext.comboxStore name="basetable" storeName="alarmType" paramName="type" paramValue="201" />
	<eRedG4:div key="container"></eRedG4:div>
	<eRedG4:flashReport type="2DC_MS" dataVar="xmlString" id="my2Dc_MsChart" align="center" visible="false" width="800"/>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>
