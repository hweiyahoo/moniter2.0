package com.sunnada.nms.message.bean;

import java.io.Serializable;

/**
 * @author huangwei
 * @version 创建时间：Nov 25, 2011 11:00:27 AM
 * 
 * 报文抽象主类
 */
public abstract class AbstractMessage implements Serializable {
   protected String protocol; // 当前使用的网络协议
   protected String sender;  // 发送方标识
                            
   public String getProtocol() {
      return protocol;
   }
   
   public void setProtocol(String protocol) {
      this.protocol = protocol;
   }
   
   public String getSender() {
      return sender;
   }
   
   public void setSender(String sender) {
      this.sender = sender;
   }

}
