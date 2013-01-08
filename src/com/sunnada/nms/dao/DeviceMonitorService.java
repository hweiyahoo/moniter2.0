package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 28, 2011 1:47:27 PM 
 * 轮询报表 服务接口
 */
public interface DeviceMonitorService extends BaseService{
   
   public Dto updateParam(Dto pDto);
   
}
