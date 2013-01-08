<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="通讯参数设置" uxEnabled="true">
<eRedG4:import src="/nms/cfg/js/comConfig.js" />
<eRedG4:script>
	var comport= '${comminfo.comport}';
 	var baudrate= '${comminfo.baudrate}';
 	var parity= '${comminfo.parity}';
 	var stopbits= '${comminfo.stopbits}';
	var flowcontrolin= '${comminfo.flowcontrolin}';
	var flowcontrolout= '${comminfo.flowcontrolout}';
	var databits= '${comminfo.databits}';
</eRedG4:script>
<eRedG4:body>
	<eRedG4:div key="comConfigWindow"></eRedG4:div>
</eRedG4:body>
</eRedG4:html>