
package com.sunnada.nms.event; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-10-26 上午11:49:23 
 * 接收到任何数据 都触发此事件 
 */
public class ReceiveEvent extends BaseEvent{
   
   private String key;

   public ReceiveEvent(Object source) {
      super(source);
      // TODO Auto-generated constructor stub
   }
   
   public ReceiveEvent(Object source,String key){
      super(source);
      this.key=key;
   }

   /**
    * 
    */
   private static final long serialVersionUID = 1L;
   
   
}
