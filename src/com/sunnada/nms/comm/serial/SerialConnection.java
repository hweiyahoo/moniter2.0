package com.sunnada.nms.comm.serial;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.TooManyListenersException;

import javax.comm.CommPortIdentifier;
import javax.comm.CommPortOwnershipListener;
import javax.comm.NoSuchPortException;
import javax.comm.PortInUseException;
import javax.comm.SerialPort;
import javax.comm.SerialPortEvent;
import javax.comm.SerialPortEventListener;
import javax.comm.UnsupportedCommOperationException;

import org.apache.log4j.Logger;

import com.sunnada.nms.comm.serial.thread.ReciveThread;
import com.sunnada.nms.util.StringUtils;

/**
 * A class that handles the details of a serial connection. Reads from one
 * TextArea and writes to a second TextArea. Holds the state of the connection.
 */
public class SerialConnection implements SerialPortEventListener,
      CommPortOwnershipListener {
   private static Logger           logger     = Logger.getLogger(SerialConnection.class);
   // private TextArea messageAreaOut;
   // private TextArea messageAreaIn;
   private SerialParameters        parameters;
   public static OutputStream      os;
   public static InputStream       is;
   // private KeyHandler keyHandler;
   
   private CommPortIdentifier      portId;
   private SerialPort              sPort;
   
   private boolean                 open;
   
   private static SerialConnection connection = SerialConnection.getInstance();           // 单例
                                                                                          
   public String                   recvData   = "";
   private boolean                 analFlag;
   
   public static boolean           flag       = false;
   
   private ReciveThread            thread;                                                // 接收处理线程
                                                                                          
   /**
    * Creates a SerialConnection object and initilizes variables passed in as
    * params.
    * 
    * @param parent
    *           A SerialDemo object.
    * @param parameters
    *           A SerialParameters object.
    * @param messageAreaOut
    *           The TextArea that messages that are to be sent out of the serial
    *           port are entered into.
    * @param messageAreaIn
    *           The TextArea that messages comming into the serial port are
    *           displayed on.
    */
   public SerialConnection() {
      // this.parameters = parameters;
      open = false;
      recvData = "";
   }
   
   public static SerialConnection getInstance() {
      if (connection == null)
         return new SerialConnection();
      else
         return connection;
   }
   
   public void setSerialParameters(SerialParameters sp) {
      this.parameters = sp;
   }
   
   public static void setConnection(SerialConnection connection1) {
      connection = connection1;
   }
   
   /**
    * Attempts to open a serial connection and streams using the parameters in
    * the SerialParameters object. If it is unsuccesfull at any step it returns
    * the port to a closed state, throws a
    * <code>SerialConnectionException</code>, and returns.
    * 
    * Gives a timeout of 30 seconds on the portOpen to allow other applications
    * to reliquish the port if have it open and no longer need it.
    */
   public void openConnection() throws SerialConnectionException {
      
      // Obtain a CommPortIdentifier object for the port you want to open.
      try {
         portId = CommPortIdentifier.getPortIdentifier(parameters.getPortName());
      }
      catch (NoSuchPortException e) {
         throw new SerialConnectionException(e.getMessage());
      }
      
      // Open the port represented by the CommPortIdentifier object. Give
      // the open call a relatively long timeout of 30 seconds to allow
      // a different application to reliquish the port if the user
      // wants to.
      
      try {
         sPort = (SerialPort) portId.open("SerialDemo", 3000);
      }
      catch (PortInUseException e1) {
         // TODO Auto-generated catch block
         e1.printStackTrace();
      }
      
      try {
         sPort.setSerialPortParams(9600, SerialPort.DATABITS_8, SerialPort.STOPBITS_1,
               SerialPort.PARITY_NONE);
      }
      catch (UnsupportedCommOperationException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
      }
      
      try {
         os = sPort.getOutputStream();
         is = sPort.getInputStream();
      }
      catch (IOException e) {
         sPort.close();
         throw new SerialConnectionException("Error opening i/o streams");
      }
      try {
         sPort.addEventListener(this);
      }
      catch (TooManyListenersException e) {
         sPort.close();
         throw new SerialConnectionException("too many listeners added");
      }
      
      // Set notifyOnDataAvailable to true to allow event driven input.
      sPort.notifyOnDataAvailable(true);
      
      // Set notifyOnBreakInterrup to allow event driven break handling.
      sPort.notifyOnBreakInterrupt(true);
      
      // Set receive timeout to allow breaking out of polling loop during
      // input handling.
      // try {
      // sPort.enableReceiveTimeout(30);
      // }
      // catch (UnsupportedCommOperationException e) {
      // }
      
      // Add ownership listener to allow ownership event handling.
      // portId.addPortOwnershipListener(this);
      
      open = true;
      thread = new ReciveThread();
//      thread.start();
   }
   
   /**
    * Close the port and clean up associated elements.
    */
   public void closeConnection() {
      // If port is alread closed just return.
      if (!open) {
         return;
      }
      
      // Remove the key listener.
      
      // Check to make sure sPort has reference to avoid a NPE.
      if (sPort != null) {
         try {
            // close the i/o streams.
            os.close();
            is.close();
         }
         catch (IOException e) {
            // System.out.println(e);
            logger.info(e);
         }
         
         // Close the port.
         sPort.close();
         
         // Remove the ownership listener.
         portId.removePortOwnershipListener(this);
      }
      
      open = false;
      thread.stop = true;
   }
   
   /**
    * Send a one second break signal.
    */
   public void sendBreak() {
      sPort.sendBreak(1000);
   }
   
   /**
    * Reports the open status of the port.
    * 
    * @return true if port is open, false if port is closed.
    */
   public boolean isOpen() {
      return open;
   }
   
   /**
    * Handles SerialPortEvents. The two types of SerialPortEvents that this
    * program is registered to listen for are DATA_AVAILABLE and BI. During
    * DATA_AVAILABLE the port buffer is read until it is drained, when no more
    * data is availble and 30ms has passed the method returns. When a BI event
    * occurs the words BREAK RECEIVED are written to the messageAreaIn.
    */
   
   public void serialEvent(SerialPortEvent e) {
      // Create a StringBuffer and int to receive input data.
      StringBuffer inputBuffer = new StringBuffer();
      int newData = 0;
      
      // Determine type of event.
      switch (e.getEventType()) {
         
         // Read data until -1 is returned. If \r is received substitute
         // \n for correct newline handling.
         case SerialPortEvent.DATA_AVAILABLE:

            byte[] readBuffer = new byte[100];
            int numBytes = -1;
            
            try {
               while (is.available() > 0) {
                  numBytes = is.read(readBuffer);
                  recvData = recvData + StringUtils.byteToStr(readBuffer, numBytes);
               }
            }
            catch (IOException ex) {
            }
            // 接收完数据之后，处理
            thread.setRecvData(recvData);
            thread.run();
            recvData="";
            break;
         
         // If break event append BREAK RECEIVED message.
         case SerialPortEvent.BI:
            // messageAreaIn.append("\n--- BREAK RECEIVED ---\n");
      }
      
   }
   
   /**
    * Handles ownership events. If a PORT_OWNERSHIP_REQUESTED event is received
    * a dialog box is created asking the user if they are willing to give up the
    * port. No action is taken on other types of ownership events.
    */
   public void ownershipChange(int type) {
      if (type == CommPortOwnershipListener.PORT_OWNERSHIP_REQUESTED) {
         // PortRequestedDialog prd = new PortRequestedDialog(parent);
      }
   }
   
   public byte[] changeToBit(String srcStr) {
      // StringBuffer sbRes = new StringBuffer();
      String sTmp = "";
      int cnt = srcStr.length() / 2 - 1;
      int idx = 1;
      int k = 1;
      byte[] temp = new byte[cnt + 2];
      int temp1;
      temp1 = Integer.parseInt(srcStr.substring(0, 2), 16);
      temp[0] = (byte) temp1;
      for (; idx < cnt; idx++) {
         sTmp = "";
         sTmp += srcStr.charAt(idx * 2);
         sTmp += srcStr.charAt(idx * 2 + 1);
         if (sTmp.toUpperCase().equals("5E")) {
            // sbRes.append((char)Integer.parseInt("5E", 16));
            temp[k++] = (byte) Integer.parseInt("5E", 16);
            // sbRes.append((char)Integer.parseInt("5D", 16));
            temp[k++] = (byte) Integer.parseInt("5D", 16);
         }
         else if (sTmp.toUpperCase().equals("7E")) {
            // sbRes.append((char)Integer.parseInt("5E", 16));
            temp[k++] = (byte) Integer.parseInt("5E", 16);
            // sbRes.append((char)Integer.parseInt("7D", 16));
            temp[k++] = (byte) Integer.parseInt("7D", 16);
         }
         else {
            temp1 = Integer.parseInt(sTmp, 16);
            // sbRes.append((char)temp);
            temp[k++] = (byte) temp1;
         }
      }
      temp1 = Integer
            .parseInt(srcStr.substring(srcStr.length() - 2, srcStr.length()), 16);
      temp[k] = (byte) temp1;
      // temp[k]=(byte)srcStr.charAt(srcStr.length()-1);
      return temp;
   }
   
   public void sent2Port(String sendStr) {
      try {
         os.write(changeToBit(sendStr));
      }
      catch (IOException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
      }
   }
   
   public String getRecvData() {
      return recvData;
   }
   
   public void setRecvData(String recvData) {
      this.recvData = recvData;
   }
   
   public void SendCMD(byte[] dataByte) {
      try {
         os.write(dataByte);
      }
      catch (Exception e) {
         e.printStackTrace();
      }
   }
}
