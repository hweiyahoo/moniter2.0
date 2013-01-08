package com.sunnada.nms.dao;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/**
 * @author gezhidong E-mail: fengyu_hqu@sina.com
 * @version 创建时间：Jul 27, 2011 9:18:52 AM 代维人员
 */
public interface MaintainManService extends BaseService, GeneralService {
   
   // 导入Excel数据到数据库
   public Dto importFromExcel(List fileData);
   
}
