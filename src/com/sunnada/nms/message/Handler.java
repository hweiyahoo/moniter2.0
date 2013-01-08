
package com.sunnada.nms.message; 

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.mina.core.session.IoSession;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.DevSetBoardInitService;
import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.message.pack.AbstractPack;
import com.sunnada.nms.message.pack.AlarmPack;
import com.sunnada.nms.message.pack.ErrorPack;
import com.sunnada.nms.message.pack.HeartBeatPack;
import com.sunnada.nms.message.pack.InitQueryPack;
import com.sunnada.nms.message.pack.InitSetupPack;
import com.sunnada.nms.message.pack.LoginPack;
import com.sunnada.nms.message.pack.ParamListPack;
import com.sunnada.nms.message.pack.QueryPack;
import com.sunnada.nms.message.pack.SetupPack;
import com.sunnada.nms.modem2.ModemService;
import com.sunnada.nms.parse.AbsSender;
import com.sunnada.nms.parse.Sender4yd;
import com.sunnada.nms.socket2.MinaServer;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.InstructionBean;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.sys.DMParamPush;

/** 
 * @author linxingyu
 * @version 创建时间：2012-1-11 下午03:45:24 
 * 解析完的处理
 */
public class Handler {
   private DevSetBoardInitService devSetBoardInitService = (DevSetBoardInitService) SpringBeanLoader.getSpringBean("devSetBoardInitService");
   
