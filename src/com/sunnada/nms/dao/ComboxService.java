package com.sunnada.nms.dao; 

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

/** 
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:36:14 PM 
 * 
 * 公共下拉框 服务类接口
 */
public interface ComboxService extends BaseService{
   
   /**
    * 下拉框
    * @param pDto
    * @param cbxName
    * @return
    */
   public Dto loadComboxValue(Dto pDto);
}
