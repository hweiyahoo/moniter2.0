
package com.sunnada.nms.dao.impl; 

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.ComConfigService;
import com.sunnada.nms.util.DateTimeUtils;

/** 
 * @author gezhidong  E-mail: fengyu_hqu@sina.com 
 * @version 创建时间：Jul 28, 2011 3:01:06 AM 
 * 通讯参数服务实现类
 */
public class ComConfigServiceImpl extends BaseServiceImpl implements ComConfigService {
   
   
   public Dto setCommInfo(Dto pDto) {
      Dto outDto = new BaseDto();
      g4Dao.update("comminfo.updateItem", pDto);
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "通讯参数设置成功！");
      return outDto;
   }


   public Dto queryCommInfo(Dto pDto) {
      return (Dto)g4Dao.queryForObject("comminfo.queryItem", pDto);
   }
   
}
