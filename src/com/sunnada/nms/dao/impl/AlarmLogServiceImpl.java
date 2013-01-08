package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.AlarmLogService;
import com.sunnada.nms.util.DateTimeUtils;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Aug 2, 2011 3:39:42 PM 告警日志 服务实现类
 */
public class AlarmLogServiceImpl extends BaseServiceImpl implements AlarmLogService {
   
   public Dto deleteItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("alarmLog.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("alarmLog.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /**
    * 更新flag
    * 
    * @param pDto
    * @return
    */
   public Dto updateFlag(Dto pDto) {
      Dto outDto = new BaseDto();
      String[] alarmid = pDto.getAsString("alarmid").split(",");
      for (int i = 0; i < alarmid.length; i++) {
         try {
            pDto.put("alarmid", alarmid[i]);
            g4Dao.update("alarmLog.updateFlag", pDto);
            
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "设置成功！");
      return outDto;
   }
   
   public Dto updateItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
}
