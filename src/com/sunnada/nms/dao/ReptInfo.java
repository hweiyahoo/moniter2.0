package com.sunnada.nms.dao;

import org.eredlab.g4.ccl.datastructure.Dto;

public interface ReptInfo {
   /**
    * 根据直放站站点主键 获取直放站信息
    * 
    * @param reptID
    *           直放站站点主键
    * @return
    */
   public Dto getReptInfoById(String reptID);
   
   /**
    * 根据直放站站点id和设备编号 获取直放站信息
    * 
    * @param stationID
    *           直放站站点id
    * @param statSubId
    *           设备编号
    * @return
    */
   public Dto getReptInfoByStatInfo(String stationID, String statSubId);
}
