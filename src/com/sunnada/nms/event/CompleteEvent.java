
package com.sunnada.nms.event; 

import java.util.Map;

/** 
 * @author linxingyu
 * @version 创建时间：2011-10-24 上午09:25:10 
 * 完整包事件
 */
public class CompleteEvent extends BaseEvent{
   
   private Map result;

   public CompleteEvent(Object source) {
      super(source);
   }
   
   public CompleteEvent(Object source,Map result){
      super(source);
      this.result=result;
   }

   /**
    * 
    */
   private static final long serialVersionUID = 1L;

   public Map getResult() {
      return result;
   }

   public void setResult(Map result) {
      this.result = result;
   }
   
}
