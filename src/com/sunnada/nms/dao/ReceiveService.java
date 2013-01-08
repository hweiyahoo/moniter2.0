package com.sunnada.nms.dao;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Sep 22, 2011 9:05:56 AM 
 * 类说明 
 */
public interface ReceiveService extends BaseService,GeneralService{
   
   public Dto showNotice(Dto pDto);
   
}
