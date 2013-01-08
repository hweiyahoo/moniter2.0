
package com.sunnada.nms.event; 

import java.util.EventListener;

/** 
 * @author linxingyu
 * @version 创建时间：2011-10-24 上午09:50:20 
 * 事件监听器，由每个人根据自己需要实现 
 */
public interface Listener extends EventListener{
   public abstract void perform(BaseEvent e);
}
