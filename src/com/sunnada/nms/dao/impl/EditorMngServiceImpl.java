package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.EditorMngService;
import com.sunnada.nms.util.DateTimeUtils;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:39:10 PM
 * 
 * 编辑控件管理 服务类实现
 */
public class EditorMngServiceImpl extends BaseServiceImpl implements EditorMngService {
   
   public Dto queryEditor(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto editorDto = new BaseDto();
      List list = g4Dao.queryForList("editormng.queryEditor", pDto);
      for (int i = 0; i < list.size(); i++) {
         editorDto = (BaseDto) list.get(i);
         editorDto.put("leaf", new Boolean(true));
         editorDto.put("expanded", new Boolean(false));
      }
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(list));
      return outDto;
   }
   
   public Dto queryEditorType(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto editorDto = new BaseDto();
      List list = g4Dao.queryForList("editormng.queryEditorType", pDto);
      for (int i = 0; i < list.size(); i++) {
         editorDto = (BaseDto) list.get(i);
         editorDto.put("leaf", new Boolean(false));
         editorDto.put("expanded", new Boolean(true));
      }
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(list));
      return outDto;
   }
   
   public Dto queryEditorList(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      if ("00".equals(pDto.getAsString("editorcode"))) {
         pDto.put("editorcode", null);
      }
      List codeList = g4Dao.queryForPage("editormng.queryEditorDataForList", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, 100, null));
      return outDto;
   }
   
   public Dto queryMappingList(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("editormng.queryMappingForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("editormng.queryMappingForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto queryMoncodeListForSel(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("editormng.queryMoncodeListForSel", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("editormng.queryMoncodeCountForSel", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto insertMapping(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = new BaseDto();
      String editorid = pDto.getAsString("editorid");
      dto.put("editorid", editorid);
      String[] moncodeid = pDto.getAsString("moncodeid").split(",");
      for (int i = 0; i < moncodeid.length; i++) {
         try {
            dto.put("moncodeid", moncodeid[i]);
            g4Dao.insert("editormng.insertMapping", dto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "映射表添加失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "映射表添加成功!");
      return outDto;
   }
   
   public Dto deleteEditor(Dto pDto) {
      Dto outDto = new BaseDto();
      try {
         g4Dao.delete("editormng.deleteMapping", pDto);
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", "映射表删除失败！");
         return outDto;
      }
      try {
         g4Dao.delete("editormng.deleteEditor", pDto);
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", "编辑控件表删除失败！");
         return outDto;
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "删除成功!");
      return outDto;
   }
   
   public Dto insertEditor(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("editormng.checkEditorAdd", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("控件名称为:" + pDto.getAsString("editorname"));
         sbmsg.append("  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      String subcode = pDto.getAsString("subcode");
      if ("00".equals(subcode)) {// 添加类型
         Dto dto = (Dto) g4Dao.queryForObject("editormng.querySubEditorMaxCode", pDto);
         String maxcode = dto != null ? dto.getAsString("code") : "00";
         String editorcode = this.createEditorCode(subcode, maxcode);
         pDto.put("editorcode", editorcode);
      }
      else {// 添加控件
         Dto dto = (Dto) g4Dao.queryForObject("editormng.queryEditorMaxCode", pDto);
         String maxcode = dto != null ? dto.getAsString("code") : subcode + "00";
         if (maxcode.length() == 2 || maxcode.length() == 0) {
            maxcode = subcode + "00";
         }
         String editorcode = this.createEditorCode(subcode, maxcode);
         pDto.put("editorcode", editorcode);
      }
      g4Dao.insert("editormng.insertEditor", pDto);
      outDto.put("msg", "编辑控件添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   private String createEditorCode(String subcode, String maxcode) {
      String temp = null;
      temp = "" + (Integer.valueOf(maxcode) + 1);
      if (temp.length() % 2 != 0) {
         temp = "0" + temp;
      }
      return temp;
   }
   
   public Dto updateEditor(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("editormng.checkEditorEdit", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("控件名称为:" + pDto.getAsString("editorname"));
         sbmsg.append("  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("editormng.updateEditor", pDto);
      outDto.put("msg", "编辑控件修改成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto saveEditorData(Dto pDto) {
      Dto outDto = new BaseDto();
      String msg = "";
      if ("add".equals(pDto.getAsString("windowmodel"))) {
         msg = "添加数据集";
      }
      else if ("edit".equals(pDto.getAsString("windowmodel"))) {
         msg = "修改数据集";
      }
      if ("del".equals(pDto.getAsString("windowmodel"))) {
         msg = "删除数据集";
      }
      try {
         g4Dao.update("editormng.updateEditor", pDto);
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", msg + " 失败！");
         return outDto;
      }
      outDto.put("msg", msg + " 成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto deleteMapping(Dto pDto) {
      Dto outDto = new BaseDto();
      String[] strChecked = pDto.getAsString("strChecked").split(",");
      try {
         for (int i = 0; i < strChecked.length; i++) {
            pDto.put("meid", strChecked[i]);
            g4Dao.delete("editormng.deleteMappingByID", pDto);
         }
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", "映射表删除失败！");
         return outDto;
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "映射表删除成功!");
      return outDto;
   }
   
}
