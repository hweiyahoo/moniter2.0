
package com.sunnada.nms.dao.impl; 

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.RespFlagService;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 27, 2011 7:29:55 AM 
 * 类说明 
 */
public class RespFlagServiceImpl extends BaseServiceImpl implements RespFlagService {
   
   /*
    * 删除应答标识
    */
   public Dto deleteItem(Dto dto) {
      Dto outDto = new BaseDto();
      Dto pdto = new BaseDto();
      String[] arrChecked = dto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         pdto.put("respid", arrChecked[i]);
         try {
            g4Dao.delete("respflag.deleteItem", pdto);
         } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "应答标志删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "应答标志删除成功！");
      return outDto;
   }
   
   /*
    * 插入应答标志
    */
   public Dto insertItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("respflag.checkRespflagAddForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("应答编码:“" + dto.getAsString("respcode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("respflag.checkRespflagAddForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("应答含意:“" + dto.getAsString("respname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.insert("respflag.insertItem", dto);
      outDto.put("msg", "应答标志添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   /*
    * 应答标志查询
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("respflag.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("respflag.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /*
    * 应答标志更新
    */
   public Dto updateItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("respflag.checkRespflagEditForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("应答编码:“" + dto.getAsString("respcode"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("respflag.checkRespflagEditForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("应答含意:“" + dto.getAsString("respname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("respflag.updateItem",dto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "应答标志更新成功！");
      return outDto;
   }
   
}
