
package com.sunnada.nms.dao; 

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author linxingyu
 * @version 创建时间：2011-10-14 上午10:06:17 
 * 告警屏蔽service 
 */
public interface ShieldService extends BaseService,GeneralService{
   public void shield(Dto dto);
}
