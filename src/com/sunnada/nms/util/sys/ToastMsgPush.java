package com.sunnada.nms.util.sys; 

import com.sunnada.nms.dwrcomet.web.ToastMessagePush;

/** 
 * @author huangwei
 * @version 创建时间：Sep 8, 2011 8:43:27 AM 
 * 
 * 类说明 
 */
public class ToastMsgPush extends ToastMessagePush{
   private ToastMsgPush(){
   }
   private static ToastMsgPush instance;
   public static ToastMsgPush getInstance(){
      if(instance==null){
         instance = new ToastMsgPush();
      }
      return instance;
   }
   
   public static void main(String[] args) {
      // ToastMsgPush.getInstance().sendBySite(province, city, msg, changeMsgIcon);
   }
}
