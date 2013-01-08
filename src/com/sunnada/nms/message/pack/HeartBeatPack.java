
package com.sunnada.nms.message.pack; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-11-29 下午04:13:33 
 * 心跳包
 */
public class HeartBeatPack extends AbstractPack{
   protected String numPack;

   public String getNumPack() {
      return numPack;
   }

   public void setNumPack(String numPack) {
      this.numPack = numPack;
   }
}
