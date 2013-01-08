package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Jul 25, 2011 2:46:23 PM 
 * 协议类型服务类接口 
 */
public interface ProTypeService extends BaseService, GeneralService {
   /**
    * 判断协议名称是否重复 lxy
    */
   public int judge(Dto dto);
}