   // 1:tcp,2:modem
   public void doHandler(AbstractPack pack,IoSession session,Map<String,IoSession> sessesMap,String flag,String returnTele){
      AbsSender sender=new Sender4yd();
      if (pack instanceof ErrorPack) {
         
      }
      else if(pack instanceof LoginPack){
         LoginPack login=(LoginPack)pack;
         if(session.getAttribute("first")==null)
            saveAddress(login.getStationid(), login.getStatsubid(), session.getRemoteAddress().toString());    //保存地址到数据库
         session.setAttribute("first","1");
         pushHearAndAlarm(login.getNumPack(), login.getStationid(), login.getStatsubid(), login.getCmd(), "1","1");
         Dto dto=new BaseDto();
         dto.put("stationid", login.getStationid());
         dto.put("statsubid", login.getStatsubid());
         Dto result=devSetBoardInitService.checkProtypeDtoAndRePId(dto);
         String repeaterid=result.getAsString("repeaterid");
         List list=sender.respondSendStr(repeaterid, login.getDdu(), login.getNumPack());
         for(int i=0;i<list.size();i++){
            pushByByte(login.getNumPack(), login.getStationid(), login.getStatsubid(), (byte[])list.get(i), "0","1");
         }
         session.setAttribute("time", new Date());
         sessesMap.put(login.getStationid(),session);
         MinaServer.getMinaServer().sendMsg(login.getStationid(), list); 
         System.out.println("收到心跳包"+login.getStationid());
      }
      else if(pack instanceof HeartBeatPack){
         HeartBeatPack hearBeat=(HeartBeatPack)pack;
         if(session.getAttribute("first")==null)
            saveAddress(hearBeat.getStationid(), hearBeat.getStatsubid(), session.getRemoteAddress().toString());    //保存地址到数据库
         session.setAttribute("first","1");
         pushHearAndAlarm(hearBeat.getNumPack(), hearBeat.getStationid(), hearBeat.getStatsubid(), hearBeat.getCmd(), "1","1");
         Dto dto=new BaseDto();
         dto.put("stationid", hearBeat.getStationid());
         dto.put("statsubid", hearBeat.getStatsubid());
         Dto result=devSetBoardInitService.checkProtypeDtoAndRePId(dto);
         String repeaterid=result.getAsString("repeaterid");
         List list=sender.respondSendStr(repeaterid, hearBeat.getDdu(), hearBeat.getNumPack());
         for(int i=0;i<list.size();i++){
            pushByByte(hearBeat.getNumPack(), hearBeat.getStationid(), hearBeat.getStatsubid(), (byte[])list.get(i), "0","1");
         }
         session.setAttribute("time", new Date());
         sessesMap.put(hearBeat.getStationid(),session);
         MinaServer.getMinaServer().sendMsg(hearBeat.getStationid(), list);
         System.out.println("收到心跳包"+hearBeat.getStationid());
      }
      else if(pack instanceof AlarmPack){
         AlarmPack alarmPack=(AlarmPack)pack;
         pushHearAndAlarm(alarmPack.getNumPack(), alarmPack.getStationid(), alarmPack.getStatsubid(), alarmPack.getCmd(), "0", "1");//先推收到的报文
         List list=sender.respondSendStr(alarmPack.getRepeaterid(), alarmPack.getDdu(), alarmPack.getNumPack());
         for(int i=0;i<list.size();i++){
            pushByByte(alarmPack.getNumPack(), alarmPack.getStationid(), alarmPack.getStatsubid(), (byte[])list.get(i), "1","2");
         }
         if("1".equals(flag))
            MinaServer.getMinaServer().sendMsg(alarmPack.getStationid(), list);
         else if("2".equals(flag)){
            for(int i=0;i<list.size();i++){
               String message=StringUtils.byteToStr((byte[])list.get(i));
               ModemService.getModemService().sendSms(returnTele, message);
            }
         }
            
            
      }
      else if(pack instanceof ParamListPack){
         ParamListPack listPack=(ParamListPack)pack;
         String sessionid=push(listPack.getNumPack(), listPack.getStationid(), listPack.getStatsubid(), listPack.getCmd(), "1", "", "","");
         int num=Integer.parseInt(listPack.getNum());
         int count=Integer.parseInt(listPack.getCount());
         if(num<count){
            num++;
            String value=StringUtils.complete(Integer.toHexString(count), "0", 2)+StringUtils.complete(Integer.toHexString(num), "0", 2);
            Map map=new HashMap();
            map.put("0009", value);
            List list=sender.buildSendStr(listPack.getRepeaterid(),"02" , map);
            for(int i=0;i<list.size();i++){
               byte[] d=(byte[])list.get(i);
               int x=(int)d[9];
               String numPack=StringUtils.complete(String.valueOf(x), "0", 2);
               x=(int)d[8];
               numPack=numPack+StringUtils.complete(String.valueOf(x), "0", 2);
               push(numPack, listPack.getStationid(), listPack.getStatsubid(), listPack.getCmd(), "0", "", "",sessionid );
            }
            if("1".equals(flag)){
               MinaServer.getMinaServer().sendMsg(listPack.getStationid(), list);
            }
            else{
               for(int i=0;i<list.size();i++){
                  String message=StringUtils.byteToStr((byte[])list.get(i));
                  ModemService.getModemService().sendSms(returnTele, message);
               }
            }
         }
         else if(num==count){
            DMParamPush.getInstance().updateMonitorParamList(listPack.getRepeaterid());
         }
      }
      else if(pack instanceof QueryPack){
         QueryPack queryPack=(QueryPack)pack;
         String paramclass=queryPack.getParamclass();
         if ("03".equals(paramclass) || "02".equals(paramclass)) {
            DMParamPush.getInstance().pushStatusInfo(queryPack.getProtype(),queryPack.getRepeaterid());
         }
         else if ("00".equals(paramclass) || "01".equals(paramclass)) {
            DMParamPush.getInstance().pushParamsInfoInit(queryPack.getProtype(),queryPack.getRepeaterid());
         }
         else if ("04".equals(paramclass) || "05".equals(paramclass)) {
            DMParamPush.getInstance().pushBaseInfoInit(queryPack.getProtype(),queryPack.getRepeaterid());
         }
         push(queryPack.getPackNum(), queryPack.getStationid(),queryPack.getStatsubid(), queryPack.getCmd(), "1", queryPack.getRespFlag(), queryPack.getResult(), "");
      }
      else if(pack instanceof SetupPack){
         SetupPack setupPack=(SetupPack)pack;
         String paramclass=setupPack.getParamclass();
         if ("03".equals(paramclass) || "02".equals(paramclass)) {
            DMParamPush.getInstance().pushStatusInfo(setupPack.getProtype(),setupPack.getRepeaterid());
         }
         else if ("00".equals(paramclass) || "01".equals(paramclass)) {
            DMParamPush.getInstance().pushParamsInfoInit(setupPack.getProtype(),setupPack.getRepeaterid());
         }
         else if ("04".equals(paramclass) || "05".equals(paramclass)) {
            DMParamPush.getInstance().pushBaseInfoInit(setupPack.getProtype(),setupPack.getRepeaterid());
         }
         push(setupPack.getNumPack(), setupPack.getStationid(),setupPack.getStatsubid(), setupPack.getCmd(), "1", setupPack.getRespFlag(), setupPack.getResult(), "");
      }
      else if(pack instanceof InitQueryPack){
         InitQueryPack initQueryPack=(InitQueryPack)pack;
         //InstructionBean bean=Constant.GetInstruction(initQueryPack.getPackNum());
         DMParamPush.getInstance().updateMonitorBoardParam(initQueryPack.getQueryStationid(), initQueryPack.getStatsubid(), initQueryPack.getTelephone(), initQueryPack.getStationid(), initQueryPack.getStatsubid());
         push(initQueryPack.getPackNum(), initQueryPack.getStationid(), initQueryPack.getStatsubid(), initQueryPack.getCmd(), "1", initQueryPack.getRespFlag(), initQueryPack.getResult(), "");
      }
      else if(pack instanceof InitSetupPack){
         try {
            Thread.sleep(1000);
         }
         catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
         }
         InitSetupPack initSetupPack=(InitSetupPack)pack;
         push(initSetupPack.getPackNum(), initSetupPack.getSetupStationid(), initSetupPack.getSetupStatsubid(),initSetupPack.getCmd() , "1", initSetupPack.getRespFlag(), initSetupPack.getResult(), "");
      }
   }
   
   private void saveAddress(String stationid,String statsubid,String address){
      Dto dto = new BaseDto();
      dto.put("stationid", stationid);
      dto.put("statsubid", statsubid);
      dto.put("report", address);
      DeviceMagService deviceMagService = (DeviceMagService) SpringBeanLoader.getSpringBean("deviceMagService");
      deviceMagService.updateReport(dto);
      Dto result = deviceMagService.refreshTree(dto);
      if (result != null) {
         String parent = (String) result.getAsString("parentrepid");
         String repeaterid = (String) result.getAsString("repeaterid");
         if ("0".equals(parent)) {
            parent = Constant.STATIONTYPE_STATION;
         }
         else
            parent = Constant.STATIONTYPE_SUBSTATION;
         DMParamPush.getInstance().updateTreeNodeConnStatus(parent, stationid, statsubid,repeaterid);
      }
   }
   
   //hearAlarm 1:心跳，2：报警
   //flag:0:发，1：收
   private void pushHearAndAlarm(String numPack,String stationid,String statsubid,String cmd,String flag,String hearAlarm){
      InstructionBean bean = Constant.GetInstruction(numPack);
      bean.setStationid(stationid);
      bean.setStatsubid(statsubid);
      bean.setCmd(cmd);
      bean.setFlag(flag);
      bean.setHearAlarm(hearAlarm);
      bean.setType(Constant.tcp);
      DMParamPush.getInstance().debugLogPanelForHeartAlarm(bean);
   }
   
   private void pushByByte(String numPack,String stationid,String statsubid,byte[] cmd,String flag,String hearAlarm){
      String temp=StringUtils.byteToStr(cmd);
      pushHearAndAlarm(numPack, stationid, statsubid, temp, flag, hearAlarm);
   }
   
   private String push(String numPack,String stationid,String statsubid,String cmd,String flag,String respFlag,String result,String sessionid){
      InstructionBean bean;
      if("0".equals(flag)){
         bean=new InstructionBean();
         bean.setSessionId(sessionid);
      }
      else{
         bean=Constant.GetInstruction(numPack);
      }
      bean.setStationid(stationid);
      bean.setStatsubid(statsubid);
      bean.setCmd(cmd);
      bean.setFlag(flag);
      bean.setType(Constant.tcp);
      bean.setResult(respFlag);
      bean.setReason(result);
      if("0".equals(flag))
         Constant.map.put(numPack, bean);    //放入map中
      DMParamPush.getInstance().debugLogPanel(bean);
      return bean.getSessionId();
   }
   
   private String push(String numPack,String stationid,String statsubid,byte[] cmd,String flag,String respFlag,String result,String sessionid){
      String temp=StringUtils.byteToStr(cmd);
      return push(numPack, stationid, statsubid, temp, flag, respFlag, result,sessionid);
   }
}
