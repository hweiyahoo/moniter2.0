<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%
   String path = request.getContextPath();
   String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<base href="<%=basePath%>">
		<title>通告</title>
	</head>
	<body>
		<div class="BlueBox" style="height: 165px;">
			<div class="LightBlue">
				<ul class="NormalList">
					<c:if test="${fn:length(noticeList)=='0'}">
						<table class="PortletTable" cellspacing="0" cellpadding="0" width=100% height="100%">
							<TR>
								<TD align="center" valign="center" width="100%" height="100%">
									近期无公告！
								</TD>
							</TR>
						</table>
					</c:if>
					<c:if test="${fn:length(noticeList)!='0'}">
						<table class="PortletTable" cellspacing="0" cellpadding="0" width=100%>
							<c:forEach var="notice" items="${noticeList}" varStatus="status">
								<TR>
									<TD align="left" style="padding-left: 6px;" width=60%>
										<li>
											<span class=titleLink onclick="readNotice('${notice.receive_id}')">${notice.title}</span>
										</li>
									</TD>
									<TD align="center" style="padding-left: 6px;">
										${notice.publish_user}
									</TD>
									<TD align="center" style="padding-left: 6px;">
										${notice.publish_time}
									</TD>
								</TR>
							</c:forEach>
						</table>
					</c:if>
				</ul>
			</div>
		</div>
	</body>
</html>