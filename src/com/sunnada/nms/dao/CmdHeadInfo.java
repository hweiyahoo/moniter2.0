package com.sunnada.nms.dao;

import java.util.List;

import org.eredlab.g4.ccl.datastructure.Dto;

public interface CmdHeadInfo {
   
   /**
    * 获取指定协议的命令头
    * 
    * @param sProType
    *           协议类型
    * @return
    */
   public List<Dto> getByProtype(String sProType);
}
