package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;

import com.sunnada.nms.dao.UpdatedevicefileService;
import com.sunnada.nms.util.DateTimeUtils;

/** 
 * @author 徐金妹  E-mail: xujinmei1717@sunnada.net;xujinmeiok@163.com 
 * @version 创建时间：Jul 29, 2011 5:17:33 PM 
 * 类说明 :远程升级
 */
public class UpdatedevicefileServiceImpl extends BaseServiceImpl implements UpdatedevicefileService {

   /**
    * 保存文件上传数据
    * 
    * @param pDto
    * @return
    */
   public Dto doUpload(Dto pDto) {
     
   
      Dto outDto = new BaseDto();
      try {
         
         pDto.put("uploaddatetime", DateTimeUtils.getDateSecondFormat());
         
//       g4Dao.delete("updatedevicefile.deleteItem", pDto);
         g4Dao.insert("updatedevicefile.insertItem", pDto);
         
         
      } catch (Exception e) {
         e.printStackTrace();
         outDto.put("failure", new Boolean(false));
         outDto.put("msg", "文件表添加失败！");
         return outDto;
      }
      outDto.put("msg", "文件���表添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;      
   }
   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("updatedevicefile.queryItemForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("updatedevicefile.queryItemForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }    
}
