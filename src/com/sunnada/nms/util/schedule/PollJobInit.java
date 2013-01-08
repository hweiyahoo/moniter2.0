package com.sunnada.nms.util.schedule;

import java.util.Date;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.util.DateTimeUtils;

/**
 * @author huangwei
 * @version 创建时间：Aug 8, 2011 11:56:36 AM
 * 
 * 轮询任务 加载
 */
public class PollJobInit {
   private static Log logger = LogFactory.getLog(PollJobInit.class);
   
   /**
    * 系统启动，加载需要轮询的任务。
    * 
    * @param servletContext
    * @return
    */
   public static boolean addJobToScheduleAtSysInit(ServletContext servletContext) {
      boolean success = true;
      logger.info("检查系统是否有需要添加的轮询任务...");
      try {
         IReader g4Reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
         Dto inDto = new BaseDto();
         inDto.put("flag", "1");
         inDto.put("pollbegintime", DateTimeUtils.getDateSecondFormat());
         Dto dto = (Dto) g4Reader.queryForObject("reqpollcfg.queryPollployForList", inDto);
         if (dto != null) {
            logger.info("发现有待轮询的任务!");
            int pollintervaltime = dto.getAsInteger("pollintervaltime");
            int polltimes = dto.getAsInteger("polltimes");
            String pollployid = dto.getAsString("pollployid");
            Date pollbegintime = DateTimeUtils.parseDateSecondFormat(dto.getAsString("pollbegintime"));
            // String comnunicaname = dto.getAsString("comnunicaname");
            logger.info("***策略名称：" + dto.getAsString("pollployname"));
            // if (!QuartzUtils.validationOfPort(comnunicaname)) {
            // logger.info("不能装配任务调度，系统发现，轮询策略中通讯串口【" + comnunicaname +
            // "】与硬件的串口不对!");
            // }
            // else {
            logger.info("装配任务调度，并启动...");
            QuartzUtils.stopJobForPoll(pollployid);
            QuartzUtils.startJobForPoll(JobForPoll.class, pollployid, pollbegintime, polltimes, pollintervaltime);
            // }
         }
         else {
            logger.info("未发现有待轮询的任务!");
         }
      }
      catch (Exception e) {
         success = false;
         logger.info("轮询任务加载失败!");
         e.printStackTrace();
      }
      return success;
   }
   
   public static boolean addJobForPollToSchedule(ServletContext servletContext) {
      boolean success = true;
      try {
         IReader g4Reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
         Dto inDto = new BaseDto();
         inDto.put("flag", "1");
         Dto dto = (Dto) g4Reader.queryForObject("reqpollcfg.queryPollployForList", inDto);
         if (dto != null) {
            int pollintervaltime = dto.getAsInteger("pollintervaltime");
            int polltimes = dto.getAsInteger("polltimes");
            String pollployid = dto.getAsString("pollployid");
            QuartzUtils.stopJobForPoll(pollployid);
            QuartzUtils.startJobForPoll(JobForPoll.class, pollployid, null, polltimes, pollintervaltime);// 马上启动
         }
         else {
            success = false;
         }
      }
      catch (Exception e) {
         success = false;
         e.printStackTrace();
      }
      return success;
   }
}
