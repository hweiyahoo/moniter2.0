<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="地区编码" uxEnabled="true" isSubPage="true">
<eRedG4:import src="/nms/base/js/site.js" />
<eRedG4:script>
	var root_menuname = '${params.root_menuname}';
	var type = '${params.type}';
</eRedG4:script>
<eRedG4:body>
	<eRedG4:div key="menuTreeDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>