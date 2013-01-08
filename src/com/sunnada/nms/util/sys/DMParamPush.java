package com.sunnada.nms.util.sys; 

import com.sunnada.nms.dwrcomet.web.DeviceMonitorPush;

/** 
 * @author huangwei
 * @version 创建时间：Sep 8, 2011 8:43:27 AM 
 * 
 * 类说明 
 */
public class DMParamPush extends DeviceMonitorPush{
   private DMParamPush(){
   }
   private static DMParamPush instance;
   public static DMParamPush getInstance(){
      if(instance==null){
         instance = new DMParamPush();
      }
      return instance;
   }
   
   public static void main(String[] args) {
      // DMParamPush.getInstance().debugLogPanel(sessionId, msg);
   }
}
