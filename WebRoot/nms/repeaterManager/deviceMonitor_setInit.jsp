<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="直放站参数设置" showLoading="false" extDisabled="true" jqueryEnabled="true">
<eRedG4:script>
	var protype_ = '${param.protype}';
	var repeaterid_ = '${param.repeaterid}';
</eRedG4:script>
<eRedG4:body>
	<eRedG4:div key="setTreeDiv"></eRedG4:div>
	<eRedG4:div key="repeaterGridTable"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>
<eRedG4:import src="/nms/repeaterManager/js/deviceMonitor_setInit.js" />
<eRedG4:import src="/resource/datepicker/WdatePicker.js" />
