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
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">
		<title>万年历</title>
		<!-- 万年历lib -->
		<link href="resource/myux/calendar/calendar.css" rel="stylesheet" type="text/css" />
		<script src="resource/myux/calendar/bdcalendar_utf8.js"></script>
	</head>
	<body>
		<table cellpadding="0" cellspacing="0" align="center">
			<tr>
				<td>
					<div id="cal">
						<div id="top">
							公元&nbsp;
							<select></select>
							&nbsp;年&nbsp;
							<select></select>
							&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;农历
							<span></span>年&nbsp;[&nbsp;
							<span></span>年&nbsp;]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<input type="button" value="回到今天" title="点击后跳转回今天" style="padding: 0px">
						</div>
						<ul id="wk">
							<li>
								一
							</li>
							<li>
								二
							</li>
							<li>
								三
							</li>
							<li>
								四
							</li>
							<li>
								五
							</li>
							<li>
								<b>六</b>
							</li>
							<li>
								<b>日</b>
							</li>
						</ul>
						<div id="cm"></div>
						<div id="bm">
							<c:if test="${fn:length(weatherList)=='0'}">
								<a target="_blank" onMouseDown="return c({'fm':'alop','title':this.innerHTML,'url':this.href,'p1':al_c(this),'p2':1})" href="javascript:void(0)">历史上的今天</a>
							</c:if>
							<c:forEach var="weather" items="${weatherList}" varStatus="status">
								<ul>
									<li>
										<a target="_blank" onclick="return c({'fm':'alop','title':this.innerHTML,'url':this.href,'p1':al_c(this),'p2':1})" href="javascript:void(0)"></a>
										<span id="showWeather" style="margin: 10px;">${weather.weatherInfo}</span>
									</li>
								</ul>
							</c:forEach>
						</div>
					</div>
				</td>
			</tr>
		</table>
	</body>
</html>
<SCRIPT>
	var $j = jQuery.noConflict();
	var sl_i=6;
	$j("#bm ul li ").hide();
	// $j("#bm ul li ").eq(0).show();
	var sI=setInterval("sl()",1);
	function sl(){
		if(sI){
		  clearInterval(sI);
		}
		sI=setInterval("sl()",5000);
		sl_j=sl_i%3;
		$j("#bm ul li ").hide();
		$j("#bm ul li ").eq(sl_j).show("slow");
		sl_i++;
	}
</SCRIPT>