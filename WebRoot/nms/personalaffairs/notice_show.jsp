<%@ page language="java" pageEncoding="UTF-8"%>
<%
   String path = request.getContextPath();
   String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<html>
	<head>
		<base href="<%=basePath%>">
		<title>查看通告</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<link rel="stylesheet" type="text/css" href="resource/css/peraffairs_style.css" />
	</head>
	<body class="bodycolor" topmargin="5">
		<table class="TableTop" width="100% align="center">
			<tr>
				<td class="left"></td>
				<td class="center">
					【${noticeInfo.type_name}】
					<font color='#FF0000'>${noticeInfo.title}</font>
				</td>
				<td class="right"></td>
			</tr>
		</table>
		<table class="TableBlock no-top-border" width="100%" height="100%" align="center">
			<tr height="30">
				<td class="TableContent" align="right">
					发布部门：
					<u style="cursor: hand">${noticeInfo.publish_dept}</u>&nbsp;&nbsp; 发布人：
					<u style="cursor: hand">${noticeInfo.publish_user}</u>&nbsp;&nbsp; 发布于：
					<i>${noticeInfo.publish_time}</i>
				</td>
			</tr>
			<tr>
				<td class="TableData Content" colspan="2" valign="top">
					&nbsp;${noticeInfo.content}
				</td>
		</table>
	</body>
</html>
