package com.sunnada.nms.util.schedule;

import org.apache.log4j.Logger;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.JobListener;

/**
 * @author huangwei
 * @version 创建时间：Aug 5, 2011 10:06:01 AM
 * 
 * 轮询任务调度 监控类
 */
public class PollListener implements JobListener {
   private static Logger logger  = Logger.getLogger(PollListener.class);
   String                aString = null;
   
   public String getName() {
      return "this is poll Job schedule Listener";
   }
   
   public void jobExecutionVetoed(JobExecutionContext arg0) {
      logger.info("========  Job is Vetoed!");
      
   }
   
   public void jobToBeExecuted(JobExecutionContext arg0) {
      logger.info("========  Job is to be Executed!");
   }
   
   public void jobWasExecuted(JobExecutionContext inContext, JobExecutionException inException) {
      JobKey jobKey = inContext.getJobDetail().getKey();
      logger.info("========  " + jobKey + " Job is Executed!");
   }
}
