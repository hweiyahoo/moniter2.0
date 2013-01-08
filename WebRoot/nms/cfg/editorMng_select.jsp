<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="监控标识选择" showLoading="false" extDisabled="true">
<eRedG4:import src="/nms/cfg/js/editorMng_select.js"/>
<eRedG4:ext.comboxStore name="basetable" storeName="paramclass" paramName="type" paramValue="202"/>
<eRedG4:script>
   var protype_ = '${param.protype}';
   var editorcode_,editorname_,editorid_;
</eRedG4:script>
<eRedG4:ext.comboxStore name="protocol" />
<eRedG4:ext.comboxStore name="basetable" paramName="type" paramValue="202" storeName="paramclass"/>
<eRedG4:body>
<eRedG4:div key="MoncodeTableGrid"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>