
package com.sunnada.nms.dao; 

import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

/** 
 * @author linxingyu
 * @version 创建时间：2011-8-15 下午04:08:39 
 * 类说明 
 */
public interface UpdateService extends BaseService {
   /**
    * 获取设备所有参数
    */
   public List queryParam(Dto dto);
   
   /**
    * 更新参数
    */
   public void updateParam(Dto dto);
   
   /**
    * 删除参数
    */
   public void deleteParam(Dto dto);
   
   /**
    *插入参数
    */
   public void insertParam(Dto dto);
   
   /**
    * 插入告警
    */
   public void insertAlarm(Dto dto);
   
   /**
    * 修改告警
    */
   public void modifyAlarm(Dto dto);
   
   /**
    * 判断告警是否未处理
    */
   public int judge(Dto dto);
   
   /**
    * 修改告警时间
    */
   public void modify(Dto dto);
   
   /**
    * 修改 repeaterinfo中的信息
    */
   public void updateInfo(Dto dto);
}
