package com.sunnada.nms.dao.impl; 

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.DeviceTypeService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.idgenerator.NMSIDHelper;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 22, 2011 9:08:25 AM 
 * 设备类型接口实现 
 */
public class DeviceTypeServiceImpl extends BaseServiceImpl implements DeviceTypeService {
   
   /*
    * 删除设备类型
    */
   public Dto deleteItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      Dto pdto = new BaseDto();
      String[] arrChecked = dto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         pdto.put("devid", arrChecked[i]);
         try {
            g4Dao.delete("devicetype.deleteItem", pdto);
         } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "设备类型删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "设备类型删除成功！");
      return outDto;
   }
   
   /*
    * 插入设备类型
    */
   public Dto insertItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      g4Dao.insert("devicetype.insertItem", dto);
      outDto.put("msg", "设备类型添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   /*
    * 设备类型查询
    */
   public Dto queryItems(Dto dto) throws SQLException {
      
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("devicetype.queryItemForList", dto);
      Integer totalCount = (Integer) g4Dao.queryForObject("devicetype.queryItemForCount", dto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /*
    * 设备类型更新
    */
   public Dto updateItem(Dto dto) {
      
      Dto outDto = new BaseDto();
      g4Dao.update("devicetype.updateItem",dto);
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "设备类型更新成功！");
      return outDto;
   }
   
}
