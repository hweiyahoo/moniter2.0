package com.sunnada.nms.dao;

import java.sql.SQLException;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/**
 * @author huangwei
 * @version 创建时间：Dec 26, 2011 10:22:20 AM
 * 
 * 标签服务接口
 */
public interface MemoService extends BaseService, GeneralService {
   
   public Dto loadComboboxVal(Dto dto) throws SQLException;
   
}
