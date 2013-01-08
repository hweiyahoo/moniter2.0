package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:36:14 PM
 * 
 * 站点位子信息保存
 */
public interface MapService extends BaseService {
   
   public Dto saveSitePointInfo(Dto pDto);
   
   public Dto saveStationPointInfo(Dto pDto);
   
}
