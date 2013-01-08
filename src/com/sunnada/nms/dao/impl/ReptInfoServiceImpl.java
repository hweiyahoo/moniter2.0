package com.sunnada.nms.dao.impl;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.ReptInfo;

/**
 * @author huangwei
 * @version 创建时间：Dec 21, 2011 1:36:05 PM
 * 
 * 类说明
 */
public class ReptInfoServiceImpl extends BaseServiceImpl implements ReptInfo {
   
   public Dto getReptInfoById(String reptID) {
      Dto inDto = new BaseDto();
      inDto.put("repeaterid", reptID);
      Dto ReptInfoDto = (Dto) g4Dao.queryForObject("devicemnt.getReptInfo", inDto);
      return ReptInfoDto;
   }
   
   public Dto getReptInfoByStatInfo(String stationID, String statSubId) {
      Dto inDto = new BaseDto();
      inDto.put("stationid", stationID);
      inDto.put("statsubid", statSubId);
      Dto ReptInfoDto = (Dto) g4Dao.queryForObject("devicemnt.queryItemsForStationList", inDto);
      return ReptInfoDto;
   }
   
}
