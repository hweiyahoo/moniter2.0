package com.sunnada.nms.dao.impl; 

import java.sql.SQLException;
import java.util.List;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.ComDataService;
import com.sunnada.nms.util.DateTimeUtils;


/** 
 * @author xujinmei
 * @version ����ʱ�䣺Jul 26, 2011 15:39:10 PM 
 * 监视通讯数据��� ������ʵ��
 */
public class ComDataServiceImpl extends BaseServiceImpl implements ComDataService{

   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      try {
         
         pDto.put("insertdate", DateTimeUtils.getDateSecondFormat());
         g4Dao.insert("comdata.insertItem", pDto);
      } catch (Exception e) {
         e.printStackTrace();
         outDto.put("failure", new Boolean(false));
         outDto.put("msg", "通讯数据���表添加失败！");
         return outDto;
      }
      outDto.put("msg", "通讯数据���表添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }

   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         dto.put("cmdid", arrChecked[i]);
         try {
            g4Dao.delete("comdata.deleteItem", dto);
         } catch (Exception e) {
            e.printStackTrace();
            outDto.put("failure", new Boolean(false));
            outDto.put("msg", "通讯数据���表删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "通讯数据���表删除成功!");
      return outDto;
   }   
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      try {
         pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
         g4Dao.update("comdata.updateItem", pDto);
                  
      }catch (Exception e) {
         e.printStackTrace();
         outDto.put("failure", new Boolean(false));
         outDto.put("msg", "通讯数据���表修改失败！");
         return outDto;
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "通讯数据���表修改成功！");
      return outDto;
   }  
   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("comdata.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("comdata.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }     
}
