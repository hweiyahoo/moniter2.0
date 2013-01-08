package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.StringUtils;

/**
 * @author linxingyu
 * @version 创建时间：2011-7-22 上午10:23:38 主页面服务实现类
 */
public class DeviceMagServieceImpl extends BaseServiceImpl implements DeviceMagService {
   
   public Dto deleteItem(Dto dto) {
      g4Dao.delete("deviceMag.deleRepea", dto);
      return null;
   }
   
   public Dto insertItem(Dto dto) {
      g4Dao.insert("deviceMag.insertRepeater", dto);
      return null;
   }
   
   public Dto queryItems(Dto dto) throws SQLException {
      List page = g4Dao.queryForPage("deviceMag.query", dto);
      Object count = g4Dao.queryForObject("deviceMag.count", dto);
      String num = count.toString();
      Dto result = new BaseDto();
      result.put("page", JsonHelper.encodeList2PageJson(page, Integer.parseInt(num.substring(num.indexOf("=") + 1, num.length() - 1)), null));
      return result;
   }
   
   public Dto updateItem(Dto dto) {
      g4Dao.update("deviceMag.updateRepeaterInfo", dto);
      Dto result = new BaseDto();
      result.put("success", true);
      return result;
   }
   
   public Dto getAllProvinces() {
      Dto result = new BaseDto();
      List list = g4Dao.queryForList("deviceMag.queryProvinces");
      result.put("tree", list);
      return result;
   }
   
   public Dto getCitysByPro(Dto dto) {
      Dto result = new BaseDto();
      List list = g4Dao.queryForList("deviceMag.queryCitys", dto);
      result.put("citys", list);
      return result;
   }
   
   public Dto getRepeater(Dto dto) {
      Dto result = new BaseDto();
      List list = g4Dao.queryForList("deviceMag.queryRepeater", dto);
      result.put("repeater", list);
      return result;
      
   }
   
   public Dto getParamenter(Dto dto) throws SQLException {
      Dto result = new BaseDto();
      List list = g4Dao.queryForPage("deviceMag.queryStatus", dto);
      result.put("parameter", list);
      return result;
   }
   
   public Dto getParamenterCount(Dto dto) {
      Dto result = new BaseDto();
      Object obj = g4Dao.queryForObject("deviceMag.queryStatusCount", dto);
      result.put("count", JsonHelper.encodeObject2Json(obj));
      return result;
   }
   
   public Dto getDeviceByProtocol(Dto dto) {
      Dto result = new BaseDto();
      List list = g4Dao.queryForList("deviceMag.selectByProtocol", dto);
      result.put("device", list);
      return result;
   }
   
   public Dto getInformationById(Dto dto) {
      Dto result = new BaseDto();
      Object object = g4Dao.queryForObject("deviceMag.information", dto);
      result.put("jsonStrList", JsonHelper.encodeObject2Json(object));
      result.put("dto", object);
      // result.put("information", list);
      return result;
   }
   
   public Dto getAllInforamtion(Dto dto) {
      Dto result = new BaseDto();
      Dto object = (Dto) g4Dao.queryForObject("deviceMag.informationAll", dto);
      result.put("jsonObject", JsonHelper.encodeObject2Json(object));
      result.put("list", g4Dao.queryForList("deviceMag.informationAll", dto));
      result.put("result", object);
      return result;
   }
   
   public Dto getRepeaterCount(Dto dto) {
      Dto result = new BaseDto();
      Object object = g4Dao.queryForObject("deviceMag.getInformationCount", dto);
      result.put("count", JsonHelper.encodeObject2Json(object));
      return result;
   }
   
   public Dto getLastID() {
      Dto result = new BaseDto();
      Object id = g4Dao.queryForObject("deviceMag.selectLastID");
      result.put("id", id.toString());
      return result;
   }
   
   public Dto getSubCount(Dto dto) {
      Dto result = new BaseDto();
      Object count = g4Dao.queryForObject("deviceMag.getSubCount", dto);
      result.put("count", JsonHelper.encodeObject2Json(count));
      return result;
   }
   
