package com.sunnada.nms.socket2;

/**
 * @author linxingyu
 * @version 创建时间：2011-10-18 上午10:16:26 TCP 服务启动类
 * modified by zhangys 2011/12/12
 */
public class MinaStart {
   
   public static void tcpStart() {
      MinaServer serv = MinaServer.getMinaServer();
      serv.startSvc();
   }
   
   public static void tcpStop() {
      //PooledConnectHandler.run = false;
   }
}
