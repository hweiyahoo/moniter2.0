package com.sunnada.nms.dao;

import java.sql.SQLException;

import org.eredlab.g4.bmf.base.BaseService;

import org.eredlab.g4.ccl.datastructure.Dto;

/** 
 * @author 徐金妹  E-mail: xujinmei1717@sunnada.net;xujinmeiok@163.com 
 * @version 创建时间：Jul 29, 2011 5:17:20 PM 
 * 类说明 
 */
public interface UpdatedevicefileService extends BaseService{
   /**
    * 保存文件上传数据
    * 
    * @param pDto
    * @return
    */
   public Dto doUpload(Dto pDto);
   
   /**
    * 查询
    * @param pDto
    * @return
    * @throws SQLException 
    */
   public Dto queryItems(Dto pDto) throws SQLException;   
}
