package com.sunnada.nms.pub.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.comm.serial.SerialConnection;
import com.sunnada.nms.dao.BtnConnectClickService;
import com.sunnada.nms.dao.ComDataService;
import com.sunnada.nms.dao.DevSetBoardInitService;
import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.message.analysisbag.AbstractAnaly;
import com.sunnada.nms.parse.AbsSender;
import com.sunnada.nms.parse.AidParser;
import com.sunnada.nms.parse.Sender4yd;
import com.sunnada.nms.repeaterManager.web.DeviceMagAction;
import com.sunnada.nms.socket2.MinaServer;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.sys.DMParamPush;

/**
 * @author 徐金妹 E-mail: 44283920@qq.com
 * @version 创建时间：9/9, 2011 2:07:29 PM 监控板初始化 控制器
 */
public class DevSetBoardInitAction extends BaseAction {
   private static Logger          logger                 = Logger
                                                               .getLogger(DevSetBoardInitAction.class);
   private DevSetBoardInitService devSetBoardInitService = (DevSetBoardInitService) super
                                                               .getService("devSetBoardInitService");
   private DeviceMagService       deviceMagService       = (DeviceMagService) super
                                                               .getService("deviceMagService");
   private ComDataService         cdService              = (ComDataService) SpringBeanLoader
                                                               .getSpringBean("ComDataService");
   private SerialConnection       connection             = null;
   private BtnConnectClickService btnConnectClickService = (BtnConnectClickService) super
                                                               .getService("btnConnectClickService");
   
   /**
    * 
    * @param stationId
    * @param statSubId
    * @param superPwd
    * @return 返回查询的结果字符串
    */
   public ActionForward searchReturn(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request,
                                     HttpServletResponse response) throws Exception {
      String StationID = request.getParameter("stationid");
      String StatSubId = request.getParameter("statsubid");
      String tel = request.getParameter("tel");
      String lProType = request.getParameter("protype");
      String repeaterid = request.getParameter("repeaterid");
      String channelname = request.getParameter("channelname");
      Dto strDto = new BaseDto();
      String jsonStrList = null;
      String val = null;
      
      AidParser parser=new AidParser();
     Map map=new HashMap();
     map.put("01C3", "");
     map.put("0101", parser.highToLow(StationID));
     map.put("0102", StatSubId);
     tel=AbstractAnaly.getValue(lProType, "0110", tel, false);
     tel=StringUtils.rComplete(tel, "0", 40);
     map.put("0111", tel);
     AbsSender sender=new Sender4yd();
     List list=sender.buildSendStr(repeaterid, "02", map);
      try {
         CommonActionForm commonActionForm = (CommonActionForm) form;
         Dto pDto = commonActionForm.getParamAsDto(request);
         Dto info = btnConnectClickService.queryStationInfo(pDto);
         String chanelcode = info.getAsString("channelcode");
         String stationid = info.getAsString("stationid");
         String statsubid = info.getAsString("statsubid");
         if ("13".equals(chanelcode)) {
            MinaServer.getMinaServer().sendMsg(stationid, list);
            DeviceMagAction.push(list, stationid,statsubid, request.getSession().getId(), Constant.tcp);
         }
         else if ("03".equals(chanelcode)) {
            String telephone = info.getAsString("stattel");
            //DeviceMagAction.sendCmdByModem(telephone, sendDataList);
            //DeviceMagAction.push(sendDataList, stationid,statsubid, request.getSession().getId(), Constant.modem);
         }
         else if("01".equals(chanelcode)){
//            for (int i = 0; i < sendDataList.size(); i++) {
//               SerialConnection.getInstance().SendCMD(StringUtils.charTobyte(sendDataList.get(i).toString()));
//            }
         }
         strDto.put("success", new Boolean(false));
         strDto.put("msg", "查询成功");
         jsonStrList = JsonHelper.encodeObject2Json(strDto);
         response.getWriter().write(jsonStrList);
         return mapping.findForward(null);
      }
      catch (Exception e) {// 弹出错误窗口
         e.printStackTrace();
         strDto.put("failure", new Boolean(true));
         strDto.put("msg", e.getMessage());
         return mapping.findForward(null);
      }
   }
   
