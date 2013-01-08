package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Aug 2, 2011 3:38:44 PM 
 * 告警日志 服务接口 
 */
public interface AlarmLogService extends BaseService,GeneralService{
   /**
    * 更新flag
    * @param dto
    * @return
    */
   public Dto updateFlag(Dto dto);
}
