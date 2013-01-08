<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="直放站轮询设置" doctypeEnable="true">
<eRedG4:ext.myux uxType="datatimefield" />
<eRedG4:import src="/nms/repeaterManager/js/repeaterPollCfg.js" />
<eRedG4:import src="/dwr/interface/PollployPush.js" />
<eRedG4:import src="/dwr/engine.js" />
<eRedG4:import src="/dwr/util.js" />
<eRedG4:import src="/nms/repeaterManager/js/pollpoly_comet.js" />
<eRedG4:ext.comboxStore name="protocol" />
<eRedG4:ext.comboxStore name="deptrole" />
<eRedG4:script>
   var CurrentDay = '${CurrentDay}';
</eRedG4:script>
<eRedG4:body>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>