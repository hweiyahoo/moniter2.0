
package com.sunnada.nms.dao; 

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 28, 2011 2:58:55 AM 
 * 通讯参数服务接口 
 * 
 * 
 */
public interface ComConfigService extends BaseService{
   
   // 设置通讯参数后，执行某些操作
   public Dto setCommInfo(Dto inDto);
   
   public Dto queryCommInfo(Dto pDto);
}
