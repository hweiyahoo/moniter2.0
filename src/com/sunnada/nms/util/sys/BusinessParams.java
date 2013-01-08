package com.sunnada.nms.util.sys; 

import com.sunnada.nms.comm.serial.SerialParameters;
import com.sunnada.nms.util.schedule.PollPloyContext;

/** 
 * @author huangwei
 * @version 创建时间：Aug 11, 2011 9:39:41 AM 
 * 
 * 类说明 
 */
public class BusinessParams {
   private PollPloyContext  ppc;
   private SerialParameters sp;
   private String isQueryDP;
   
   public PollPloyContext getPpc() {
      return ppc;
   }
   public void setPpc(PollPloyContext ppc) {
      this.ppc = ppc;
   }
   public SerialParameters getSp() {
      return sp;
   }
   public void setSp(SerialParameters sp) {
      this.sp = sp;
   }
   public String getIsQueryDP() {
      return isQueryDP;
   }
   public void setIsQueryDP(String isQueryDP) {
      this.isQueryDP = isQueryDP;
   }
}
