package com.sunnada.nms.util;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

/**
 * @author huangwei
 * @version 创建时间：Jan 4, 2012 3:15:12 PM
 * 
 * 类说明
 */
public class BizContext {
   private static ServletContext servletContext = null;
   
   public static void initialized(HttpServletRequest request) {
      if (servletContext == null) {
         servletContext = request.getSession().getServletContext();
      }
   }
   
   public static void initialized(ServletContext servletContext_) {
      if (servletContext == null) {
         servletContext = servletContext_;
      }
   }
   
   public static ServletContext getServletContext() {
      return servletContext;
   }
   
   public static void setPollBeginTime(String time, String pollid) {
      servletContext.setAttribute(pollid + Constant.POLLBEGINTIME, time);
   }
   
   public static String getPollBeginTime(String pollid) {
      String beginTime = String.valueOf(servletContext.getAttribute(pollid + Constant.POLLBEGINTIME));
      return beginTime;
   }
   
   public static void removePollBeginTime(String pollid) {
      servletContext.removeAttribute(pollid + Constant.POLLBEGINTIME);
   }
}