   public Dto getSubDevice(Dto dto) {
      Dto result = new BaseDto();
      List list = g4Dao.queryForList("deviceMag.selectDevice", dto);
      result.put("list", JsonHelper.encodeObject2Json(list));
      return result;
   }
   
   public Dto getSubInfo(Dto dto) {
      Dto result = new BaseDto();
      List list = g4Dao.queryForList("deviceMag.selectSubInfo", dto);
      result.put("list", list);
      return result;
   }
   
   public Dto copyRepea(Dto dto) {
      g4Dao.insert("deviceMag.copyRepea", dto);
      return null;
   }
   
   public Dto copyParam(Dto dto) {
      g4Dao.insert("deviceMag.copyParam", dto);
      return null;
   }
   
   public Dto deleParam(Dto dto) {
      g4Dao.delete("deviceMag.deleteRepeaPara", dto);
      return null;
   }
   
   public Dto queryReflag(Dto dto) {
      Dto result = new BaseDto();
      List list = g4Dao.queryForList("deviceMag.t_reflag", dto);
      result.put("list", list);
      return result;
   }
   
   /**
    * yzz 获取连接标识
    * 
    * @param dto
    * @return
    */
   public Dto queryConnFlag(Dto dto) {
      Dto oDto = new BaseDto();
      List obj = g4Dao.queryForList("deviceMag.queryConnFlag", dto);
      // String json = JsonHelper.encodeObject2Json(obj);
      oDto.put("json", obj);
      return oDto;
   }
   
