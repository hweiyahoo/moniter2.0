package com.sunnada.nms.dao.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.dao.UpdateService;

/**
 * @author linxingyu
 * @version 创建时间：2011-8-15 下午04:09:49 类说明
 */
public class UpdateServiceImpl extends BaseServiceImpl implements UpdateService {
   
   public List queryParam(Dto dto) {
      List list = g4Dao.queryForList("update.queryParam", dto);
      return list;
   }
   
   public void updateParam(Dto dto) {
      g4Dao.update("update.updateParam", dto);
   }
   
   public void deleteParam(Dto dto) {
      g4Dao.delete("update.deleteParam", dto);
   }
   
   public void insertParam(Dto dto) {
      g4Dao.insert("update.insertParam", dto);
   }
   
   public void insertAlarm(Dto dto) {
      g4Dao.insert("update.alarm", dto);
   }
   
   public int judge(Dto dto) {
      Object obj = g4Dao.queryForObject("update.query", dto);
      if (obj == null)
         return 0;// 不存在未处理的告警，则需要新增
      else
         return Integer.parseInt(obj.toString());// 存在未处理的告警，返回id 修改告警时间
         
   }
   
   public void modify(Dto dto) {
      g4Dao.update("update.modifyTime", dto);
   }
   
   public void updateInfo(Dto dto) {
      g4Dao.update("update.updateInfo", dto);
   }
   
   public void modifyAlarm(Dto dto) {
      g4Dao.update("update.updateAlarm", dto);
   }
   
}
