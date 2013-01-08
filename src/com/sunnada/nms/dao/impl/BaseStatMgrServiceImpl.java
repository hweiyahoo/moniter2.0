package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.BaseStatMgrService;

/**
 * @author gezhidong E-mail: fengyu_hqu@sina.com
 * @version 创建时间：Jul 25, 2011 9:12:00 AM 类说明
 */
public class BaseStatMgrServiceImpl extends BaseServiceImpl implements BaseStatMgrService {
   
   /**
    * 删除基站信息
    */
   public Dto deleteItem(Dto dto) {
      Dto outDto = new BaseDto();
      Dto pdto = new BaseDto();
      String[] arrChecked = dto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         pdto.put("basestatid", arrChecked[i]);
         try {
            g4Dao.delete("basestatmgr.deleteItem", pdto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "基站信息删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "基站信息删除成功！");
      return outDto;
   }
   
   /**
    * 插入基站信息
    */
   public Dto insertItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("basestatmgr.checkAddForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("该地区下的基站编号:“" + dto.getAsString("basestatcode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("basestatmgr.checkAddForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("该地区下的基站名称:“" + dto.getAsString("basestatname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.insert("basestatmgr.insertItem", dto);
      outDto.put("msg", "基站信息添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   /**
    * 基站信息查询
    * 
    * @throws SQLException
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("basestatmgr.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("basestatmgr.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /**
    * 基站信息更新
    */
   public Dto updateItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("basestatmgr.checkEditForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("该地区下的基站编号:“" + dto.getAsString("basestatcode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("basestatmgr.checkEditForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("该地区下的基站名称:“" + dto.getAsString("basestatname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("basestatmgr.updateItem", dto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "基站信息更新成功！");
      return outDto;
   }
   
   /**
    * 导入Excel记录到数据库
    */
   public Dto importFromExcel(List fileData) {
      
      Dto outDto = new BaseDto();
      int size = fileData.size();
      for (int i = 0; i < size; i++) {
         Dto map = (Dto) fileData.get(i);
         g4Dao.insert("basestatmgr.insertItem", map);
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "基站信息导入成功！");
      return outDto;
   }
   
}
