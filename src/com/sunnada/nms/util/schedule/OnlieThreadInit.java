package com.sunnada.nms.util.schedule;

import java.util.Date;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;

import com.sunnada.nms.util.Constant;

/**
 * @author huangwei
 * @version 创建时间：Aug 13, 2011 11:25:56 AM
 * 
 * 装配掉线检查线程
 */
public class OnlieThreadInit {
   private static Log logger = LogFactory.getLog(OnlieThreadInit.class);
   
   public static boolean addJobToSchedule(ServletContext servletContext) {
      boolean success = true;
      PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.APP);
      int intervalInMin = Integer.parseInt(pHelper.getValue("intervalInMin", "3"));
      logger.info("----------------------------");
      try {
         logger.info("任务调度开始装配掉线检查线程，即刻起，"+intervalInMin+"分钟后启动 OnlieThread!");
         QuartzUtils.startJobForOnlineCheck(OnlieThreadJob.class, new Date(), intervalInMin);
      }
      catch (Exception e) {
         success = false;
         logger.info("装配掉线检查线程加载失败!");
         e.printStackTrace();
      }
      return success;
   }
}
