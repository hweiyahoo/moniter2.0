<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="基本信息设置" showLoading="false" extDisabled="true">
<eRedG4:import src="/resource/css/editorgrid.css" />
<eRedG4:script>
	var protype_ = '${param.protype}';
	var repeaterid_ = '${param.repeaterid}';
	var isautoreflesh = '${param.isautoreflesh}';
	var invaltime = '${param.invaltime}';
	var wh = '${param.wh}';
</eRedG4:script>
<eRedG4:body>
	<eRedG4:nms.devicebaseinfo protype="${param.protype}" repeaterid="${param.repeaterid}" paramclass="${param.paramclass}" isautoreflesh="${param.isautoreflesh}" invaltime="${param.invaltime}" params="${param.wh}"/>
</eRedG4:body>
</eRedG4:html>
<eRedG4:import src="/resource/commonjs/time.js" />
<eRedG4:import src="/nms/repeaterManager/js/deviceMonitor_base.js" />
<eRedG4:import src="/nms/repeaterManager/js/deviceMonitor_setPub.js" />
