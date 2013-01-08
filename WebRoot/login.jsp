<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="${sysTitle}" showLoading="false" exportParams="true" isSubPage="false">
<eRedG4:import src="/arm/js/login.js" />
<eRedG4:body>
	<div id="hello-win" class="x-hidden">
		<div id="hello-tabs">
			<img border="0" width="450" height="70"
				src="<%=request.getAttribute("bannerPath") == null ? request.getContextPath() + "/resource/image/login_banner.png" : request.getAttribute("bannerPath")%>" />
		</div>
	</div>
</eRedG4:body>
</eRedG4:html>