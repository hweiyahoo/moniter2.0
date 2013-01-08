<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="轮询报表" doctypeEnable="true">
<eRedG4:import src="/nms/repeaterManager/js/repcheck/repeaterCheck.js"/>
<eRedG4:import src="/nms/util/saveToExcel.js"/>
<eRedG4:ext.myux uxType="datatimefield"/>
<eRedG4:body>
<eRedG4:ext.comboxStore name="protocol" />
<eRedG4:ext.comboxStore name="site" storeName="province" paramName="flag,type" paramValue="0,1"/>
<eRedG4:ext.comboxStore name="basetable" storeName="alarmType" paramName="type" paramValue="201"/>
<eRedG4:div key="repeaterCheckGridTable"></eRedG4:div>
<eRedG4:div key="repeaterCheckFormTable"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>