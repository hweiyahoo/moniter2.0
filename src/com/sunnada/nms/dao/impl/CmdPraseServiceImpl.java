package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.CmdPraseService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.idgenerator.NMSIDHelper;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:39:10 PM
 * 
 * 命令策略 服务类实现
 */
public class CmdPraseServiceImpl extends BaseServiceImpl implements CmdPraseService {
   
   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      try {
         g4Dao.delete("cmdprase.deleteItem", pDto);
         g4Dao.delete("cmdprase.deleteAllSubItem", pDto);
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", "命令策略主表删除失败！");
         return outDto;
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "命令策略主表删除成功!");
      return outDto;
   }
   
   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("cmdprase.checkMainAdd", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("协议类型为:" + pDto.getAsString("protype"));
         sbmsg.append(",命令编号为:" + pDto.getAsString("cmd"));
         sbmsg.append("  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      // // 自定义编号
      // pDto.put("cmdmainid", NMSIDHelper.getCmdMainID());
      pDto.put("create_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.insert("cmdprase.insertItem", pDto);
      outDto.put("msg", "命令策略主表添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("cmdprase.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("cmdprase.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      g4Dao.update("cmdprase.updateItem", pDto);
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "命令策略主表修改成功！");
      return outDto;
   }
   
   public Dto deleteSubItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         dto.put("cmdsubid", arrChecked[i]);
         try {
            g4Dao.delete("cmdprase.deleteSubItem", dto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "命令策略从表删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "命令策略从表删除成功!");
      return outDto;
   }
   
   public Dto insertSubItem(Dto pDto) {
      Dto outDto = new BaseDto();
      
      int count = (Integer) g4Dao.queryForObject("cmdprase.checkSubItem", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("序号为:" + pDto.getAsString("idx"));
         sbmsg.append("  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      
      // // 自定义编号
      // pDto.put("cmdsubid", NMSIDHelper.getCmdSubId());
      pDto.put("create_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.insert("cmdprase.insertSubItem", pDto);
      outDto.put("msg", "命令策略从表添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto querySubItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("cmdprase.querySubItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("cmdprase.querySubItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto updateSubItem(Dto pDto) {
      Dto outDto = new BaseDto();
      g4Dao.update("cmdprase.updateSubItem", pDto);
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "命令策略从表修改成功！");
      return outDto;
   }
   
   public Dto queryItemsForSelectParamClass(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("cmdprase.queryItemForSelect", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("cmdprase.queryItemForSelectCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
}
