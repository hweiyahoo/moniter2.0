package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.AlarmStateService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Aug 2, 2011 9:40:09 AM 
 * 告警情况 服务实现类 
 */
public class AlarmStateServiceImpl extends BaseServiceImpl implements AlarmStateService {
   
   public Dto deleteItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 查询严重和重要告警列表
    * @throws SQLException 
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("alarmState.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("alarmState.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      outDto.put("codeList", codeList);
      outDto.put("totalCount", totalCount);
      return outDto;
   }
   
   
   /**
    * 查询一般警列表
    * @throws SQLException 
    */
   public Dto queryGeneralItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("alarmState.queryItemForGeneralList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("alarmState.queryItemForGeneralCount", dto);
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
    * 告警简要
    */
   public Dto queryAlarmConcise(Dto dto) {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("alarmState.queryAlarmConciseForList", dto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(codeList));
      return outDto;
   }
   /**
    * 告警详细
    */
   public Dto queryAlarmDetail(Dto dto) {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("alarmState.queryAlarmDetailForList", dto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(codeList));
      return outDto;
   }
   
}
