package com.sunnada.nms.util.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.Logger;

/**
 * @author linxingyu
 * @version 1.0 创建时间：2011-8-12 上午09:17:58 Socket服务监听器
 */
public class ServerSocketListener implements ServletContextListener {
   String                aString = null;
   private static Logger logger = Logger.getLogger(ServerSocketListener.class);
   
   // ModemService modemService;
   
   public void contextDestroyed(ServletContextEvent arg0) {
      logger.info("Stocket服务已停止");
      // modemService.stopService();
      // PooledConnectHandler.run = false;
      //      
   }
   
   public void contextInitialized(ServletContextEvent arg0) {
      // String port = arg0.getServletContext().getInitParameter("socketPort");
      // String maxConcent =
      // arg0.getServletContext().getInitParameter("maxConcent");
      // String serial = arg0.getServletContext().getInitParameter("serial");
      //      
      // System.out.println("STOCKET服务正在启动，端口号:" + port + "最大连接数：" +
      // maxConcent);
      // aString = "STOCKET服务正在启动，端口号:" + port + "最大连接数：" + maxConcent;
      // logger.info(aString);
      // new MinaServer(Integer.parseInt(port));
      // System.out.println("++++ Socket服务已经启动完毕 ++++");
      //      
      // System.out.println("启动加入接受队列线程");
      // ReceiveThread thread = new ReceiveThread();
      // AnalysisThread analysisThread = new AnalysisThread();
      // SendThread sendThread = new SendThread();
      // thread.start();
      // analysisThread.start();
      // sendThread.start();
      //      
      /*
       * System.out.println("开始启动短信猫服务,默认连接串口"+serial); modemService=new
       * ModemService(); modemService.startService(serial); ModemReciveThread
       * modemReciveThread=new ModemReciveThread(); modemReciveThread.start();
       * ModemSendThread modemSendThread=new ModemSendThread();
       * modemSendThread.start();
       */

   }
   
}
