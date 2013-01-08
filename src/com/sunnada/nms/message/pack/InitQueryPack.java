
package com.sunnada.nms.message.pack; 
/** 
 * @author linxingyu
 * @version 创建时间：2012-1-10 下午02:19:47 
 * 监控板初始化查询 
 */
public class InitQueryPack extends AbstractPack{
   private String packNum;
   private String telephone;
   private String queryStationid;
   private String queryStatsubid;
   private String respFlag;
   private String result;
   
   public String getQueryStationid() {
      return queryStationid;
   }

   public void setQueryStationid(String queryStationid) {
      this.queryStationid = queryStationid;
   }

   public String getQueryStatsubid() {
      return queryStatsubid;
   }

   public void setQueryStatsubid(String queryStatsubid) {
      this.queryStatsubid = queryStatsubid;
   }

   public String getPackNum() {
      return packNum;
   }

   public void setPackNum(String packNum) {
      this.packNum = packNum;
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
