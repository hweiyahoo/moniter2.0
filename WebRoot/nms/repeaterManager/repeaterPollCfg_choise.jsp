<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="直放站轮询设置" showLoading="false" extDisabled="true">
<eRedG4:import src="/nms/repeaterManager/js/repeaterPollCfg_choise.js" />
<eRedG4:ext.comboxStore name="protocol" />
<eRedG4:ext.comboxStore name="basetable2" storeName="communiName" paramName="flag,type" paramValue="0,1"/>
<eRedG4:ext.comboxStore name="site" storeName="province" paramName="flag" paramValue="0" />
<eRedG4:script>
   var pollployid_ = '${params.pollployid}';
   var protype_ = '${params.protype}';
   var devicetype_ = '${params.devicetype}';
</eRedG4:script>
<eRedG4:body>
	<eRedG4:div key="repeaterGridTable"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>