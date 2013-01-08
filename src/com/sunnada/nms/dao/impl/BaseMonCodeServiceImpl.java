
package com.sunnada.nms.dao.impl; 

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.BaseMonCodeService;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 26, 2011 7:45:20 AM 
 * 监控标识号维护 
 */
public class BaseMonCodeServiceImpl extends BaseServiceImpl implements BaseMonCodeService {

   /*
    * 删除监控号类型
    */
   public Dto deleteItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      Dto pdto = new BaseDto();
      String[] arrChecked = dto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         pdto.put("moncodeid", arrChecked[i]);
         try {
            g4Dao.delete("basemoncode.deleteItem", pdto);
         } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "监控标识信息删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "监控标识信息删除成功！");
      return outDto;
   }
   
   /*
    * 插入设备类型
    */
   public Dto insertItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("basemoncode.checkMoncodeAddForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("参数编号:“" + dto.getAsString("paramcode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("basemoncode.checkMoncodeAddForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("参数名称:“" + dto.getAsString("paramname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.insert("basemoncode.insertItem", dto);
      outDto.put("msg", "监控标识信息添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   /*
    * 设备类型查询
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("basemoncode.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("basemoncode.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /*
    * 设备类型更新
    */
   public Dto updateItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("basemoncode.checkMoncodeEditForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("参数编号:“" + dto.getAsString("paramcode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("basemoncode.checkMoncodeEditForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("参数名称:“" + dto.getAsString("paramname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("basemoncode.updateItem",dto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "监控标识信息更新成功！");
      return outDto;
   }
   
}