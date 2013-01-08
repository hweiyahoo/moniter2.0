package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Aug 4, 2011 2:39:20 PM 
 * 监控板初始化 
 */
public interface DevSetBoardInitService extends BaseService, GeneralService {
   /**
    * 从MonCode表获取paramCode
    * @param pDto
    * @return
    */
   public String queryMonCodeForParamCode(Dto pDto);
   /**
    * 查找checkprotype和repeaterId
    * @param dto
    * @return
    */
   public Dto checkProtypeDtoAndRePId(Dto dto);
}
