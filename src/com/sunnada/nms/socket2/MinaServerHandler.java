package com.sunnada.nms.socket2;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ws.rs.core.Request;

import org.apache.bsf.util.Bean;
import org.apache.log4j.Logger;
import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IoSession;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.BtnConnectClickService;
import com.sunnada.nms.dao.DevSetBoardInitService;
import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.message.Handler;
import com.sunnada.nms.message.analysisbag.AbstractAnaly;
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
import com.sunnada.nms.parse.AbsSender;
import com.sunnada.nms.parse.AidParser;
import com.sunnada.nms.parse.Sender4yd;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.InstructionBean;
import com.sunnada.nms.util.MapKeyDefine;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.sys.DMParamPush;

/**
 * @author linxingyu
 * @version 创建时间：2011-8-12 下午02:33:58 各协议连接处理父类
 * modified by zhangys 2011/12/12
 */
public class MinaServerHandler extends IoHandlerAdapter {
   private static Logger logger  = Logger.getLogger(MinaServerHandler.class);
   
   private AbstractAnaly analy;
   
   private final Set<IoSession> sessions = Collections.synchronizedSet(new HashSet<IoSession>());
   //devNo=设备编号+设备子编号，用于和设备通讯的标识
   //private final Set<String> devNos = Collections.synchronizedSet(new HashSet<String>());   
   private final Map<String,IoSession> sessesMap = Collections.synchronizedMap(new HashMap<String,IoSession>());
   
   private DevSetBoardInitService devSetBoardInitService = (DevSetBoardInitService) SpringBeanLoader.getSpringBean("devSetBoardInitService");
   
   public boolean isOnline(String stationid){
      return sessesMap.containsKey(stationid);
   }
   
   /**    * 
    * @param devNo 根据设备编号发送数据
    * @param msg 要发送数据
    * @return 发送成功返回真
    */
   public boolean sendMsg(String devNo,List msg) {
      IoSession session = null;
      boolean bRes = false;
      synchronized(sessions) {
         if (sessesMap.containsKey(devNo)) {
            session = sessesMap.get(devNo);
            if (session.isConnected()) {
               for(int i=0;i<msg.size();i++){
                  session.write(IoBuffer.wrap((byte[])msg.get(i)));
               }
               bRes = true;
            }
         }
         if (!bRes) {
            logger.info(devNo + "设备没有连接!");
         } 
      }
      return bRes;
   }
   public void sessionClosed(IoSession session) {
      String address = session.getRemoteAddress().toString();      
      String devNo = (String) session.getAttribute("devNO");
      logger.info(devNo + "客户端：" + address + "已断开");
      BtnConnectClickService btn = null;
      btn = (BtnConnectClickService) SpringBeanLoader.getSpringBean("btnConnectClickService");
      Dto inDto = new BaseDto();
      inDto.put("report", address);//应该要用devNo去查询设备??
      Dto result = btn.refreshTree(inDto);
      if (result != null) {
         String repeaterid = result.getAsString("repeaterid");
         String stationid = result.getAsString("stationid");
         String statsubid=result.getAsString("statsubid");
         DMParamPush.getInstance().updateTreeNodeConnStatus(Constant.STATIONTYPE_STATION, stationid, statsubid,repeaterid);
         btn.clearPort(inDto);
      }      
      //sessions.remove(session);
      sessesMap.remove(devNo);
   }
   
   public void messageReceived(IoSession session, Object message) {
      logger.debug(message.toString());
      sessions.add(session);
      IoBuffer ioBuffer = (IoBuffer) message;
      byte[] b = new byte[ioBuffer.limit()];
      ioBuffer.get(b);
      AidParser parser=new AidParser();
      b=parser.enPressStr(b);
      String temp = StringUtils.byteToStr(b);
      logger.debug("客户端：" + session.getRemoteAddress().toString() + "接收到数据:" + temp);
      AbstractPack pack=analy.analy(temp);
      Handler handler=new Handler();
      handler.doHandler(pack, session, sessesMap,"1","");
   }
   
   public void exceptionCaught(IoSession session, Throwable cause) {
      logger.info(session.getRemoteAddress() + " 有问题:"+cause.getMessage());
      cause.printStackTrace();
      session.close();
   }
   public AbstractAnaly getAnaly() {
      return analy;
   }
   public void setAnaly(AbstractAnaly analy) {
      this.analy = analy;
   }
   

   
   
  
   
  
}
