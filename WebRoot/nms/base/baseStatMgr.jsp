<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="基站管理" uxEnabled="true">
<eRedG4:import src="/nms/base/js/baseStatMgr.js"/>
<eRedG4:ext.comboxStore name="site" storeName="province" paramName="flag,type" paramValue="0,1"/>
<eRedG4:body>
<eRedG4:div key="baseStatTableGrid"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>