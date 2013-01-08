package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Aug 5, 2011 9:54:02 AM 
 * 类说明 
 */
public interface BtnConnectClickService extends BaseService{
   /**
    * 连接成功更新站点与子站信息
    * @param dto
    * @return
    */
   public Dto connBtnConfirm(Dto dto);
   /**
    * 查询要连接的站点信息
    * @param dto
    * @return
    */
   public Dto queryStationInfo(Dto dto);
   
   /**
    * 连接成功更新站点连接标识
    * @param dto
    * @return
    */
   public Dto upConnectFlag(Dto dto);
   
   /**
    * lxy 获取站点连接 port
    */
   public Dto  queryPort(Dto dto);
   
   /**
    * lxy 清除站点 port
    */
   public Dto clearPort(Dto dto);
   
   /**
    * lxy 清楚站点 connectflag
    */
   public Dto clearFlag(Dto dto);
   
   /**
    * lxy 掉线刷新站点
    */
   public Dto refreshTree(Dto dto);
   
   /**
    * lxy 获取站点连接 stattel
    */
   public String queryStattel(Dto dto);
   
}
