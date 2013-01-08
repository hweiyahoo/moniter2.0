package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.FactoryInfoService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.idgenerator.NMSIDHelper;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 22, 2011 4:46:51 PM 厂家管理 服务类实现
 */
public class FactoryInfoServiceImpl extends BaseServiceImpl implements FactoryInfoService {
   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         dto.put("factid", arrChecked[i]);
         try {
            g4Dao.delete("factoryInfo.deleteItem", dto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "厂家信息删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "厂家信息删除成功!");
      return outDto;
   }
   
   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("factoryInfo.checkAddForCode", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("厂家标识:“" + pDto.getAsString("factflag"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("factoryInfo.checkAddForName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("厂家名称:“" + pDto.getAsString("factname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      // 自定义编号
      // pDto.put("factid", NMSIDHelper.getFactId());
      pDto.put("create_time", DateTimeUtils.getDateSecondFormat());
      g4Dao.insert("factoryInfo.insertItem", pDto);
      outDto.put("msg", "厂家信息添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("factoryInfo.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("factoryInfo.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("factoryInfo.checkEditForCode", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("厂家标识:“" + pDto.getAsString("factflag"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("factoryInfo.checkEditForName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("厂家名称:“" + pDto.getAsString("factname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("factoryInfo.updateItem", pDto);
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "厂家信息修改成功！");
      return outDto;
   }
}
