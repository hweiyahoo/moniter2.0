package com.sunnada.nms.util.sys;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.util.StringUtils;

/**
 * @author huangwei
 * @version 创建时间：Sep 26, 2011 3:16:50 PM
 * 
 * 通告处理类
 */
public class LoadNoticeTools {
   private static Logger logger = Logger.getLogger(LoadNoticeTools.class);
   
   /**
    * 调用存储过程， 加载登录用户未读取的通告信息！
    * 
    * @param inDto
    */
   public static void loadNotice(Dto inDto) {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      g4Dao.callPrc("loadNoticeProc", inDto);
   }
   
   /**
    * 更新通告接收表中
    * 
    * @param inDto
    */
   public static void updateReceFornewNotice(Dto inDto) {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      g4Dao.callPrc("newNoticeForM34Proc", inDto);
   }
   
   /**
    * 分组统计登录用户所有通告类型的未读通告个数！
    * 
    * @param inDto
    *           [userid]
    */
   public static List<Dto> statsNoticeUnread(Dto inDto) {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      List<Dto> dtoList = g4Dao.queryForList("notice.statsUnReadByUserid", inDto);
      return dtoList;
   }
   
   /**
    * 统计当前登录用户的未处理的告警信息个数
    * 
    * @param inDto
    *           [deptid]
    * @return
    */
   public static int statsAlarmForUser(Dto inDto) {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      String deptid = inDto.getAsString("deptid");
      Dto pDto = StringUtils.formatDMDeptidForNms(deptid);
      Integer undoCount = (Integer) g4Dao.queryForObject("alarmLog.statsUnDoAlarmForUserSite", pDto);
      return undoCount;
   }
   
   /**
    * 统计系统所有的提示信息
    * 
    * @param inDto
    *           [userid,deptid]
    * @return
    */
   public static List<Dto> statsAllNoticeUnread(Dto inDto) {
      // 站内短信、公告
      List<Dto> noticeList = LoadNoticeTools.statsNoticeUnread(inDto);
      
      String accept = inDto.getAsString("accept");
      if ("1".equals(accept)) {
         // 告警信息
         int count = LoadNoticeTools.statsAlarmForUser(inDto);
         if (count > 0) {
            Dto alarmDto = new BaseDto();
            alarmDto.put("user_id", inDto.getAsString("userid"));
            alarmDto.put("type_id", "1");
            alarmDto.put("type_name", "告警");
            alarmDto.put("type_code", "alarm");
            alarmDto.put("stats", count);
            if (noticeList == null) {
               noticeList = new ArrayList();
            }
            noticeList.add(alarmDto);
         }
         // 开站上报
         
         // 巡检上报
         
         // 维修上报
      }
      return noticeList;
   }
   
}
