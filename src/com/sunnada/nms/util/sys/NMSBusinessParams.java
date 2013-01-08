package com.sunnada.nms.util.sys;

import javax.servlet.ServletContext;

import com.sunnada.nms.comm.serial.SerialParameters;
import com.sunnada.nms.util.Constant;

/**
 * @author huangwei
 * @version 创建时间：Aug 11, 2011 11:00:49 AM
 * 
 * 获取nms系统级别的参数
 */
public class NMSBusinessParams {
   /**
    * 获取通讯参数
    * @param servletContext
    * @return
    */
   public static SerialParameters getSerialParameters(ServletContext servletContext) {
      BusinessParams bp = (BusinessParams) servletContext.getAttribute(Constant.BUSINESS_PARAMS);
      return bp.getSp();
   }
   
   /**
    * 获取查询监控参数状态
    * @param servletContext
    * @return 0：未查询；1：正在查询；2：查询完毕
    */
   public static String getQueryDPStatus(ServletContext servletContext) {
      BusinessParams bp = (BusinessParams) servletContext.getAttribute(Constant.BUSINESS_PARAMS);
      return bp.getIsQueryDP();
   }
   
   /**
    * 更新查询监控参数状态
    * @param servletContext
    * @param status 0：未查询；1：正在查询；2：查询完毕
    */
   public static void setQueryDPStatus(ServletContext servletContext,String status) {
      BusinessParams bp = (BusinessParams) servletContext.getAttribute(Constant.BUSINESS_PARAMS);
      bp.setIsQueryDP(status);
      servletContext.removeAttribute(Constant.BUSINESS_PARAMS);
      servletContext.setAttribute(Constant.BUSINESS_PARAMS, bp);
   }
}
