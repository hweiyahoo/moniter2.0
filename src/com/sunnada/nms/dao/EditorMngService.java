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
public interface EditorMngService extends BaseService{
   
   public Dto queryEditorType(Dto pDto);
   
   public Dto queryEditor(Dto pDto);
   
   public Dto queryEditorList(Dto pDto) throws SQLException;
   
   public Dto queryMappingList(Dto pDto) throws SQLException;
   
   public Dto queryMoncodeListForSel(Dto pDto) throws SQLException;
   
   public Dto insertMapping(Dto pDto);
   
   public Dto insertEditor(Dto pDto);
   
   public Dto updateEditor(Dto pDto);
   
   public Dto deleteEditor(Dto pDto);
   
   public Dto saveEditorData(Dto pDto);
   
   public Dto deleteMapping(Dto pDto);
   
}
