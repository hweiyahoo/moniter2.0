
package com.sunnada.nms.dao.impl; 

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.MaintainManService;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 27, 2011 17:20 PM 
 * 代维人员服务类
 */
public class MaintainManServiceImpl extends BaseServiceImpl implements MaintainManService {
   
   /**
    * 删除代维人员信息
    */
   public Dto deleteItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      Dto pdto = new BaseDto();
      String[] arrChecked = dto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         pdto.put("manid", arrChecked[i]);
         try {
            g4Dao.delete("maintainman.deleteItem", pdto);
         } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "代维人员信息删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "代维人员信息删除成功！");
      return outDto;
   }
   
   /**
    * 插入代维人员信息
    */
   public Dto insertItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      g4Dao.insert("maintainman.insertItem", dto);
      outDto.put("msg", "代维人员信息添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   /**
    * 代维人员信息查询
    * @throws SQLException 
    */
   public Dto queryItems(Dto dto) throws SQLException {
      
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("maintainman.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("maintainman.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /**
    * 代维人员信息更新
    */
   public Dto updateItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      g4Dao.update("maintainman.updateItem",dto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "代维人员信息更新成功！");
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
         g4Dao.insert("maintainman.insertItem", map);
      }
      outDto.put("msg", "代维人员信息导入成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
}
