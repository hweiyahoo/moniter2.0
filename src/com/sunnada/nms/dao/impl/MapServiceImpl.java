package com.sunnada.nms.dao.impl;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.MapService;

/**
 * @author huangwei
 * @version 创建时间：Oct 20, 2011 4:34:28 PM
 * 
 * 更新位子信息 实现类
 */
public class MapServiceImpl extends BaseServiceImpl implements MapService {
   
   public Dto saveSitePointInfo(Dto pDto) {
      Dto outDto = new BaseDto();
      g4Dao.update("map.updateSitePointInfo", pDto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "经纬度信息设置成功！");
      return outDto;
   }
   
   public Dto saveStationPointInfo(Dto pDto) {
      Dto outDto = new BaseDto();
      g4Dao.update("map.updateStationPointInfo", pDto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "经纬度信息设置成功！");
      return outDto;
   }
   
}
