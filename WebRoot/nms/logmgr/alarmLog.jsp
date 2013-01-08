<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="告警日志" uxEnabled="true">
<eRedG4:import src="/nms/logmgr/js/alarmLog.js" />
<eRedG4:script>
	var repeaterid_ = '${param.repeaterid}';
	var flag_ = '${param.flag}';
	var alarmtype_ = '${param.alarmtype}';
</eRedG4:script>
<eRedG4:body>
	<eRedG4:ext.comboxStore name="protocol" />
	<eRedG4:ext.comboxStore name="site" storeName="province" paramName="flag,type" paramValue="0,1" />
	<eRedG4:div key="alarmLogGridTable"></eRedG4:div>
	<eRedG4:div key="alarmLogFormTable"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>
