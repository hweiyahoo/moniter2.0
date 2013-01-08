package com.sunnada.nms.util;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.comm.CommPortIdentifier;
import javax.comm.NoSuchPortException;
import javax.comm.PortInUseException;
import javax.comm.SerialPort;

import org.apache.log4j.Logger;

import com.sunnada.nms.comm.serial.SerialParameters;

/**
 * @author huangwei
 * @version 创建时间：Aug 8, 2011 9:34:52 AM
 * 
 * comm serial 工具类
 */
public class CommSerialUtil {
   private static Logger logger = Logger.getLogger(CommSerialUtil.class);
   public static SerialPort sPort;
   public static SerialParameters parameters;
   public static int        timeout = 3000;
   /**
    * 获取硬件已经开发的comm名称
    * 
    * @return
    */
   public static String getSerialPortsToString() {
      CommPortIdentifier portId;
      StringBuffer portInfos = new StringBuffer();
      Enumeration en = CommPortIdentifier.getPortIdentifiers();
      while (en.hasMoreElements()) {
         portId = (CommPortIdentifier) en.nextElement();
         /* 如果端口类型是串口，则打印出其端口信息 */
         if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) {
            portInfos.append(",").append(portId.getName());
         }
      }
      String portInfo = portInfos.length()>0?portInfos.substring(1):"未检查到串口!";
      return portInfo;
   }
   
   public static String[] getSerialPortsToArray() {
      CommPortIdentifier portId;
      StringBuffer portInfos = new StringBuffer();
      Enumeration en = CommPortIdentifier.getPortIdentifiers();
      while (en.hasMoreElements()) {
         portId = (CommPortIdentifier) en.nextElement();
         /* 如果端口类型是串口，则打印出其端口信息 */
         if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) {
            portInfos.append(",").append(portId.getName());
         }
      }
      String portInfo = portInfos.length()>0?portInfos.substring(1):"";
      if(portInfos.length()<=0){
         logger.info("未检查到串口!");
      }
      return portInfo.split(",");
   }
   
   public static List getSerialPortsToList() {
      CommPortIdentifier portId;
      List ports = new ArrayList();
      Map map = null;
      Enumeration en = CommPortIdentifier.getPortIdentifiers();
      while (en.hasMoreElements()) {
         portId = (CommPortIdentifier) en.nextElement();
         /* 如果端口类型是串口，则打印出其端口信息 */
         if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) {
            map = new HashMap();
            map.put("value", portId.getName());
            map.put("text", portId.getName());
            ports.add(map);
         }
      }
      return ports;
   }
   
   /**
    * 获取选择连接的comm接口的参数
    * 
    * @param port
    * @return
    */
   public static SerialParameters getSerialParameters(String port) {
      if (!StringUtils.isEmpty(port)) {
         try {
            CommPortIdentifier portId = CommPortIdentifier.getPortIdentifier(port);
            logger.info("***串口是否已经被开启："+portId.isCurrentlyOwned());
            if (!portId.isCurrentlyOwned()) {
               sPort = (SerialPort) portId.open(port, timeout);
               parameters = new SerialParameters();
               parameters.setPortName(sPort.getName());
               parameters.setBaudRate(sPort.getBaudRate());
               // parameters.setFlowControlIn(flowControlIn);
               // parameters.setFlowControlOut(flowControlOut);
               parameters.setDatabits(sPort.getDataBits());
               parameters.setStopbits(sPort.getStopBits());
               parameters.setParity(sPort.getParity());
            }
         }
         catch (NoSuchPortException e) {
            parameters = null;
            e.printStackTrace();
         }
         catch (PortInUseException e) {
            parameters = null;
            e.printStackTrace();
         }
      }
      return parameters;
   }
   
   public static void main(String[] args) {
      logger.info("设备开放的com口数据：" + CommSerialUtil.getSerialPortsToList());
      // String port = CommSerialUtil.getSerialPortsToString();
      // SerialParameters sp = CommSerialUtil.getSerialParameters(port);
      // System.out.println("设备开放的com口数据参数*****************************：");
      // System.out.println("getPortName " + sp.getPortName());
      // System.out.println("getBaudRateString " + sp.getBaudRateString());
      // System.out.println("getDatabitsString " + sp.getDatabitsString());
      // System.out.println("getFlowControlInString " +
      // sp.getFlowControlInString());
      // System.out.println("getFlowControlOutString " +
      // sp.getFlowControlOutString());
      // System.out.println("getParityString " + sp.getParityString());
      // System.out.println("getStopbitsString " + sp.getStopbitsString());
   }
}
