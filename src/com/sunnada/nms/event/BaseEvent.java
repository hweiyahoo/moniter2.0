
package com.sunnada.nms.event; 

import java.util.EventObject;

/** 
 * @author linxingyu
 * @version 创建时间：2011-10-24 上午09:04:44 
 * 基础事件类
 */
public class BaseEvent extends EventObject{
   
   public enum channel{
      network,modem,serial
   }
   
   private channel channelcode;

   public BaseEvent(Object source) {
      super(source);
   }

   /**
    * 
    */
   private static final long serialVersionUID = 1L;

   public channel getChannelcode() {
      return channelcode;
   }

   public void setChannelcode(channel channelcode) {
      this.channelcode = channelcode;
   }
   
}
