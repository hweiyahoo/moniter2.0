package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.ProTypeService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.idgenerator.NMSIDHelper;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 25, 2011 2:49:56 PM 协议类型 服务类实现
 */
public class ProTypeServiceImpl extends BaseServiceImpl implements ProTypeService {
   
   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         dto.put("proid", arrChecked[i]);
         try {
            g4Dao.delete("proType.deleteItem", dto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "协议类型删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "协议类型删除成功!");
      return outDto;
   }
   
   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("proType.checkAddForCode", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("协议类型编号:“" + pDto.getAsString("protype"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("proType.checkAddForName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("协议类型名称:“" + pDto.getAsString("proname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      // 自定义编号
      // pDto.put("proid", NMSIDHelper.getProId());
      pDto.put("create_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.insert("proType.insertItem", pDto);
      outDto.put("msg", "协议类型添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto queryItems(Dto pDto) throws SQLException {
      // TODO Auto-generated method stub
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("proType.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("proType.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("proType.checkEditForCode", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("协议类型编号:“" + pDto.getAsString("protype"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("proType.checkEditForName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("协议类型名称:“" + pDto.getAsString("proname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("proType.updateItem", pDto);
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "协议类型修改成功！");
      return outDto;
   }
   
   public int judge(Dto dto) {
      return (Integer) g4Dao.queryForObject("proType.judge", dto);
   }
   
}
