package com.sunnada.nms.dao.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.DeviceMonitorService;

/**
 * @author linxingyu
 * @version 创建时间：2011-7-22 上午10:23:38 主页面服务实现类
 */
public class DeviceMonitorServiceImpl extends BaseServiceImpl implements DeviceMonitorService {
   
   public Dto updateParam(Dto dto) {
      Dto outDto = new BaseDto();
      List list = dto.getAsList("list");
      for (int i = 0; i < list.size(); i++) {
         Dto pdto = (Dto) list.get(i);
         try {
            IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
            g4Dao.update("devicemnt.updateParam", dto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "设置失败！");
         }
         outDto.put("success", new Boolean(true));
         outDto.put("msg", "设置成功！");
      }
      return outDto;
   }
   
}
