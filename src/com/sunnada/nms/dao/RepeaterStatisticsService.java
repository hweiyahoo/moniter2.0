package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 28, 2011 9:06:37 AM 
 * 直放站统计 服务接口
 */
public interface RepeaterStatisticsService extends BaseService,GeneralService{
   /**
    * 按协议类型统计图表数据
    * @param pDto
    * @return
    */
   public Dto queryStatisticsReportList(Dto pDto);
   
   /**
    * 按设备类型统计图表数据
    * @param pDto
    * @return
    */
   public Dto queryDeviceReportList(Dto pDto);
}
