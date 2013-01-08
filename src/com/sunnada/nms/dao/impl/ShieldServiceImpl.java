
package com.sunnada.nms.dao.impl; 

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.ShieldService;

/** 
 * @author linxingyu
 * @version 创建时间：2011-10-14 上午10:10:47 
 * 类说明 
 */
public class ShieldServiceImpl extends BaseServiceImpl implements ShieldService {
   
   public Dto deleteItem(Dto dto) {
     
      return null;
   }
   
   public Dto insertItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }
   
   public Dto queryItems(Dto dto) throws SQLException {
      List list=g4Dao.queryForPage("shield.queryAllShield",dto);
      int totalCount=(Integer)g4Dao.queryForObject("shield.countShield",dto);
      String json=JsonHelper.encodeList2PageJson(list, totalCount, null);
      Dto result=new BaseDto();
      result.put("json", json);
      return result;
   }
   
   public Dto updateItem(Dto dto) {
      // TODO Auto-generated method stub
      return null;
   }

   public void shield(Dto dto) {
      g4Dao.update("shield.shield",dto);
   }
   
}
