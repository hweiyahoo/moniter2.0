<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="命令策略管理--监控标识选择" showLoading="false" extDisabled="true">
<eRedG4:import src="/nms/cfg/js/cmdPraseMng_select.js"/>
<eRedG4:ext.comboxStore name="basetable" storeName="paramclass" paramName="type" paramValue="202"/>
<eRedG4:script>
   var protype_ = '${protype}';
</eRedG4:script>
<eRedG4:body>
<eRedG4:div key="paramclassTableGrid"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>