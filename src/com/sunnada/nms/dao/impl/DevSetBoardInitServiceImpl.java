package com.sunnada.nms.dao.impl;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.DevSetBoardInitService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Aug 4, 2011 2:40:51 PM 
 * 监控板初始化 
 */
public class DevSetBoardInitServiceImpl extends BaseServiceImpl implements DevSetBoardInitService{
   /**
    * 从MonCode表获取paramCode
    * @param protype
    * @return
   */
   public String queryMonCodeForParamCode(Dto pDto) {
      String paramCode = (String) g4Dao.queryForObject("devSetBoardInit.queryMonCodeForParamCode", pDto);
      return paramCode;
   }
   
   /**
    * 查找checkprotype和repeaterId
    * @param dto
    * @return
    */
   public Dto checkProtypeDtoAndRePId(Dto dto) {
      Dto outDto = new BaseDto();
      outDto = (Dto)g4Dao.queryForObject("devSetBoardInit.checkProtypeDtoAndRePId", dto);
      return outDto;
   }

   public Dto deleteItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }

   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }

   public Dto queryItems(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }

   public Dto updateItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
}
