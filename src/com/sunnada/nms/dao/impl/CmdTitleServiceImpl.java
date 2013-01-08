
package com.sunnada.nms.dao.impl; 

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.CmdTitleService;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 28, 2011 09:15:30 AM 
 * 命令头维护服务实现类
 */
public class CmdTitleServiceImpl extends BaseServiceImpl implements CmdTitleService {

   /*
    * 删除命令头信息
    */
   public Dto deleteItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      Dto pdto = new BaseDto();
      String[] arrChecked = dto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         pdto.put("titleid", arrChecked[i]);
         try {
            g4Dao.delete("cmdtitle.deleteItem", pdto);
         } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "命令头信息删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "命令头信息删除成功！");
      return outDto;
   }
   
   /*
    * 插入命令头信息
    */
   public Dto insertItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("cmdtitle.checkCmdtitleAddForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("序号:“" + dto.getAsString("idx"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("cmdtitle.checkCmdtitleAddForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("参数名称:“" + dto.getAsString("fieldname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.insert("cmdtitle.insertItem", dto);
      outDto.put("msg", "命令头信息添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   /*
    * 命令头信息查询
    */
   public Dto queryItems(Dto dto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("cmdtitle.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("cmdtitle.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /*
    * 命令头信息更新
    */
   public Dto updateItem(Dto dto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("cmdtitle.checkCmdtitleEditForCode", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("序号:“" + dto.getAsString("idx"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      count = (Integer) g4Dao.queryForObject("cmdtitle.checkCmdtitleEditForName", dto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("参数名称:“" + dto.getAsString("fieldname"));
         sbmsg.append("”  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("cmdtitle.updateItem",dto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "命令头信息更新成功！");
      return outDto;
   }
   
}
