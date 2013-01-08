package com.sunnada.nms.dao.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.BtnConnectClickService;
import com.sunnada.nms.util.DateTimeUtils;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Aug 5, 2011 9:55:03 AM 
 * 类说明 
 */
public class BtnConnectClickServiceImpl extends BaseServiceImpl implements BtnConnectClickService{
   /**
    * 连接成功更新站点信息
    * @param dto
    * @return
    */
   public Dto connBtnConfirm(Dto dto) {
      Dto outDto = new BaseDto();
      g4Dao.update("btnConnectClick.connBtnConfirm", dto);
      dto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "连接成功！");
      return outDto;
   }
   
   /**
    * 查询要连接的站点与子站信息
    * @param dto
    * @return
    */
   public Dto queryStationInfo(Dto dto) {
      Dto outDto = new BaseDto();
      outDto = (Dto)g4Dao.queryForObject("btnConnectClick.queryStationInfo", dto);
      return outDto;
   }
   
   /**
    * 连接成功更新站点连接标识
    * @param dto
    * @return
    */
   public Dto upConnectFlag(Dto dto) {
      Dto outDto = new BaseDto();
      g4Dao.update("btnConnectClick.upConnectFlag", dto);
      dto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "连接成功！");
      return outDto;
   }

   public Dto queryPort(Dto dto) {
     Dto outDto=new BaseDto();
     Object object=g4Dao.queryForObject("btnConnectClick.queryPort",dto);
     outDto.put("port", object);
     return outDto;
   }

   public Dto clearPort(Dto dto) {
      g4Dao.update("btnConnectClick.clearPort",dto);
      Dto outDto=new BaseDto();
      return outDto;
   }

   public Dto clearFlag(Dto dto) {
     g4Dao.update("btnConnectClick.clearFlag",dto);
     return null;
   }

   public Dto refreshTree(Dto dto) {
      Dto result=(Dto)g4Dao.queryForObject("btnConnectClick.refreshTree",dto);
      return result;
   }

   public String queryStattel(Dto dto) {
      return (String)g4Dao.queryForObject("btnConnectClick.queryTel", dto);
   }
}
