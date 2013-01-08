
package com.sunnada.nms.message.pack; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-11-29 下午04:33:55 
 * 主动告警 
 */
public class AlarmPack extends AbstractPack {
   private String repeaterid;
   private String numPack;
   public String getRepeaterid() {
      return repeaterid;
   }
   public void setRepeaterid(String repeaterid) {
      this.repeaterid = repeaterid;
   }
   public String getNumPack() {
      return numPack;
   }
   public void setNumPack(String numPack) {
      this.numPack = numPack;
   }
   
}
