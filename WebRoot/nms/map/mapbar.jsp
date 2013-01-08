<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<%@ include file="/common/include/mapbar.jsp"%>
<eRedG4:html title="地图" uxEnabled="true" isSubPage="true" doctypeEnable="true">
<eRedG4:script>
   var user_dept_province = '${params.province}';
   var user_dept_city = '${params.city}';
   //var mapbarWidth = document.body.clientWidth-220;
   //var mapbarHeight = document.body.clientHeight-20;
</eRedG4:script>
<eRedG4:import src="/nms/map/js/mapbar.js" />
<eRedG4:import src="/nms/map/js/mapbarOper.js" />
<eRedG4:body>
	<eRedG4:div key="menuTreeDiv"></eRedG4:div>
	<eRedG4:div key="mapbar" style="width:1000px;height:700px;"></eRedG4:div> 
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>
<eRedG4:nms.mappoint province="${params.province}" city="${params.city}" />
