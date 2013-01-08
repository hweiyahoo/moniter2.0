package com.sunnada.nms.dao;

import java.util.List;

import org.eredlab.g4.ccl.datastructure.Dto;

public interface ReptParamInfo {
   /**
    * 获取指定站点的监控量参数
    * 
    * @param sReptId
    *           站点主键
    * @param sCmd
    *           参数类型
    * @return
    */
   public List<Dto> getParamInfoByReptIDType(String sReptId, String sCmd);
}
