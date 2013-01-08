
package com.sunnada.nms.util; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-11-8 下午02:45:16 
 * 指令推送辅助类 
 */
public class InstructionBean {
   private String sessionId;
   private String statsubid;
   private String stationid;
   private String cmd;
   private String flag;//0发，1收
   private String result;// 00,01,02
   private String reason;
   private String type;
   private String hearAlarm="0";//1心跳，2告警
   
   public String getSessionId() {
      return sessionId;
   }
   public void setSessionId(String sessionId) {
      this.sessionId = sessionId;
   }
   public String getStatsubid() {
      return statsubid;
   }
   public void setStatsubid(String statsubid) {
      this.statsubid = statsubid;
   }
   public String getResult() {
      return result;
   }
   public void setResult(String result) {
      this.result = result;
   }
   public String getReason() {
      return reason;
   }
   public void setReason(String reason) {
      this.reason = reason;
   }
   public String getType() {
      return type;
   }
   public void setType(String type) {
      this.type = type;
   }
   public String getCmd() {
      return cmd;
   }
   public void setCmd(String cmd) {
      cmd= cmd.toUpperCase();
      if(cmd.startsWith("21")&&cmd.endsWith("21")){
         cmd="!"+cmd.substring(2,cmd.length()-2)+"!";
      }
      if(cmd.startsWith("7E")&&cmd.endsWith("7E")){
         cmd="~"+cmd.substring(2,cmd.length()-2)+"~";
      }
      this.cmd=cmd.toUpperCase();
   }
   public String getFlag() {
      return flag;
   }
   public void setFlag(String flag) {
      this.flag = flag;
   }
   public String getHearAlarm() {
      return hearAlarm;
   }
   public void setHearAlarm(String hearAlarm) {
      this.hearAlarm = hearAlarm;
   }
   public String getStationid() {
      return stationid;
   }
   public void setStationid(String stationid) {
      this.stationid = stationid;
   }
}
