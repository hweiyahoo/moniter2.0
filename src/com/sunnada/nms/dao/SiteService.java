package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 25, 2011 4:39:54 PM 
 * 地区编码 服务类接口
 */
public interface SiteService extends BaseService, GeneralService {
   /**
    * 获取城市数列表
    */
   public Dto queryTreeItems(Dto pDto);
   /**
    * 获取省份列表
    */
   public Dto queryProvinceList(Dto pDto);
}
