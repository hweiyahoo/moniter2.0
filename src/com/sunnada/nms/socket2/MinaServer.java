package com.sunnada.nms.socket2; 

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.mina.transport.socket.SocketAcceptor;
import org.apache.mina.transport.socket.nio.NioDatagramAcceptor;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;
import org.eredlab.g4.app.AppInit;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;

import com.sunnada.nms.message.analysisbag.SCDMAAnaly;
import com.sunnada.nms.util.Constant;

/** 
 * @author linxingyu
 * @version 创建时间：2011-8-12 下午02:28:57 
 * mina主类 
 */
public class MinaServer {
   private SocketAcceptor tcpServ;   
   private NioDatagramAcceptor udpServ; 
   private MinaServerHandler tcpServHandler;
   private boolean connected = false;
   private static MinaServer minaServ = new MinaServer();
   private static Log log = LogFactory.getLog(AppInit.class);
   public static MinaServer getMinaServer() {
      return minaServ;
   }
   public void stopSvc() {
      connected = false;
   }
   public boolean sendMsg(String devNo,List msg) {
      return tcpServHandler.sendMsg(devNo, msg);
   }
   
   public boolean isOnline(String stationid){
      return tcpServHandler.isOnline(stationid);
   }
   public void startSvc() {
      if (isConnected()) {
         log.info("服务已经启动");
         return;
      }
      PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.APP);
      String portStr = pHelper.getValue("socketPort",Constant.MINA_N);
      String gsmr=pHelper.getValue("GSM-RsocketPort",Constant.MINA_N);
      int port=Integer.parseInt(portStr);
      int gsmrPort=Integer.parseInt(gsmr);
      tcpServ=new NioSocketAcceptor();
      udpServ=new NioDatagramAcceptor();
      tcpServHandler = new MinaServerHandler();
      tcpServHandler.setAnaly(new SCDMAAnaly());
      tcpServ.setHandler(tcpServHandler);
      tcpServ.setBacklog(1500);
      udpServ.setHandler(tcpServHandler);
      log.info("开始监听");
      try {
         tcpServ.bind(new InetSocketAddress(port));
         log.info("TCP连接已开");
         udpServ.bind(new InetSocketAddress(port));
         log.info("UDP连接已开");
         connected = true;
      }
      catch (IOException e) {
         e.printStackTrace();
      }      
   }
   
   private MinaServer(){
   }
   /**
    * @return the connected
    */
   public boolean isConnected() {
      return connected;
   }

}
