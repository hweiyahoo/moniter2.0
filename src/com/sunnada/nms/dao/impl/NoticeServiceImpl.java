package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.NoticeService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.idgenerator.NMSIDHelper;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Sep 20, 2011 10:07:15 AM 公告管理服务实现类
 */
public class NoticeServiceImpl extends BaseServiceImpl implements NoticeService {
   
   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto receDto = new BaseDto();
      Dto dto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         dto.put("notice_id", arrChecked[i]);
         receDto.put("notice_id", arrChecked[i]);
         try {
            g4Dao.delete("receive.delete", receDto);
            g4Dao.delete("notice.deleteItem", dto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "公告信息删除失败！");
            return outDto;
         }
      }
      
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "公告信息删除成功!");
      return outDto;
   }
   
   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto receDto = new BaseDto();
      // 自定义编号
      String notice_id = NMSIDHelper.getNoticeId();
      pDto.put("notice_id", notice_id);
      receDto.put("notice_id", notice_id);
      pDto.put("create_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.insert("notice.insertItem", pDto);
      // 获取接收人员，依次插入关联表
      String[] arrChecked = pDto.getAsString("rece_obj").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         receDto.put("user_id", arrChecked[i]);
         try {
            g4Dao.insert("receive.insertItem", receDto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "公告发布失败！");
            return outDto;
         }
      }
      outDto.put("msg", "公告发布成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("notice.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("notice.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      
      Dto receDto = new BaseDto();
      String rece_obj = pDto.getAsString("rece_obj");
      String notice_id = pDto.getAsString("notice_id");
      receDto.put("notice_id", notice_id);
      // 删除用户标识表中存在notice_id的记录
      g4Dao.delete("receive.delete", receDto);
      // 获取新的接收人员
      String[] arrChecked = pDto.getAsString("rece_obj").split(",");
      
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.update("notice.updateItem", pDto);
      
      for (int i = 0; i < arrChecked.length; i++) {
         receDto.put("user_id", arrChecked[i]);
         try {
            g4Dao.insert("receive.insertItem", receDto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "公告修改失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "公告信息修改成功！");
      return outDto;
   }
   
   private String formatReceObj(String rece_obj) {
      if (StringUtils.isEmpty(rece_obj) || "全部人员".equals(rece_obj)) {
         return "''";
      }
      else {
         return rece_obj;
      }
   }
   
   public Dto queryCheckedStore(Dto pDto) {
      Dto outDto = new BaseDto();
      String rece_obj = formatReceObj(pDto.getAsString("rece_obj"));
      pDto.put("rece_obj", rece_obj);
      List codeList = g4Dao.queryForList("notice.queryCheckedStore", pDto);
      String arrStr = JsonHelper.encodeObject2Json(codeList);
      outDto.put("arrStr", arrStr);
      return outDto;
   }
   
   public Dto queryNoCheckedRoleStore(Dto pDto) {
      Dto outDto = new BaseDto();
      String rece_obj = formatReceObj(pDto.getAsString("rece_obj"));
      pDto.put("rece_obj", rece_obj);
      List codeList = g4Dao.queryForList("notice.queryNoCheckedRoleStore", pDto);
      String arrStr = JsonHelper.encodeObject2Json(codeList);
      outDto.put("arrStr", arrStr);
      return outDto;
   }
   
   public Dto queryCheckedRoleStore(Dto pDto) {
      Dto outDto = new BaseDto();
      String rece_obj = formatReceObj(pDto.getAsString("rece_obj"));
      pDto.put("rece_obj", rece_obj);
      List codeList = g4Dao.queryForList("notice.queryCheckedRoleStore", pDto);
      String arrStr = JsonHelper.encodeObject2Json(codeList);
      outDto.put("arrStr", arrStr);
      return outDto;
   }
   
   public Dto queryNoCheckedStore(Dto pDto) {
      Dto outDto = new BaseDto();
      String rece_obj = formatReceObj(pDto.getAsString("rece_obj"));
      pDto.put("rece_obj", rece_obj);
      List codeList = g4Dao.queryForList("notice.queryNoCheckedStore", pDto);
      String arrStr = JsonHelper.encodeObject2Json(codeList);
      outDto.put("arrStr", arrStr);
      return outDto;
   }
   
   public Dto insertAllUserItem(Dto pDto) {
      Dto outDto = new BaseDto();
      // 自定义编号
      String notice_id = NMSIDHelper.getNoticeId();
      pDto.put("notice_id", notice_id);
      pDto.put("create_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.insert("notice.insertItem", pDto);
      outDto.put("msg", "公告发布成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto updateAllUserItem(Dto pDto) {
      Dto outDto = new BaseDto();
      
      Dto receDto = new BaseDto();
      String rece_obj = pDto.getAsString("rece_obj");
      String notice_id = pDto.getAsString("notice_id");
      receDto.put("notice_id", notice_id);
      // 删除用户标识表中存在notice_id的记录
      g4Dao.delete("receive.delete", receDto);
      // 获取新的接收人员
      String[] arrChecked = pDto.getAsString("rece_obj").split(",");
      
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.update("notice.updateItem", pDto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "公告信息修改成功！");
      return outDto;
   }
   
}
