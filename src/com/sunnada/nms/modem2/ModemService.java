package com.sunnada.nms.modem2;

import java.util.List;

import org.apache.log4j.Logger;
import org.smslib.OutboundMessage;
import org.smslib.Service;
import org.smslib.modem.SerialModemGateway;

/**
 * @author  
 * @version 创建时间：2012-12-9 
 * desc 猫服务类
 */
public class ModemService {
   private static Service      serv = Service.getInstance();
   private static ModemService   modemServ = new ModemService();
   private SerialModemGateway  gateway;
   private InboundMsgNotification inboundNotification;
   private OutboundMsgNotification outboundNotification;
   private boolean       connected  = false;
   private static Logger       logger = Logger.getLogger(ModemService.class);
   public static boolean flag;
   
   private ModemService() {      
   }
   public static ModemService getModemService() {
      return modemServ;
   }
   public void startService(String serial) {
      if (connected) {
         logger.info("猫服务已经启动...");
         return;
      }         
      gateway = new SerialModemGateway("SMS", serial, 9600, "GSM", "");
      gateway.setInbound(true);
      gateway.setOutbound(true);
      inboundNotification = new InboundMsgNotification();
      outboundNotification = new OutboundMsgNotification();
      try {
         serv.addGateway(gateway);
         serv.setInboundMessageNotification(inboundNotification);
         serv.setOutboundMessageNotification(outboundNotification);
         serv.startService();
         connected = true;
         logger.info("猫服务启动成功");
      }
      catch (Exception e) {
         e.printStackTrace();
      }
   }
   
   public void stopService() {
      if (! connected) {
         logger.info("猫服务已经停止...");
         return;
      }
      try {         
         gateway.stopGateway();
         serv.removeGateway(gateway);
         serv.stopService();
         connected = false;
      }
      catch (Exception e) {
         e.printStackTrace();
      }
   }
   
   public boolean sendSms(String telephone, String message) {// 发送短信，前提是猫服务要开启
      OutboundMessage msg = new OutboundMessage(telephone, message);
      
      //msg.setEncoding(MessageEncodings.ENCCUSTOM);
      try {
         //serv.sendMessage(msg);
         serv.queueMessage(msg);//no block send msg
         logger.info("发送短信" + message);
      }
      catch (Exception e) {
         e.printStackTrace();
         return false;
      }
      return true;
   }
   public boolean isConnected() {
      return flag;
   }

}
