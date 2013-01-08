<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="编辑控件管理" uxEnabled="true">
<eRedG4:import src="/nms/cfg/js/editorMng.js"/>
<eRedG4:ext.comboxStore name="protocol" />
<eRedG4:ext.comboxStore name="basetable" paramName="type" paramValue="202" storeName="paramclass"/>
<eRedG4:ext.comboxStore name="excutesql" storeName="editortype" sql="SELECT editortype AS 'value', CONCAT('[',editortype,']',editortypename) AS 'text' FROM editortype ORDER BY sort" />
<eRedG4:body>
<eRedG4:div key="editorTreeDiv"></eRedG4:div>
<eRedG4:div key="editorGridDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant />
</eRedG4:html>