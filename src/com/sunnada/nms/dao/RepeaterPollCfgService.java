package com.sunnada.nms.dao;

import java.sql.SQLException;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/**
 * @author huangwei
 * @version 创建时间：Jul 30, 2011 6:01:58 PM
 * 
 * 轮询设置 接口服务类
 */
public interface RepeaterPollCfgService extends BaseService, GeneralService {
   
   public Dto queryRepeaterForList(Dto pDto) throws SQLException;
   
   public Dto queryChoisedRepeaterForList(Dto pDto) throws SQLException;
   
   public Dto insertChoisedRepeater(Dto pDto);
   
   public Dto deleteChoisedRepeater(Dto pDto);
   
   public Dto updateItemForployEnabled(Dto pDto);
   
   public boolean updateItemForployStatus(Dto pDto);
   
   public Dto queryMoncodeListForSel(Dto pDto) throws SQLException;
   
   public Dto queryMoncodeListForSet(Dto pDto) throws SQLException;
   
   public Dto updateMoniterParams(Dto pDto);
   
   public Dto validateMoniterParams(Dto pDto);
   
}
