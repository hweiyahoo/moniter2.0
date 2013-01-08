package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.RepeaterCheckService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 28, 2011 1:48:16 PM 
 * 轮询报表 服务实现类 
 */
public class RepeaterCheckServiceImpl extends BaseServiceImpl implements RepeaterCheckService {
   
   public Dto deleteItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 轮询报表查询
    * @throws SQLException 
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("repeaterCheck.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("repeaterCheck.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      outDto.put("codeList", codeList);
      outDto.put("totalCount", totalCount);
      return outDto;
   }
   
   public Dto updateItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }

   public Dto getPollName() {
      Object obj=g4Dao.queryForList("repeaterCheck.pollName");
      String json=JsonHelper.encodeObject2Json(obj);
      Dto result=new BaseDto();
      result.put("json", json);
      return result;
   }

   public Dto getRepeaterName(Dto dto) {
      Object obj=g4Dao.queryForList("repeaterCheck.repeaterName",dto);
      String json=JsonHelper.encodeObject2Json(obj);
      Dto result=new BaseDto();
      result.put("json", json);
      return result;
   }

   public Dto getBeginStore(Dto dto) {
      Object obj=g4Dao.queryForList("repeaterCheck.repeaterBegintime",dto);
      String json=JsonHelper.encodeObject2Json(obj);
      Dto result=new BaseDto();
      result.put("json", json);
      return result;
   }

   public Dto getEndStore(Dto dto) {
      Object obj=g4Dao.queryForList("repeaterCheck.repeaterEndtime",dto);
      String json=JsonHelper.encodeObject2Json(obj);
      Dto result=new BaseDto();
      result.put("json", json);
      return result;
   }
   
}
