package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.RepeaterStatisticsService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 28, 2011 9:08:36 AM 
 * 直放站统计 服务实现类 
 */
public class RepeaterStatisticsServiceImpl extends BaseServiceImpl implements RepeaterStatisticsService {
   
   public Dto deleteItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 直放站统计查询
    * @throws SQLException 
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("repeaterStatistics.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("repeaterStatistics.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      outDto.put("codeList", codeList);
      outDto.put("totalCount", totalCount);
      return outDto;
   }
   
   public Dto updateItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }

   public Dto queryStatisticsReportList(Dto pDto) {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("repeaterStatistics.queryStatisticsReportList", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(codeList));
      return outDto;
   }

   public Dto queryDeviceReportList(Dto pDto) {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("repeaterStatistics.queryDeviceReportList", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(codeList));
      return outDto;
   }
   
}
