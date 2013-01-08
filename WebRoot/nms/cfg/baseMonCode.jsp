<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="监控标识号管理" uxEnabled="true" isSubPage="true">
<eRedG4:import src="/nms/cfg/js/baseMonCode.js"/>
<eRedG4:ext.comboxStore name="protocol" storeName="protype"/>
<eRedG4:ext.comboxStore name="basetable" storeName="paramClass" paramName="type" paramValue="202"/>
<eRedG4:ext.comboxStore name="basetable" storeName="alarmType" paramName="type" paramValue="201"/>
<eRedG4:ext.comboxStore name="basetable" storeName="dataType" paramName="type" paramValue="203"/>
<eRedG4:ext.comboxStore name="basetable" storeName="hToD" paramName="type" paramValue="205"/>
<eRedG4:ext.comboxStore name="basetable" storeName="rArith" paramName="type" paramValue="54"/>
<eRedG4:ext.comboxStore name="basetable" storeName="sArith" paramName="type" paramValue="53"/>
<eRedG4:ext.comboxStore name="basetable" storeName="reFlag" paramName="type" paramValue="204"/>
<eRedG4:body>
<eRedG4:div key="baseMonCodeTableGrid"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>