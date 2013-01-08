package com.sunnada.nms.dao;

import java.sql.SQLException;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Aug 2, 2011 9:39:02 AM 
 * 告警情况 服务接口 
 */
public interface AlarmStateService extends BaseService,GeneralService{
   /**
    * 查询一般告警列表
    * @param dto
    * @return
    * @throws SQLException 
    */
   public Dto queryGeneralItems(Dto dto) throws SQLException;
   /**
    * 告警简要
    * @param dto
    * @return
    */
   public Dto queryAlarmConcise(Dto dto);
   /**
    * 告警详细
    * @param dto
    * @return
    */
   public Dto queryAlarmDetail(Dto dto);
}
