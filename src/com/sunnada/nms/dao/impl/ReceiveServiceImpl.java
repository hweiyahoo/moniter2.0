package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.ReceiveService;
import com.sunnada.nms.util.DateTimeUtils;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Sep 22, 2011 9:07:06 AM 
 * 类说明 
 */
public class ReceiveServiceImpl extends BaseServiceImpl implements ReceiveService{

   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         dto.put("receive_id", arrChecked[i]);
         try {
            g4Dao.delete("receive.deleteItem", dto);
         } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "消息删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "消息删除成功!");
      return outDto;
   }

   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }

   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("receive.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("receive.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }

   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      pDto.put("read_time", DateTimeUtils.getDateSecondFormat());
      pDto.put("unread","1");
      g4Dao.update("receive.updateItem", pDto);
      outDto.put("success", new Boolean(true));
      return outDto;
   }

   public Dto showNotice(Dto pDto) {
      pDto.put("read_time", DateTimeUtils.getDateSecondFormat());
      pDto.put("unread","1");
      g4Dao.update("receive.updateItem", pDto);
      Dto outDto = (Dto)g4Dao.queryForObject("receive.showNotice", pDto);
      return outDto;
   }
   
}
