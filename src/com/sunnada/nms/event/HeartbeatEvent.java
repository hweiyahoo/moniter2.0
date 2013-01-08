
package com.sunnada.nms.event; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-10-24 上午09:16:56 
 * 心跳包事件 
 */
public class HeartbeatEvent extends BaseEvent{
   
   public enum formName{
      hearbeat,login
   }
   
   

   private String stationId;
   private String statsubId;
   private formName form;       //心跳包或登陆包

   
   public HeartbeatEvent(Object source){
      super(source);
   }
   
   public HeartbeatEvent(Object source,String stationId,String statsubId,formName form) {
      super(source);
      this.stationId=stationId;
      this.statsubId=statsubId;
      this.form=form;
   }

   /**
    * 
    */
   private static final long serialVersionUID = 1L;

   public String getStationId() {
      return stationId;
   }

   public void setStationId(String stationId) {
      this.stationId = stationId;
   }

   public String getStatsubId() {
      return statsubId;
   }

   public void setStatsubId(String statsubId) {
      this.statsubId = statsubId;
   }

   public formName getForm() {
      return form;
   }

   public void setForm(formName form) {
      this.form = form;
   }
   
}
