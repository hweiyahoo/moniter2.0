package com.sunnada.nms.message.engine;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;

/**
 * @author huangwei
 * @version 创建时间：Nov 25, 2011 11:50:30 AM
 * 
 * 类说明
 */
public interface SocketFactory {
   public ServerSocket createServerSocket(int port, int backlog, InetAddress bindAddr) throws IOException;
}
