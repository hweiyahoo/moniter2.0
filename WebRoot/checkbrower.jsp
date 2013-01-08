<%@ page language="java" pageEncoding="UTF-8"%>
<%
   String path = request.getContextPath();
   String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">
		<title>系统访问者浏览器验证...</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<style type="text/css">
			#brower-warning {
				z-index: 9999999;
				background: #FF0;
				position: absolute;
				top: 0;
				left: 0;
				font-size: 12px;
				line-height: 24px;
				color: #F00;
				padding: 0 10px;
			}
			
			#brower-warning label {
				float: right;
				cursor: pointer;
				margin-top: 4px;
			}
			
			#brower-warning a {
				text-decoration: none;
			}
		</style>
	</head>
	<body>
		<div id="brower-warning" align="center" style="display: block;">
			<label></label>
			<font color='black'>[NMS监控平台]友情提示：</font>您正在使用 Internet Explorer 版本的IE浏览器(或IE内核的兼容浏览器)。为了给您带来更快速、更安全、更优质的体验，
			<br>
			请下载我们精心为您准备的登录访问工具：
			<a href="resource/brower/nmsBrower1.0.exe">NMS系统登录器</a>(<font color='blue'>推荐</font>)(点击可以下载安装)
		</div>
	</body>
</html>
