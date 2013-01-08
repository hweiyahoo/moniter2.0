
package com.sunnada.nms.message.pack; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-11-29 下午05:06:27 
 * 读取监控列表 
 */
public class ParamListPack extends AbstractPack{
   private String count;      //查询总数
   private String num;        //当前查询数
   private String respFlag; 
   private String result;
   private String numPack;
   private String repeaterid;
   public String getRepeaterid() {
      return repeaterid;
   }
   public void setRepeaterid(String repeaterid) {
      this.repeaterid = repeaterid;
   }
   public String getResult() {
      return result;
   }
   public void setResult(String result) {
      this.result = result;
   }
   public String getCount() {
      return count;
   }
   public void setCount(String count) {
      this.count = count;
   }
   public String getNum() {
      return num;
   }
   public void setNum(String num) {
      this.num = num;
   }
   public String getRespFlag() {
      return respFlag;
   }
   public void setRespFlag(String respFlag) {
      this.respFlag = respFlag;
   }
   public String getNumPack() {
      return numPack;
   }
   public void setNumPack(String numPack) {
      this.numPack = numPack;
   }
   
}
