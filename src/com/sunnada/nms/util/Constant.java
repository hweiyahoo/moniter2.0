package com.sunnada.nms.util;

import java.util.HashMap;
import java.util.Map;

/**
 * @author 作者姓名 HuangWei
 * @version 创建时间：Jan 6, 2011 5:26:20 PM
 * 
 * 系统常量定义
 */
public class Constant {
   // 下拉框
   public final static String CBX_PROTOCOL           = "protocol";      // 协议类型
   public final static String CBX_DEVICETYPE         = "devicetype";    // 设备类型
   public final static String CBX_SITE               = "site";          // 地区
   public final static String CBX_BASETABLE          = "basetable";     // 数据字典
   public final static String CBX_NOTICEMODEL        = "noticemodel";   // 通告模式
   public final static String CBX_NOTICETYPE         = "noticetype";    // 通告类型
   public final static String CBX_DEPTUSER           = "deptuser";      // 部门用户
   public final static String CBX_DEPTROLE           = "deptrole";      // 部门角色
   // code,name
   // -->
   // value,text
   public final static String CBX_BASETABLE2         = "basetable2";    // 数据字典
   // code,code
   // -->
   // value,text
   public final static String CBX_EXCUTESQL          = "excutesql";     // 直接执行sql语句
   public final static String CBX_BASESTAT           = "basestat";      // basestat
   public final static String CBX_DEVICEBASE         = "devicebase";    // devicebase
                                                                         
   // 任务调度参数
   public final static String POLL_SCHEDULE_NAME     = "pollJobForPoll";
   public final static String POLL_SCHEDULE_TRIGGER  = "pollTriggerForPoll";
   public final static String POLL_SCHEDULE_GROUP    = "pollGroupForPoll";
   
   public final static String POLL_SCHEDULE_NAME_ONLINEC     = "pollJobForOnlineCheck";
   public final static String POLL_SCHEDULE_TRIGGER_ONLINEC  = "pollTriggerForOnlineCheck";
   public final static String POLL_SCHEDULE_GROUP_ONLINEC   = "pollGroupForOnlineCheck";
   
   // 业务系统 保存到application中的信息标识符
   public final static String BUSINESS_PARAMS        = "businessparams";
   
   // 设备监控树形菜单节点类型
   public final static String STATIONTYPE_STATION    = "station";       // 主站点
   public final static String STATIONTYPE_SUBSTATION = "substation";    // 从站点
   public final static String STATIONTYPE_NOTCLASS = "notclass|station";// 未分类站点
   
   public final static String DEPT_SYSORG            = "sysOrg";        // 系统机构，不会过滤直放站地区
   public final static String DEPT_DMORG             = "dmOrg";         // 直放站地区，会过滤直放站地区
                                                                         
   // socket runMode config
   public final static String MINA_Y                 = "1";             // tcp
   public final static String MINA_N                 = "0";
   
   public final static String MODEM_Y                = "1";             // modem
   public final static String MODEM_N                = "0";
   
   public final static String RUNMODE_ON             = "1";
   public final static String RUNMODE_OFF            = "0";
   
   public final static Map<String,InstructionBean> map=new HashMap<String, InstructionBean>();
   public final static String tcp="tcp/ip或GPRS";
   public final static String modem="modem";
   
   public final static String GSMRTcpHead="7C";
   
   public final static String tdOpen="'0002','0003','0004','0007','0008'";     //TD-SCDMA开站上报需要查询的监控量
   
   public enum proty{
      SCDMA,GSMR
   }
   
   // debugLogPanel Icon style
   public final static String LOG_ALARM_ICON = "alarm";
   public final static String LOG_ERROR_ICON = "error";
   public final static String LOG_DEBUG_ICON = "debug";
   public final static String LOG_INFO_ICON = "info";
   public final static String LOG_HEART_ICON = "heart";
   
   public static InstructionBean GetInstruction(String key){
      synchronized (map) {
         InstructionBean bean;
         bean=map.get(key);
         if(bean==null){
            bean=new InstructionBean();
         }
         return bean;
      }
   }
   
   public final static String POLLBEGINTIME = "_PollBeginTime";
}
