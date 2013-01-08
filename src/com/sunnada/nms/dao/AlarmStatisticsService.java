package com.sunnada.nms.dao;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 26, 2011 3:59:27 PM 
 * 告警统计 服务接口 
 */
public interface AlarmStatisticsService extends BaseService,GeneralService{
   /**
    * 统计列表
    * @param pDto
    * @return
    * @throws SQLException 
    */
   public Dto queryStatisticsForList(Dto pDto) throws SQLException;
   
   /**
    * 统计图表
    * @param pDto
    * @return
    */
   public Dto queryStatisticsReportList(Dto pDto);
   /**
    * 监控量统计图表
    * @param pDto
    * @return
    */
   public Dto queryParamCodeReportList(Dto pDto);
}
