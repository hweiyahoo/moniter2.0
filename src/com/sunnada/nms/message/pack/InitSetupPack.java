
package com.sunnada.nms.message.pack; 
/** 
 * @author linxingyu
 * @version 创建时间：2012-1-11 上午11:36:37 
 * 类说明 
 */
public class InitSetupPack extends AbstractPack{
   private String packNum;
   private String setupStationid;
   private String setupStatsubid;
   private String telephone;
   private String respFlag;
   private String result;
   public String getPackNum() {
      return packNum;
   }
   public void setPackNum(String packNum) {
      this.packNum = packNum;
   }
   public String getSetupStationid() {
      return setupStationid;
   }
   public void setSetupStationid(String setupStationid) {
      this.setupStationid = setupStationid;
   }
   public String getSetupStatsubid() {
      return setupStatsubid;
   }
   public void setSetupStatsubid(String setupStatsubid) {
      this.setupStatsubid = setupStatsubid;
   }
   public String getTelephone() {
      return telephone;
   }
   public void setTelephone(String telephone) {
      this.telephone = telephone;
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
