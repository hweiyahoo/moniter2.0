package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 28, 2011 1:47:27 PM 轮询报表 服务接口
 */
public interface RepeaterCheckService extends BaseService, GeneralService {
   public Dto getPollName();
   
   public Dto getRepeaterName(Dto dto);
   
   public Dto getBeginStore(Dto dto);
   
   public Dto getEndStore(Dto dto);
   
}
