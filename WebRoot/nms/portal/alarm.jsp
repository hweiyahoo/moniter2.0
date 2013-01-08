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
		<title>最新告警</title>
	</head>
	<body>
		<div class="BlueBox" style="height: 300px;">
			<div class="LightBlue">
				<!--<h2>我的帐务信息</h2>-->
				<ul class="NormalList">
					<c:if test="${fn:length(alarmList)=='0'}">
						<table class="PortletTable" cellspacing="0" cellpadding="0" width="100%" height="100%">
							<TR>
								<TD align="center" valign="center" width="100%" height="100%">
									无告警信息！
								</TD>
							</TR>
						</table>
					</c:if>
					<c:if test="${fn:length(alarmList)!='0'}">
						<table class="PortletTable" cellspacing="0" cellpadding="0" width="100%">
							<c:forEach var="alarm" items="${alarmList}" varStatus="status">
								<TR>
									<TD align="left" style="padding-left: 6px;" width=15%>
										<li>
											<c:set var="alarmColor" value="F9DE39"></c:set>
											<c:if test="${alarm.alarmtype=='20'}">
												<c:set var="alarmColor" value="F98039"></c:set>
											</c:if>
											<c:if test="${alarm.alarmtype=='30'}">
												<c:set var="alarmColor" value="F92939"></c:set>
											</c:if>
											<font color="${alarmColor}">${alarm.alarmtypename}</font>
										</li>
									</TD>
									<TD align="left" style="padding-left: 6px;" width=60%>
										[${alarm.stationname}]&nbsp;&nbsp;${alarm.detail}
									</TD>
									<TD align="left" style="padding-left: 6px;" width=25%>
										${alarm.alarmtime}
									</TD>
								</TR>
							</c:forEach>
						</table>
						<table class="PortletTable" cellspacing="0" cellpadding="0" width=100%>
							<TR>
								<TD align="center" style="padding-left: 6px;" width=33%>
									·
									<span class=titleLink onclick="parent.showAlarmTabPanel('', '1','30');" style="color: F92939">严重告警</span><span class="linksummary">(${alarm_30})</span>
								</TD>
								<TD align="center" style="padding-left: 6px;" width=33%>
									·
									<span class=titleLink onclick="parent.showAlarmTabPanel('', '1','20');" style="color: F98039">重要告警</span><span class="linksummary">(${alarm_20})</span>
								</TD>
								<TD align="center" style="padding-left: 6px;" width=33%>
									·
									<span class=titleLink onclick="parent.showAlarmTabPanel('', '1','10');" style="color: F9DE39">一般警告</span><span class="linksummary">(${alarm_10})</span>
								</TD>
							</TR>
						</table>
					</c:if>
				</ul>
			</div>
		</div>
	</body>
</html>