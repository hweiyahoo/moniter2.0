package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.SiteService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.StringUtils;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 25, 2011 4:40:16 PM 地区编码 服务类实现
 */
public class SiteServiceImpl extends BaseServiceImpl implements SiteService {
   
   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      String[] parentsites = pDto.getAsString("parentsites").split(",");
      String[] sitecodes = pDto.getAsString("sitecodes").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         try {
            dto.put("siteid", arrChecked[i]);
            dto.put("sitecode", sitecodes[i]);
            if ("00".equals(parentsites[i])) {// 删除省份地区的。
               g4Dao.delete("site.deleteItemForProvince", dto);
            }
            else {// 删除地市地区的。
               g4Dao.delete("site.deleteItem", dto);
            }
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "删除成功!");
      return outDto;
   }
   
   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("site.checkAddForCode", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("地区编码为:“" + pDto.getAsString("sitecode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("site.checkAddForName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("地区名称为:“" + pDto.getAsString("sitename"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      Dto dto = null;
      String msg = "";
      // 自定义编号
      pDto.put("modifytime", DateTimeUtils.getDateSecondFormat());
      // String parentsite = pDto.getAsString("parentsite");
      // if ("00".equals(parentsite)) {// 添加省级地区
      // dto = (Dto) g4Dao.queryForObject("site.queryMaxCodeForProvince", pDto);
      // msg = "省级";
      // pDto.put("flag", "0");
      // }
      // else {// 添加地市地区
      // dto = (Dto) g4Dao.queryForObject("site.queryMaxCodeForCity", pDto);
      // msg = "地市";
      // pDto.put("flag", "1");
      // }
      // String maxCode = dto.getAsString("sitecode");
      // pDto.put("sitecode", StringUtils.createCodeForNMSSite(maxCode));
      String parentsite = pDto.getAsString("parentsite");
      if ("00".equals(parentsite)) {
         pDto.put("flag", "0");
      }
      else {
         pDto.put("flag", "1");
      }
      try {
         g4Dao.insert("site.insertItem", pDto);
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
   
   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("site.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("site.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("site.checkEditForCode", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("地区编号为:“" + pDto.getAsString("sitecode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("site.checkEditForName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("地区名称为:“" + pDto.getAsString("sitename"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      pDto.put("modifytime", DateTimeUtils.getDateSecondFormat());
      g4Dao.update("site.updateItem", pDto);
      outDto.put("msg", "修改成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   /**
    * 获取城市列表树
    */
   public Dto queryTreeItems(Dto pDto) {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("site.getTreeItems", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeObject2Json(codeList));
      return outDto;
   }
   
   public Dto queryProvinceList(Dto pDto) {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList("site.queryProvinceList", pDto);
      String arrStr = JsonHelper.encodeObject2Json(codeList);
      outDto.put("arrStr", arrStr);
      return outDto;
   }
   
}
