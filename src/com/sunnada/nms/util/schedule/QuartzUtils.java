package com.sunnada.nms.util.schedule;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.JobListener;
import org.quartz.Matcher;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleTrigger;
import org.quartz.Trigger;
import org.quartz.impl.StdSchedulerFactory;
import org.quartz.impl.matchers.KeyMatcher;

import com.sunnada.nms.util.CommSerialUtil;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.DateTimeUtils;

/**
 * @author huangwei
 * @version 创建时间：Aug 4, 2011 3:07:42 PM
 * 
 * 把DateTime转为quartz中特有额的cron时间表达式
 */
public class QuartzUtils {
   
   private static Log logger = LogFactory.getLog(QuartzUtils.class);
   
   /*
    * 
    * 字段 允许值 允许的特殊字符 秒 0-59 , - * / 分 0-59 , - * / 小时 0-23 , - * / 日期 1-31 , - * ? /
    * L W C 月份 1-12 或者 JAN-DEC , - * / 星期 1-7 或者 SUN-SAT , - * ? / L C # 年（可选）
    * 留空, 1970-2099 , - * /
    */
   public static String convertDate2CronExp(String dateTime) {
      Calendar cd = DateTimeUtils.parseCalendarFormat(dateTime);
      /**
       * 2011-08-05 13:09:09 ---cronExp--> "09 09 13 5 8 ? *"
       * 忽略年份设置，页面js已经处理，只能选择大于当天的日志做任务调度日期。而且每个任务调度的时效性比较特殊，目前忽略年份可行！！！
       */
      int year, week, month, day, hour, min, sec;
      year = cd.get(Calendar.YEAR);
      week = cd.get(Calendar.DAY_OF_WEEK);
      month = cd.get(Calendar.MONTH) + 1;
      day = cd.get(Calendar.DAY_OF_MONTH);
      hour = cd.get(Calendar.HOUR_OF_DAY);
      min = cd.get(Calendar.MINUTE);// test
      sec = cd.get(Calendar.SECOND);
      StringBuffer cronEx = new StringBuffer();
      cronEx.append(sec).append(" ");
      cronEx.append(min).append(" ");
      cronEx.append(hour).append(" ");
      cronEx.append(day).append(" ");
      cronEx.append(month).append(" ");
      cronEx.append("?").append(" ");
      cronEx.append("*");
      
      logger.info(cronEx);
      
      return cronEx.toString();
   }
   
   @SuppressWarnings("unchecked")
   public static void updateTrigger(String datetime) throws SchedulerException, ParseException {
      Scheduler scheduler = (Scheduler) SpringBeanLoader.getSpringBean("scheduler");
      // schedule a job to run immediately
      JobDetail jobDetail = newJob(JobForPoll.class).withIdentity(Constant.POLL_SCHEDULE_NAME, Constant.POLL_SCHEDULE_GROUP).build();
      // Set up the listener
      JobListener listener = new PollListener();
      Matcher<JobKey> matcher = KeyMatcher.keyEquals(jobDetail.getKey());
      scheduler.getListenerManager().addJobListener(listener, matcher);
      Trigger cronTrigger = (CronTrigger) newTrigger().withIdentity(Constant.POLL_SCHEDULE_TRIGGER, Constant.POLL_SCHEDULE_GROUP).withSchedule(cronSchedule(convertDate2CronExp(DateTimeUtils.getDateSecondFormat()))).build();
      // schedule the job to run
      scheduler.scheduleJob(jobDetail, cronTrigger);
      scheduler.start();
   }
   
   /**
    * 移除 任务调度
    * 
    * @return
    * @throws SchedulerException
    */
   public static boolean stopJobForPoll(String pollployid) throws SchedulerException {
      Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();
      // JobKey jobKey = (JobKey)new Key("com1Job","poll");
      JobKey jobKey = new JobKey(Constant.POLL_SCHEDULE_NAME + "_" + pollployid, Constant.POLL_SCHEDULE_GROUP);
      if (scheduler.checkExists(jobKey)) {
         scheduler.deleteJob(jobKey);
         logger.info(Constant.POLL_SCHEDULE_NAME + "_" + pollployid + " ---->>>> 任务已经被移除");
      }
      // scheduler.clear();
      return true;
   }
   
   /**
    * 启动 任务调度
    * 
    * @param className
    *           任务类class
    * @param begintime
    *           开始时间
    * @param repeatCount
    *           重复几次(repeatCount-1次)
    * @param intervalInMin
    *           间隔时间(分钟)
    * @throws SchedulerException
    * @throws ParseException
    */
   public static void startJobForPoll(Class className, String pollployid, Date begintime, int repeatCount, int intervalInMin) throws SchedulerException, ParseException {
      if (begintime == null)
         begintime = new Date();
      logger.info("***开始时间：" + begintime);
      logger.info("***时间间隔：" + intervalInMin + " 分钟");
      logger.info("***轮询次数：" + repeatCount + " 次");
      Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();
      JobDetail jobDetail = newJob(className).withIdentity(Constant.POLL_SCHEDULE_NAME + "_" + pollployid, Constant.POLL_SCHEDULE_GROUP).build();
      SimpleTrigger trigger = newTrigger().withIdentity(Constant.POLL_SCHEDULE_TRIGGER + "_" + pollployid, Constant.POLL_SCHEDULE_GROUP).startAt(begintime).withSchedule(simpleSchedule().withRepeatCount(repeatCount - 1).withIntervalInMinutes(intervalInMin)).build();
      scheduler.scheduleJob(jobDetail, trigger);
      scheduler.start();
   }
   
   public static void startJobForOnlineCheck(Class className, Date begintime, int intervalInMin) throws SchedulerException, ParseException {
      if (begintime == null)
         begintime = new Date();
      logger.info("***开始时间：" + begintime);
      logger.info("***时间间隔：" + intervalInMin + " 分钟");
      // logger.info("***轮询次数：" + repeatCount + " 次");
      Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();
      JobDetail jobDetail = newJob(className).withIdentity(Constant.POLL_SCHEDULE_NAME_ONLINEC, Constant.POLL_SCHEDULE_GROUP_ONLINEC).build();
      SimpleTrigger trigger = newTrigger().withIdentity(Constant.POLL_SCHEDULE_TRIGGER_ONLINEC, Constant.POLL_SCHEDULE_GROUP_ONLINEC).startAt(begintime).withSchedule(simpleSchedule().repeatMinutelyForever().withIntervalInMinutes(intervalInMin)).build();
      scheduler.scheduleJob(jobDetail, trigger);
      scheduler.start();
   }
   
   /*
    * public static boolean validationOfPort(String port){ String[] ports =
    * CommSerialUtil.getSerialPortsToArray(); for (int i = 0; i < ports.length;
    * i++) { if(port.equals(ports[i])){ return true; } } return false; }
    */

}
