
package com.sunnada.nms.message.pack; 

import java.util.Map;

import com.sunnada.nms.message.bean.AbstractMessage;

/** 
 * @author linxingyu
 * @version 创建时间：2011-11-29 下午03:40:52 
 * 各种类型包的抽象类 
 */
public class AbstractPack {
  
   protected String cmd;
   private Map               ddu;                                    // DDU数据
   private String stationid;
   private String statsubid;
   
   public String getCmd() {
      return cmd;
   }
   public void setCmd(String cmd) {
      this.cmd = cmd;
   }
   public Map getDdu() {
      return ddu;
   }
   public void setDdu(Map ddu) {
      this.ddu = ddu;
   }
   public String getStationid() {
      return stationid;
   }
   public void setStationid(String stationid) {
      this.stationid = stationid;
   }
   public String getStatsubid() {
      return statsubid;
   }
   public void setStatsubid(String statsubid) {
      this.statsubid = statsubid;
   }
}
