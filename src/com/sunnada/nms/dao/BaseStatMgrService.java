
package com.sunnada.nms.dao; 

import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 25, 2011 9:11:24 AM 
 * 类说明 
 */
public interface BaseStatMgrService extends BaseService,GeneralService{
   
   // 导入Excel数据到数据库
   public Dto importFromExcel(List fileData);
}
