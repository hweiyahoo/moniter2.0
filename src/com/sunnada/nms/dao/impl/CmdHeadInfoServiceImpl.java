package com.sunnada.nms.dao.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.CmdHeadInfo;

/**
 * @author huangwei
 * @version 创建时间：Dec 21, 2011 1:56:08 PM
 * 
 * 类说明
 */
public class CmdHeadInfoServiceImpl extends BaseServiceImpl implements CmdHeadInfo {
   
   public List<Dto> getByProtype(String proType) {
      Dto inDto = new BaseDto();
      inDto.put("protype", proType);
      List ReptInfoList = g4Dao.queryForList("cmdtitle.queryCmdHeadList", inDto);
      return ReptInfoList;
   }
   
}