   /**
    * 
    * @param stationId
    * @param statSubId
    * @param superPwd
    * @return 返回设置的结果字符串 select RepeaterID,ProType from RepeaterInfo where
    *         StationID='''+StatCode+''' And StatSubID='''+StatSubCode+
    * 
    * 'select A.ParamCode from MonCode A where A.ReFlag='11' And
    * A.ProType='10''#$D#$A
    */
   public ActionForward configReturn(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request,
                                     HttpServletResponse response) throws Exception {
      String StationID = request.getParameter("stationid");
      String StatSubId = request.getParameter("statsubid");
      String tel = request.getParameter("tel");
      String lProType = request.getParameter("protype");
      String repeaterid = request.getParameter("repeaterid");
      String channelname = request.getParameter("channelname");
      String oldStationid=request.getParameter("oldStationid");
      //验证
      Dto dto2=new BaseDto();
      dto2.put("repeaterid", repeaterid);
      if(!deviceMagService.isHost(dto2)){
         if(StatSubId.equals("00")){
            write("{success:false,msg:'从机设备编号不可为00'}", response);
            return mapping.findForward(null);
         }
      }
      else{
         if(!StatSubId.equals("00")&&!StatSubId.equals("FF")){
            write("{success:false,msg:'主机设备编号只可为00或FF'}", response);
            return mapping.findForward(null);
         }
      }
      dto2=new BaseDto();
      dto2.put("stationid", StationID);
      dto2.put("statsubid", StatSubId);
      if(!deviceMagService.repeate(dto2)){
         write("{success:false,msg:'站点编号，设备编号重复'}", response);
         return mapping.findForward(null);
      }
      Dto strDto = new BaseDto();
      String jsonStrList = null;
      List arrList = new ArrayList();
      List arrvalList = new ArrayList();
      String val = null;
      
      AidParser parser=new AidParser();
      Map map=new HashMap();
      map.put("01C3", "");
      map.put("0101", parser.highToLow(StationID));
      map.put("0102", StatSubId);
      tel=AbstractAnaly.getValue(lProType, "0110", tel, false);
      tel=StringUtils.rComplete(tel, "0", 40);
      map.put("0111", tel);
      AbsSender sender=new Sender4yd();
      List list=sender.buildSendStr(repeaterid, "03", map);
      String vcmd = "";
      try {
         // 发给串口begin验证好
         /*
          * for (int i = 0; i < (sendDataList.size()); i++) { vcmd = ((String)
          * sendDataList.get(i)).trim(); System.out.println("xjm20110913vcmd:" +
          * vcmd); // 发给串口begin Dto dto = new BaseDto(); dto.put("com",
          * channelname); dto.put("cmddetail", vcmd); dto.put("insertdate",
          * DateTimeUtils.getDateSecondFormat()); dto.put("flag", "0");
          * dto.put("siteid", StationID); dto.put("cmd","03");
          * dto.put("sitetel",tel); dto.put("windowtitle","监控板初始化设置");
          * cdService.insertItem(dto);
          * SerialConnection.getInstance().SendCMD(StringUtils.charTobyte(vcmd)); }
          */// 发给串口end
//         for (int i = 0; i < (sendDataList.size()); i++) {
//            vcmd = ((String) sendDataList.get(i)).trim();
            // System.out.println("xjm20110919sendSetcmd:" + vcmd);
//            Dto dto = new BaseDto();
//            dto.put("com", channelname);
//            dto.put("cmddetail", vcmd);
//            dto.put("insertdate", DateTimeUtils.getDateSecondFormat());
//            dto.put("flag", "0");// "发"
//            dto.put("siteid", StationID);
//            dto.put("cmd", "02");
//            dto.put("sitetel", tel);
//            dto.put("windowtitle", "监控板初始化设置");
//            cdService.insertItem(dto);
//         }
         CommonActionForm commonActionForm = (CommonActionForm) form;
         Dto pDto = commonActionForm.getParamAsDto(request);
         Dto info = btnConnectClickService.queryStationInfo(pDto);
         String chanelcode = info.getAsString("channelcode");
         boolean flag=false;
         if ("13".equals(chanelcode)) {
            flag=MinaServer.getMinaServer().sendMsg(oldStationid, list);
         }
         else if ("03".equals(chanelcode)) {
//            String telephone = info.getAsString("stattel");
//            for (int i = 0; i < sendDataList.size(); i++) {
//               //ModemService.sendSms(telephone, sendDataList.get(i).toString());
//            }
         }
         else if("01".equals(chanelcode)){
//            for (int i = 0; i < sendDataList.size(); i++) {
//               SerialConnection.getInstance().SendCMD(StringUtils.charTobyte(sendDataList.get(i).toString()));
//            }
            
         }
         if(flag){
            Dto dto = new BaseDto();
            dto.put("repeaterid", repeaterid);
            dto.put("stationid", StationID);
            dto.put("statsubid", StatSubId);
            dto.put("stattel", tel);
            deviceMagService.updaterepeaterinfo(dto);// 修改repeaterinfo中的站点编号、设备编号、站点电话
            deviceMagService.updateStationid(dto);// 修改repeaterparam中的站点编号
            deviceMagService.updateStatsubid(dto);// 修改repeaterparam中的设备编号
            deviceMagService.updateStatTel(dto);// 修改repeaterparam中的站点电话
            Dto result = deviceMagService.refreshTree(dto);//刷新前台树
            if (result != null) {
               String parent = (String) result.getAsString("parentrepid");
               //String repeaterid = (String) result.getAsString("repeaterid");
               if ("0".equals(parent)) {
                  parent = Constant.STATIONTYPE_STATION;
               }
               else
                  parent = Constant.STATIONTYPE_SUBSTATION;
               DMParamPush.getInstance().updateTreeNodeConnStatus(parent, StationID, StatSubId,repeaterid);
               Thread.sleep(1000);
            }
            DeviceMagAction.push(list, StationID, StatSubId,request.getSession().getId() , Constant.tcp);
            strDto.put("success", new Boolean(false));
            strDto.put("msg", "设置成功");
         }
         else{
            strDto.put("success", new Boolean(false));
            strDto.put("msg", "设置失败");
         }
         jsonStrList = JsonHelper.encodeObject2Json(strDto);
         response.getWriter().write(jsonStrList);
         return mapping.findForward(null);
      }
      catch (Exception e) {// 弹出错误窗口
         e.printStackTrace();
         strDto.put("failure", new Boolean(true));
         strDto.put("msg", e.getMessage());
         return mapping.findForward(null);
      }
   }
   
   
   /**
    * 测试main
    */
   public static void main(String[] args) {
      
   }
   
}
