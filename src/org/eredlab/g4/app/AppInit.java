package org.eredlab.g4.app;

import javax.servlet.ServletContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.ccl.util.G4Constants;

import com.sunnada.nms.modem2.ModemStart;
import com.sunnada.nms.socket2.MinaStart;
import com.sunnada.nms.util.BizContext;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.schedule.OnlieThreadInit;
import com.sunnada.nms.util.schedule.PollJobInit;
import com.sunnada.nms.util.sys.InitBusinessParams;

/**
 * @author huangwei
 * @version 创建时间：Aug 8, 2011 11:02:31 AM
 * 
 * 业务系统中需要启动程序时候处理的一些初始化工作和停止工作
 */
public class AppInit {
   private static Log log = LogFactory.getLog(AppInit.class);
   
   public static boolean AppInitStartup(ServletContext servletContext) {
      boolean success = true;
      BizContext.initialized(servletContext);
      PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.APP);
      String minaRun = pHelper.getValue("minaServerRun", Constant.MINA_N);
      String modomRun = pHelper.getValue("modemServiceRun", Constant.MODEM_N);
      String pollJobRun = pHelper.getValue("pollJobInit", Constant.RUNMODE_OFF);
      String onlieThreadRun = pHelper.getValue("onlieThreadInit", Constant.RUNMODE_OFF);
      String loadCommSerialParsms = pHelper.getValue("loadCommSerialParsms", Constant.RUNMODE_OFF);
      String initBusinessDataFromDB = pHelper.getValue("initBusinessDataFromDB", Constant.RUNMODE_OFF);
      try {
         if (initBusinessDataFromDB.equalsIgnoreCase(Constant.RUNMODE_ON)) {
            log.info("初始化业务系统数据...");
            // 系统启动，初始化相关基表数据，在开发过程中，没用到初始化操作的的开发人员暂时不用开启这个服务。
            InitBusinessParams.initBusinessDataFromDB();
            log.info("初始化业务系统数据完毕...");
         }
         if (minaRun.equalsIgnoreCase(Constant.MINA_Y)) {
            log.info("系统正在启动[ TCP ]连接...");
            MinaStart.tcpStart();
            log.info("系统启动[ TCP ]连接完毕...");
         }
         if (modomRun.equalsIgnoreCase(Constant.MODEM_Y)) {
            log.info("系统正在启动[ MODEM ]连接...");
            ModemStart.start();
            log.info("系统启动[ MODEM ]连接完毕...");
         }
         if (pollJobRun.equalsIgnoreCase(Constant.RUNMODE_ON)) {
            log.info("系统正在启动[ 检查是否需要加载轮询 ]任务...");
            PollJobInit.addJobToScheduleAtSysInit(servletContext);
            log.info("系统启动[ 检查是否需要加载轮询 ]任务完毕...");
         }
         if (onlieThreadRun.equalsIgnoreCase(Constant.RUNMODE_ON)) {
            log.info("系统正在启动[ 加载掉线检查 ]任务...");
            OnlieThreadInit.addJobToSchedule(servletContext);
            log.info("系统启动[ 加载掉线检查 ]任务完毕...");
         }
         if (loadCommSerialParsms.equalsIgnoreCase(Constant.RUNMODE_ON)) {
            log.info("系统正在启动[ 加载业务系统基础参数COMM ]任务...");
            InitBusinessParams.loadCommSerialParsms(servletContext);
            log.info("系统启动[ 加载业务系统基础参数COMM ]任务完毕...");
         }
      }
      catch (Exception e) {
         log.error("业务系统初始化失败.");
         log.error(G4Constants.Exception_Head + "初始化业务系统发生错误,请仔细检查您的配置文件喔!\n" + e.getMessage());
         e.printStackTrace();
         System.exit(0);
      }
      
      return success;
   }
   
   public static boolean AppInitShutdown() {
      boolean success = true;
      
      PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.APP);
      String minaRun = pHelper.getValue("minaServerRun", Constant.MINA_N);
      String modomRun = pHelper.getValue("modemServiceRun", Constant.MODEM_N);
      try {
         if (minaRun.equalsIgnoreCase(Constant.MINA_Y)) {
            log.info("系统正在停止[ TCP ]连接...");
            MinaStart.tcpStop();
            log.info("系统停止[ TCP ]连接完毕...");
         }
         if (modomRun.equalsIgnoreCase(Constant.MODEM_Y)) {
            log.info("系统正在停止[ MODEM ]连接...");
            ModemStart.stop();
            log.info("系统停止[ MODEM ]连接完毕...");
         }
      }
      catch (Exception e) {
         log.error("业务系统初始化任务停止失败.");
         log.error(G4Constants.Exception_Head + "停止初始化业务系统发生错误,请仔细检查您的配置文件喔!\n" + e.getMessage());
         e.printStackTrace();
         System.exit(0);
      }
      return success;
      
   }
}
