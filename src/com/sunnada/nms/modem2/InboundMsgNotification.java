package com.sunnada.nms.modem2;

import org.apache.log4j.Logger;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.smslib.AGateway;
import org.smslib.IInboundMessageNotification;
import org.smslib.InboundMessage;
import org.smslib.Message.MessageTypes;

import com.sunnada.nms.dao.ComDataService;

/**
 * @author linxingyu
 * @version 创建时间：2011-9-15 下午01:43:52 短信监听器
 */
public class InboundMsgNotification implements IInboundMessageNotification {
   private static Logger logger = Logger.getLogger(InboundMsgNotification.class);
   private ComDataService cdService = (ComDataService) SpringBeanLoader.getSpringBean("ComDataService");
   
   public void process(AGateway arg0, MessageTypes arg1, InboundMessage arg2) {
      System.out.println("收到发来的短信"+arg2.getText());
      if (arg1 == MessageTypes.INBOUND) {
         logger.info("收到发来的短信"+arg2.getText());
         String message = arg2.getText();
         if (message.startsWith("!") && message.endsWith("!")) {// 符合要求的短信
            Dto dto=new BaseDto();
            dto.put("com", "modem");
            dto.put("cmddetail", message);
            dto.put("flag","1");
            cdService.insertItem(dto);
            //message = message.replaceAll("!", "21");
            //message = message + "+" + arg2.getOriginator();
            //SmsPool.addSms(message);      
            new DealRecvSms(message,arg0.getFrom()).start();
         }
      }
      else if (arg1 == MessageTypes.STATUSREPORT) {
         logger.info("收到回执短信"+arg0);
      }
      try {
         arg0.deleteMessage(arg2);
      }
      catch (Exception e) {
         e.printStackTrace();
      }
   }
   
}
