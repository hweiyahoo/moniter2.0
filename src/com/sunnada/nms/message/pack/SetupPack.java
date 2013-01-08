
package com.sunnada.nms.message.pack; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-11-29 下午05:04:03 
 * 设置 
 */
public class SetupPack extends AbstractPack{
   private String paramclass;
   private String repeaterid;
   private String numPack;
   private String protype;
   private String respFlag;
   private String result;
   public String getRespFlag() {
      return respFlag;
   }
   public void setRespFlag(String respFlag) {
      this.respFlag = respFlag;
   }
   public String getResult() {
      return result;
   }
   public void setResult(String result) {
      this.result = result;
   }
   public String getParamclass() {
      return paramclass;
   }
   public void setParamclass(String paramclass) {
      this.paramclass = paramclass;
   }
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
   public String getProtype() {
      return protype;
   }
   public void setProtype(String protype) {
      this.protype = protype;
   }
 
}
