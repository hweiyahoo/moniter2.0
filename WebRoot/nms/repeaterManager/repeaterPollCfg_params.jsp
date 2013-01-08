<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="直放站轮询设置" showLoading="false" extDisabled="true">
<eRedG4:import src="/nms/repeaterManager/js/repeaterPollCfg_params.js" />
<eRedG4:ext.comboxStore name="basetable" paramName="type" paramValue="202" storeName="paramclass" />
<eRedG4:script>
   var pollployid_ = '${params.pollployid}';
   var protype_ = '${params.protype}';
</eRedG4:script>
<eRedG4:body>
	<eRedG4:div key="moniterParamGridTable"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>