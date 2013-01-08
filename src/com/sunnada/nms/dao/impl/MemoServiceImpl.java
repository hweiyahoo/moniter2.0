package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.MemoService;

/**
 * @author huangwei
 * @version 创建时间：Dec 26, 2011 10:23:24 AM
 * 
 * 标签服务接口实现类
 */
public class MemoServiceImpl extends BaseServiceImpl implements MemoService {
   /**
    * 删除便签
    */
   public Dto deleteItem(Dto dto) {
      Dto outDto = new BaseDto();
      try {
         g4Dao.delete("memo.deleteItem", dto);
         outDto.put("success", new Boolean(true));
         outDto.put("msg", "删除成功！");
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", "删除失败！");
      }
      return outDto;
   }
   
   /**
    * 新增便签
    */
   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      try {
         g4Dao.insert("memo.insertItem", pDto);
         int key = (Integer) g4Dao.queryForObject("memo.queryInsertKey", pDto);
         outDto.put("memoid", key);
         outDto.put("memotitle", pDto.getAsString("memotitle"));
         outDto.put("msg", "添加成功！");
         outDto.put("success", new Boolean(true));
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("msg", "添加失败！");
         outDto.put("success", new Boolean(false));
      }
      return outDto;
   }
   
   /**
    * 加载知道便签内容
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      try {
         outDto = (Dto) g4Dao.queryForObject("memo.queryItem", dto);
         outDto.put("success", new Boolean(true));
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
      }
      return outDto;
   }
   
   /**
    * 修改便签
    */
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      try {
         g4Dao.insert("memo.updateItem", pDto);
         outDto.put("msg", "修改成功！");
         outDto.put("success", new Boolean(true));
         outDto.put("memoid", pDto.getAsString("memoid"));
         outDto.put("memotitle", pDto.getAsString("memotitle"));
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("msg", "修改失败！");
         outDto.put("success", new Boolean(false));
      }
      return outDto;
   }
   
   /**
    * 加载个人便签标题
    * 
    * @throws SQLException
    */
   public Dto loadComboboxVal(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List itemList = g4Dao.queryForList("memo.loadComboboxValue", dto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(itemList));
      return outDto;
   }
   
}
