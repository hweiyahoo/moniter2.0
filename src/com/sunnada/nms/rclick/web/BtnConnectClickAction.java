package com.sunnada.nms.rclick.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.comm.serial.SerialConnection;
import com.sunnada.nms.comm.serial.SerialParameters;
import com.sunnada.nms.dao.BtnConnectClickService;
import com.sunnada.nms.modem2.ModemService;
import com.sunnada.nms.util.sys.NMSBusinessParams;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Aug 5, 2011 9:53:35 AM 连接站点
 */
public class BtnConnectClickAction extends BaseAction {
   private static Logger          logger                 = Logger
                                                               .getLogger(BtnConnectClickAction.class);
   private BtnConnectClickService btnConnectClickService = (BtnConnectClickService) super
                                                               .getService("btnConnectClickService");
   
   String                         jsonStrList            = null;
   public static SerialConnection connection             = null;
   
   /**
    * 连接站点确定按钮逻辑
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward connBtnConfirm(ActionMapping mapping, ActionForm form,
                                       HttpServletRequest request,
                                       HttpServletResponse response) throws Exception {
      int conMode = 0;
      String connType = null;
      String comm = null;
      String tel = null;
      
      String result = null;
      
      CommonActionForm aForm = (CommonActionForm) form;
      Dto outDto = new BaseDto();// 存放返回界面信息
      Dto stationInfoDto = new BaseDto();// 存放查询返回站点信息
      Dto inDto = aForm.getParamAsDto(request);// 存放请求信息
      // 查出站点信息
      stationInfoDto = btnConnectClickService.queryStationInfo(inDto);
      // 查詢出連接站点标识 0未连接 1已连接
      String connFlag = (String) stationInfoDto.get("connectflag");
      // 连接站点返回连接成功与否（不知放哪裡）
      // Boolean flag = btnConnectClickService.ConnectComm();
      connType = (String) inDto.get("conntype");
      comm = (String) inDto.get("comm");
      tel = (String) inDto.get("tel");
      
      if (connType == null || connType.equals(" ")) {
         result = "-1";
         jsonStrList = "{success:false,type:false,msg:'请选择一种连接方式'}";
      }
      
      if (connType.equals("03")) {// GSM短信
         result = this.openModen(inDto);
      }
      
      if (connType.equals("01")) {// 串口
         result = this.seriaConnect(inDto);
      }
      
      if (result == "-1") {
         // jsonStrList = "{success:false,msg:'++'}";
      }
      else {// 连接成功，
         inDto.put("connectflag", "1");
         // 更新连接标识
         outDto = btnConnectClickService.upConnectFlag(inDto);
         // 更新站点与子站信息
         //outDto = btnConnectClickService.connBtnConfirm(inDto);
         // jsonStrList = JsonHelper.encodeObject2Json(outDto);
      }
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   private String tcpConnect(Dto inDto) {
      String result = null;
      Dto outDto = btnConnectClickService.queryPort(inDto);
      String port = outDto.getAsString("port");
      port = port.substring(port.indexOf("=") + 1, port.length() - 1);
      if (port.equals("null") || port.equals("")) {
         result = "-1";
         jsonStrList = "{success:false,msg:'站点目前不在线'}";
      }
      else {
         result = "1";
         jsonStrList = "{success:true,msg:'连接成功'}";
      }
      return result;
   }
   
   private String seriaConnect(Dto inDto) {
      String result = null;
      SerialParameters sp = NMSBusinessParams.getSerialParameters(getServlet()
            .getServletContext());
      String portName = inDto.getAsString("comm");
      sp.setPortName(portName);
      connection = SerialConnection.getInstance();
      connection.setSerialParameters(sp);
      // connection = new SerialConnection(sp);
      try {
         if (!connection.isOpen()) {
            connection.openConnection();
            result = "1";
            jsonStrList = "{success:true,msg:'连接成功!'}";
            SerialConnection.setConnection(connection);
         }
         else {
            result = "-1";
            jsonStrList = "{success:false,msg:'串口已经打开!'}";
         }
      }
      catch (Exception e) {// 弹出错误窗口
         e.printStackTrace();
         logger.info("Error Opening Port!" + e.getMessage());
         result = "-1";
         jsonStrList = "{success:false,msg:'串口已被其他程序占用！'}";
      }
      return result;
   }
   
   /**
    * 关闭串口
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward closeSerial(ActionMapping mapping, ActionForm form,
                                    HttpServletRequest request,
                                    HttpServletResponse response) throws Exception {
      try {
         if (connection != null) {
            connection.closeConnection();
            connection = null;
            SerialConnection.setConnection(connection);
            CommonActionForm commonActionForm = (CommonActionForm) form;
            Dto requestDto = commonActionForm.getParamAsDto(request);
            btnConnectClickService.clearFlag(requestDto);
            write("{success:true,msg:'成功关闭!'}", response);
         }
         else
            write("{success:true,msg:'未打开串口，无需关闭！'}", response);
      }
      catch (Exception e) {
         write("{success:false,msg:'关闭出错'}", response);
      }
      return mapping.findForward(null);
   }
   
   /**
    * 初始化短信moden
    */
   private String openModen(Dto inDto) {
      String result = null;
      
      if (ModemService.flag) {
         String telephone = btnConnectClickService.queryStattel(inDto);
         if (telephone != null && !telephone.equals("")) {
            result = "1";
            jsonStrList = "{success:true,msg:'连接成功!'}";
         }
         else {
            result = "-1";
            jsonStrList = "{success:false,msg:'站点电话为空！'}";
         }
      }
      else {
         result = "-1";
         jsonStrList = "{success:false,msg:'猫服务尚未启动!'}";
      }
      return result;
   }
   
   public ActionForward close(ActionMapping mapping, ActionForm form,
                              HttpServletRequest request, HttpServletResponse response)
                                                                                       throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);// 存放请求信息
      
      Dto result=btnConnectClickService.queryStationInfo(inDto);
      String channelcode=result.getAsString("channelcode");
      if("03".equals(channelcode)){
         inDto.put("conntype", 13);
         btnConnectClickService.connBtnConfirm(inDto);
      }
      write("{success:true,msg:'连接已断开！'}", response);
      return mapping.findForward(null);
   }
}
