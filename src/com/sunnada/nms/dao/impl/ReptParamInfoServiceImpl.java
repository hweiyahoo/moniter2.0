package com.sunnada.nms.dao.impl; 

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.ReptParamInfo;

/** 
 * @author huangwei
 * @version 创建时间：Dec 21, 2011 3:49:16 PM 
 * 
 * 类说明 
 */
public class ReptParamInfoServiceImpl extends BaseServiceImpl implements ReptParamInfo {
   
   public List<Dto> getParamInfoByReptIDType(String reptId, String cmd) {
      Dto inDto = new BaseDto();
      inDto.put("repeaterid", reptId);
      inDto.put("paramclass", cmd);
      List ReptParamInfoList = g4Dao.queryForList("devicemnt.queryItemsForParamByStationId", inDto);
      return ReptParamInfoList;
   }
   
}