   /**
    * yzz 实时设置与查询保存数据
    */
   public Dto updateVal1Item(Dto pDto) {
      Dto outDto = new BaseDto();
      g4Dao.update("deviceMag.updateVal1Item", pDto);
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "保存数据成功！");
      return outDto;
   }
   
   /**
    * yzz 实时设置之后，将返回值更新到远程值中
    */
   public Dto updateRVal1Item(Dto pDto) {
      Dto outDto = new BaseDto();
      g4Dao.update("deviceMag.updateRVal1Item", pDto);
      pDto.put("modify_time", DateTimeUtils.getDateSecondFormat());
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "保存数据成功！");
      return outDto;
   }
   
   public Dto updateReport(Dto pDto) {
      g4Dao.update("deviceMag.updatePort", pDto);
      return null;
   }
   
   public Dto judge(Dto dto) {
      Object object = g4Dao.queryForObject("deviceMag.judge", dto);
      Dto result = new BaseDto();
      result.put("flag", object);
      return result;
   }
   
   public Dto updateFlag(Dto dto) {
      g4Dao.update("deviceMag.update", dto);
      return null;
   }
   
   public Dto exit(Dto dto) throws SQLException {
      List page = g4Dao.queryForPage("deviceMag.existenceParam", dto);
      Object count = g4Dao.queryForObject("deviceMag.countExit", dto);
      String num = count.toString();
      Dto result = new BaseDto();
      result.put("params", JsonHelper.encodeList2PageJson(page, Integer.parseInt(num.substring(num.indexOf("=") + 1, num.length() - 1)), null));
      return result;
   }
   
   public Dto noExit(Dto dto) throws SQLException {
      List page = g4Dao.queryForPage("deviceMag.noExitParam", dto);
      Object count = g4Dao.queryForObject("deviceMag.countNoExit", dto);
      String num = count.toString();
      Dto result = new BaseDto();
      result.put("params", JsonHelper.encodeList2PageJson(page, Integer.parseInt(num.substring(num.indexOf("=") + 1, num.length() - 1)), null));
      return result;
   }
   
   public Dto queryRepeaterid(Dto dto) {
      List object = g4Dao.queryForList("deviceMag.queryRepeaterid", dto);
      Dto result = new BaseDto();
      result.put("list", object);
      return result;
   }
   
   public Dto queryProtype(Dto dto) {
      Dto outDto = (Dto) g4Dao.queryForObject("deviceMag.queryProtype", dto);
      return outDto;
   }
   
   public Dto queryClass(Dto dto) {
      Dto outDto = (Dto) g4Dao.queryForObject("deviceMag.queryClass", dto);
      return outDto;
   }
   
   public Dto refreshTree(Dto dto) {
      Dto result = (Dto) g4Dao.queryForObject("deviceMag.refreshTree", dto);
      return result;
   }
   
   public Dto isOK(Dto dto) {
      Dto result = (Dto) g4Dao.queryForObject("deviceMag.isOk", dto);
      return result;
   }
   
   public void updateRepFlag(Dto dto) {
      g4Dao.update("deviceMag.updateFlag", dto);
   }
   
   public void updateStationAndStatsub(Dto dto) {
      g4Dao.update("deviceMag.updateInfoStation", dto);
      // g4Dao.update("deviceMag.updateStation", dto);
   }
   
   public void updaterepeaterinfo(Dto dto) {
      g4Dao.update("deviceMag.updaterepeaterinfo", dto);
   }
   
   public void updateStatTel(Dto dto) {
      g4Dao.update("deviceMag.updateStatTel", dto);
   }
   
   private Dto validationForImportExcel(Dto map) {
      Dto validatMsg = new BaseDto();
      // 导入数据有效性 8列 必填7列，选填1列
      if (!map.containsKey("temp") || !map.containsKey("stationid") || !map.containsKey("province") || !map.containsKey("city") || !map.containsKey("stationname") || !map.containsKey("protype") || !map.containsKey("devicetype")) {
         validatMsg.put("msg", "数据中有必填项未填写！，导入失败！");
         validatMsg.put("result", "2");
         return validatMsg;
      }
      String temp = map.getAsString("temp");
      String stationid = map.getAsString("stationid");
      String province = map.getAsString("province");
      String city = map.getAsString("city");
      String stationname = map.getAsString("stationname");
      String protype = map.getAsString("protype");
      String devicetype = map.getAsString("devicetype");
      // String stattel = map.getAsString("stattel");
      // 空行
      if (StringUtils.isEmpty(temp) && StringUtils.isEmpty(stationid) && StringUtils.isEmpty(province) && StringUtils.isEmpty(city) && StringUtils.isEmpty(stationname) && StringUtils.isEmpty(protype) && StringUtils.isEmpty(devicetype)) {
         validatMsg.put("msg", "发现空行，忽略！");
         validatMsg.put("result", "1");
         return validatMsg;
      }
      
      return validatMsg;
   }
   
   /**
    * yzz 导入Excel站点信息到数据库 modify by huangwei
    */
   public Dto importExcel(List fileData) {
      Dto outDto = new BaseDto();
      int successCount = 0, failCount = 0;
      
      StringBuffer sqeName = null;
      StringBuffer sb = null;
      StringBuffer errorSb = new StringBuffer();
      StringBuffer msg = new StringBuffer();
      for (int i = 0; i < fileData.size(); i++) {
         boolean isOk = true;
         sqeName = new StringBuffer();
         sb = new StringBuffer();
         sqeName.append("第" + (i + 1) + "条:");
         Dto inDto = (Dto) fileData.get(i);
         Dto validatMsg = this.validationForImportExcel(inDto);
         if ("2".equals(validatMsg.getAsString("result"))) {
            isOk = false;
            sb.append(sqeName).append(" ").append(validatMsg.getAsString("msg")).append("<br>");
            failCount++;
         }
         else if ("1".equals(validatMsg.getAsString("result"))) {
            continue;
         }
         if (isOk) {// 装载协议类型
            String proType = (String) g4Dao.queryForObject("deviceMag.getProTypeByName", inDto);
            if (!StringUtils.isEmpty(proType)) {
               inDto.put("protype", proType);
            }
            else {
               isOk = false;
               sb.append(sqeName).append(" ").append("[协议类型]有错，导入失败！").append("<br>");
               failCount++;
            }
         }
         
         if (isOk) {// 装载设备类型
            String deviceType = (String) g4Dao.queryForObject("deviceMag.getDeviceTypeTypeByName", inDto);
            if (!StringUtils.isEmpty(deviceType)) {
               inDto.put("devicetype", deviceType);
            }
            else {
               isOk = false;
               sb.append(sqeName).append(" ").append("[设备类型]有错，导入失败！").append("<br>");
               failCount++;
            }
         }
         
         if (isOk) {// 装载省份
            String province = (String) g4Dao.queryForObject("deviceMag.getProvinceByName", inDto);
            if (!StringUtils.isEmpty(province)) {
               inDto.put("province", province);
            }
            else {
               isOk = false;
               sb.append(sqeName).append(" ").append("[省份]有错，导入失败！").append("<br>");
               failCount++;
            }
         }
         
         if (isOk) {// 装载地市
            String city = (String) g4Dao.queryForObject("deviceMag.getCityByName", inDto);
            if (!StringUtils.isEmpty(city)) {
               inDto.put("city", city);
            }
            else {
               isOk = false;
               sb.append(sqeName).append(" ").append("[地市]有错，导入失败！").append("<br>");
               failCount++;
            }
         }
         
         if (isOk) {
            String statsubid = inDto.getAsString("temp");
            statsubid = statsubid.replaceAll("0x", "");
            statsubid = statsubid.replaceAll("0X", "");
            if (!StringUtils.isHex(statsubid)) {
               isOk = false;
               sb.append(sqeName).append(" ").append("[设备编号]不是16进制，导入失败！").append("<br>");
               failCount++;
            }
            else {
               if (statsubid.length() != 2) {
                  isOk = false;
                  sb.append(sqeName).append(" ").append("[设备编号]长度不对，导入失败！").append("<br>");
                  failCount++;
               }
            }
            if (isOk) {
               inDto.put("statsubid", statsubid);
               if ("00".equals(statsubid) || "FF".toLowerCase().equalsIgnoreCase(statsubid)) {
                  inDto.put("parentrepid", 0);
               }
               else {
                  String parentrepid = (String) g4Dao.queryForObject("deviceMag.getRepeaterid", inDto);
                  inDto.put("parentrepid", parentrepid);
                  if (StringUtils.isEmpty(parentrepid)) {
                     isOk = false;
                     sb.append(sqeName).append(" ").append("[主机]不存在，导入失败！").append("<br>");
                     failCount++;
                  }
               }
            }
         }
         if (isOk) {
            int count = (Integer) g4Dao.queryForObject("deviceMag.checkAddForStation", inDto);
            if (count > 0) {
               isOk = false;
               sb.append(sqeName).append(" ").append("[直放站站点]已经存在，导入失败！").append("<br>");
               failCount++;
            }
         }
         if (isOk) {
            String stationid = inDto.getAsString("stationid");
            if (stationid.length() > 8) {
               isOk = false;
               sb.append(sqeName).append(" ").append("[直放站编号]长度超过8位，导入失败！").append("<br>");
               failCount++;
            }
         }
         if (isOk) {
            String stationname = inDto.getAsString("stationname");
            if (stationname.length() > 25) {
               isOk = false;
               sb.append(sqeName).append(" ").append("[直放站站点]长度超过25位，导入失败！").append("<br>");
               failCount++;
            }
         }
         if (isOk) {
            g4Dao.insert("deviceMag.importExcel", inDto);
            successCount++;
         }
         
         // 自动生成设备编号。导入模版中没有设备编号列，设备编号列被是否主机列取代。
         /*
          * if (isOk) { // 是否主机 String temp = inDto.getAsString("temp"); if
          * (!StringUtils.isEmpty(temp)) { if ("1".equals(temp)) {// 插入主机
          * inDto.put("parentrepid", 0); inDto.put("statsubid", "00"); int count =
          * (Integer) g4Dao.queryForObject("deviceMag.checkAddForStation",
          * inDto); if (count > 0) { isOk = false; sb.append(sqeName).append("
          * ").append("[主机]已经存在，导入失败！").append("<br>"); failCount++; } else {
          * g4Dao.insert("deviceMag.importExcel", inDto); successCount++; } }
          * else if ("0".equals(temp)) {// 丛机 String parentrepid = (String)
          * g4Dao.queryForObject("deviceMag.getRepeaterid", inDto);
          * inDto.put("parentrepid", parentrepid); if
          * (StringUtils.isEmpty(parentrepid)) { isOk = false;
          * sb.append(sqeName).append(" ").append("[主机]不存在，导入失败！").append("<br>");
          * failCount++; } else { String statsubid = (String)
          * g4Dao.queryForObject("deviceMag.getMaxStatSubId", inDto); statsubid =
          * StringUtils.createCodeForStatsubid(statsubid);
          * inDto.put("statsubid", statsubid);
          * g4Dao.insert("deviceMag.importExcel", inDto); successCount++; } }
          * else { isOk = false; sb.append(sqeName).append("
          * ").append("[是否主机]输入的是非法内容，导入失败！").append("<br>"); failCount++; } }
          * else { isOk = false; sb.append(sqeName).append("
          * ").append("[是否主机]有错，导入失败！").append("<br>"); failCount++; } }
          */
         errorSb.append(sb);
      }
      msg.append("本地导入结果如下：<br>").append("站点信息导入成功").append(successCount).append("条,失败").append(failCount).append("条,");
      if (failCount != 0) {
         msg.append("<br><br>------------具体错误如下：-----------<br>").append(errorSb);
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", msg.toString());
      return outDto;
   }
   
   public void updateStationid(Dto dto) {
      g4Dao.update("deviceMag.updateStation", dto);
   }
   
   public void updateStatsubid(Dto dto) {
      g4Dao.update("deviceMag.updateStatsub", dto);
   }
   
   public boolean repeate(Dto dto) {
      if (dto.containsKey("repeaterid")) {
         int repeaterid = dto.getAsInteger("repeaterid");
         Object obj = g4Dao.queryForObject("deviceMag.repeat", dto);
         if (obj == null) {
            return true;
         }
         else {
            int id = (Integer) obj;
            if (id == 0 || repeaterid == id)
               return true;
            else
               return false;
         }
      }
      else {
         Object obj = g4Dao.queryForObject("deviceMag.repeat", dto);
         if (obj == null) {
            return true;
         }
         else {
            return false;
         }
      }
   }
   
   public boolean isHost(Dto dto) {
      int parent = (Integer) g4Dao.queryForObject("deviceMag.isHost", dto);
      if (parent == 0)
         return true;
      else
         return false;
   }
   
   public Dto updateSub(Dto dto) {
      g4Dao.update("deviceMag.updateSub", dto);
      return null;
   }
   
   public Dto error(Dto dto) {
      Dto result = (Dto) g4Dao.queryForObject("deviceMag.error", dto);
      return result;
   }
   
   public void addFlag(Dto dto) {
      g4Dao.insert("deviceMag.addFlag", dto);
   }

   public Dto queryParam(Dto dto) {
      Dto result=(Dto) g4Dao.queryForObject("deviceMag.queryParam",dto);
      return result;
   }
   
   public Dto reloadParam(Dto inDto) {
      // inDto 传入 repeaterid
      g4Dao.callPrc("deviceMag.reloadRepeaterParam", inDto);
      return inDto;
   }
   
   public Dto delRepeaterParamTemp(Dto dto) {
      g4Dao.delete("deviceMag.deleteRepeaParaTemp", dto);
      return null;
   }
   
   public Dto insertItemTemp(Dto dto) {
      g4Dao.insert("deviceMag.insertRepeaParaTemp", dto);
      return null;
   }

   public Dto queryDataLen(Dto dto) {
      return (Dto)g4Dao.queryForObject("deviceMag.queryDataLen",dto);
   }
   
}
