<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="直放站统计" uxEnabled="true">
<eRedG4:import src="/nms/logmgr/js/repeaterStatistics.js"/>
<eRedG4:import src="/nms/util/saveToExcel.js"/>
<eRedG4:body>
<eRedG4:ext.comboxStore name="protocol" />
<eRedG4:ext.comboxStore name="site" storeName="province" paramName="flag,type" paramValue="0,1"/>
<eRedG4:div key="repeaterStatisticsGridTable"></eRedG4:div>
<eRedG4:div key="repeaterStatisticsFormTable"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>