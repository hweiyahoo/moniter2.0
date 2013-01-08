
package com.sunnada.nms.message.pack; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-11-29 下午05:03:05 
 * 查询命令 
 */
public class QueryPack extends AbstractPack{
   private String paramclass;
   private String protype;
   private String repeaterid;
   private String packNum;
   private String respFlag; 
   private String result;
   

   public String getParamclass() {
      return paramclass;
   }

   public void setParamclass(String paramclass) {
      this.paramclass = paramclass;
   }

   public String getProtype() {
      return protype;
   }

   public void setProtype(String protype) {
      this.protype = protype;
   }

   public String getRepeaterid() {
      return repeaterid;
   }

   public void setRepeaterid(String repeaterid) {
      this.repeaterid = repeaterid;
   }

   public String getPackNum() {
      return packNum;
   }

   public void setPackNum(String packNum) {
      this.packNum = packNum;
   }

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
   
}
