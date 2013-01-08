package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Sep 20, 2011 10:06:44 AM 
 * 公告管理服务接口
 */
public interface NoticeService extends BaseService,GeneralService {
   /**
    * 获取选中人员数据
    */
   public Dto queryCheckedStore(Dto pDto);
   /**
    * 获取未选中人员数据
    */
   public Dto queryNoCheckedStore(Dto pDto);
   /**
    * 获取选中角色数据
    */
   public Dto queryCheckedRoleStore(Dto pDto);
   /**
    * 获取未选中角色数据
    */
   public Dto queryNoCheckedRoleStore(Dto pDto);
   
   /**
    * 发送给全部用户 
    */
   public Dto insertAllUserItem(Dto pDto);
   
   /**
    * 更新发送给全部用户 
    */
   public Dto updateAllUserItem(Dto pDto);
}
