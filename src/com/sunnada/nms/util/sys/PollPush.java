package com.sunnada.nms.util.sys;

import com.sunnada.nms.dwrcomet.web.PollployPush;

/**
 * @author huangwei
 * @version 创建时间：Sep 8, 2011 8:43:27 AM
 * 
 * 类说明
 */
public class PollPush extends PollployPush {
   private PollPush() {
   }
   
   private static PollPush instance;
   
   public static PollPush getInstance() {
      if (instance == null) {
         instance = new PollPush();
      }
      return instance;
   }
   
   public static void main(String[] args) {
      // ToastMsgPush.getInstance().sendBySite(province, city, msg,
      // changeMsgIcon);
   }
}
