package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.AlarmStatisticsService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 26, 2011 4:02:47 PM 
 * 告警统计 服务实现类 
 */
public class AlarmStatisticsServiceImpl extends BaseServiceImpl implements AlarmStatisticsService {
   
   public Dto deleteItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   /**
    * 告警统计查询
    * @throws SQLException 
    */
   public Dto queryItems(Dto dto) throws SQLException {
      // TODO Auto-generated method stub
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("alarmStatistics.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("alarmStatistics.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      outDto.put("codeList", codeList);
      outDto.put("totalCount", totalCount);
      return outDto;
   }
   
   public Dto updateItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 统计列表
    * @param pDto
    * @return
    * @throws SQLException 
    */
   public Dto queryStatisticsForList(Dto pDto) throws SQLException {
      // TODO Auto-generated method stub
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("alarmStatistics.queryStatisticsForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("alarmStatistics.queryStatisticsCountList", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }

   public Dto queryStatisticsReportList(Dto pDto) {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("alarmStatistics.queryStatisticsReportList", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(codeList));
      return outDto;
   }

   public Dto queryParamCodeReportList(Dto pDto) {
      // TODO Auto-generated method stub
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("alarmStatistics.queryParamCodeReportList", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(codeList));
      return outDto;
   }
   
}
