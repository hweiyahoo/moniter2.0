package com.sunnada.nms.dao; 

import java.sql.SQLException;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/** 
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:36:14 PM 
 * 
 * 命令策略 服务类接口
 */
public interface CmdPraseService extends BaseService,GeneralService{
   
   /**
    * 策略从表 查询
    * @param pDto
    * @return
    * @throws SQLException 
    */
   public Dto querySubItems(Dto pDto) throws SQLException;
   
   /**
    * 策略从表 新增
    * @param pDto
    * @return
    */
   public Dto insertSubItem(Dto pDto);
   
   /**
    * 策略从表 删除
    * @param pDto
    * @return
    */
   public Dto deleteSubItem(Dto pDto);
   
   /**
    * 策略从表 修改
    * @param pDto
    * @return
    */
   public Dto updateSubItem(Dto pDto);
   
   /**
    * 监控对象标识查询
    * @param pDto
    * @return
    * @throws SQLException 
    */
   public Dto queryItemsForSelectParamClass(Dto pDto) throws SQLException;
   
}
