package com.sunnada.nms.modem2;

import org.smslib.AGateway;
import org.smslib.IOutboundMessageNotification;
import org.smslib.OutboundMessage;

/**
 * @author zhangys
 * created Dec 12, 2011 all copyright reserved by sunnada 
 * desc 用于发送成功和失败的处理
 */
public class OutboundMsgNotification implements IOutboundMessageNotification {
   
   /* (non-Javadoc)
    * @see org.smslib.IOutboundMessageNotification#process(org.smslib.AGateway, org.smslib.OutboundMessage)
    */
   public void process(AGateway gateway, OutboundMessage outMsg) {
      // TODO Auto-generated method stub 发送成功和失败的处理
      
   }
   
}
