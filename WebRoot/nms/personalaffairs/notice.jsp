<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="公告管理" uxEnabled="true">
<eRedG4:import src="/nms/personalaffairs/js/notice.js"/>
<eRedG4:import src="/resource/extjs3.1/ux/css/MultiSelect.css" />
<eRedG4:ext.comboxStore name="noticemodel" />
<eRedG4:ext.comboxStore name="noticetype" />
<eRedG4:ext.comboxStore name="deptuser" />
<eRedG4:ext.comboxStore name="deptrole" />
<eRedG4:body>
<eRedG4:div key="noticeTableGrid"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>