package com.sunnada.nms.util.schedule;

/**
 * @author huangwei
 * @version 创建时间：Aug 8, 2011 6:15:57 PM
 * 
 * 类说明
 */
public class PollPloyContext {
   private boolean isShutUp;     // 是否启动
   private boolean isShutDown;   // 是否停止
   private String  communicaname; // 通讯名称
   private int     repeatCount;  // 重复次数
   private int     intervalInMin; // 间隔时间
   private String  begintime;    // 开始时间
   private String  pollployname; // 轮询策略
   private String  protype;      // 协议类型
   private String  devicetype;    // 设备类型
   private String  moncodeids;    // 监控量参数
                                  
   public boolean isShutUp() {
      return isShutUp;
   }
   
   public void setShutUp(boolean isShutUp) {
      this.isShutUp = isShutUp;
   }
   
   public boolean isShutDown() {
      return isShutDown;
   }
   
   public void setShutDown(boolean isShutDown) {
      this.isShutDown = isShutDown;
   }
   
   public String getCommunicaname() {
      return communicaname;
   }
   
   public void setCommunicaname(String communicaname) {
      this.communicaname = communicaname;
   }
   
   public int getRepeatCount() {
      return repeatCount;
   }
   
   public void setRepeatCount(int repeatCount) {
      this.repeatCount = repeatCount;
   }
   
   public int getIntervalInMin() {
      return intervalInMin;
   }
   
   public void setIntervalInMin(int intervalInMin) {
      this.intervalInMin = intervalInMin;
   }
   
   public String getBegintime() {
      return begintime;
   }
   
   public void setBegintime(String begintime) {
      this.begintime = begintime;
   }
   
   public String getPollployname() {
      return pollployname;
   }
   
   public void setPollployname(String pollployname) {
      this.pollployname = pollployname;
   }
   
   public String getProtype() {
      return protype;
   }

   public void setProtype(String protype) {
      this.protype = protype;
   }

   public String getDevicetype() {
      return devicetype;
   }

   public void setDevicetype(String devicetype) {
      this.devicetype = devicetype;
   }

   public String getMoncodeids() {
      return moncodeids;
   }

   public void setMoncodeids(String moncodeids) {
      this.moncodeids = moncodeids;
   }

   @Override
   public String toString() {
      StringBuffer sb = new StringBuffer();
      sb.append("*********************************************").append("\r\n");
      sb.append("轮询策略名称").append(pollployname).append("\r\n");
      sb.append("协议类型").append(protype).append("\r\n");
      sb.append("设备类型").append(devicetype).append("\r\n");
      sb.append("监控量参数id").append(moncodeids).append("\r\n");
      sb.append("策略是否启动").append(isShutDown).append("\r\n");
      sb.append("策略是否停止").append(isShutUp).append("\r\n");
      sb.append("策略通讯名称").append(communicaname).append("\r\n");
      sb.append("策略重复次数").append(repeatCount).append("\r\n");
      sb.append("策略间隔时间").append(intervalInMin).append("\r\n");
      sb.append("策略开始时间").append(begintime).append("\r\n");
      return sb.toString();
   }
   
}
