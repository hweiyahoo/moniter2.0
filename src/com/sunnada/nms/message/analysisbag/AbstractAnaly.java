package com.sunnada.nms.message.analysisbag;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.dao.UpdateService;
import com.sunnada.nms.message.pack.AbstractPack;
import com.sunnada.nms.parse.AbsRecver;
import com.sunnada.nms.parse.AidParser;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.StringUtils;

/**
 * @author linxingyu
 * @version 创建时间：2011-12-29 下午03:05:02 封转包抽象类
 */
public abstract class AbstractAnaly {
   AbsRecver absRecver;
   
   /**
    * 保存告警
    * 
    * @param report
    *           是否主动上报
    * @param recover
    *           是否恢复告警
    * @param paramcode
    * @param value
    */
   protected void saveAlarm(boolean report, boolean recover, String paramcode,
                            String value, String repeaterid, String stationid,
                            String statsubid, String province, String city,
                            String alarmtype, String paramname) {
      Dto dto = new BaseDto();
      dto.put("repeaterid", repeaterid);
      dto.put("alarmtime", DateTimeUtils.getDateSecondFormat());
      dto.put("detail", paramname);
      dto.put("province", province);
      dto.put("city", city);
      dto.put("paramcode", paramcode);
      dto.put("alarmtype", alarmtype);
      if (report) {
         if (!recover) { // 主动告警
            UpdateService update = (UpdateService) SpringBeanLoader
                  .getSpringBean("updateService");
            update.insertAlarm(dto);
         }
         else { // 主动告警恢复
            UpdateService update = (UpdateService) SpringBeanLoader
                  .getSpringBean("updateService");
            dto.put("flag", "2");
            dto.put("recovertime", DateTimeUtils.getDateSecondFormat());
            update.modifyAlarm(dto);
         }
      }
      saveValue(repeaterid, paramcode, value, false,stationid,statsubid);
   }
   
   // pool 是否轮询，true:是
   protected void saveValue(String repeaterid, String paramcode, String value,
                            boolean pool,String stationid,String statsubid) {
      specialSave(stationid,statsubid, paramcode, value);
      Dto dto = new BaseDto();
      dto.put("repeaterid", repeaterid);
      dto.put("paramcode", paramcode);
      dto.put("rval1", value);
      UpdateService update = (UpdateService) SpringBeanLoader
            .getSpringBean("updateService");
      update.updateParam(dto);
      if (pool) {
         IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
         Dto inDto = new BaseDto();
         inDto.put("flag", "1");
         inDto.put("pollbegintime", DateTimeUtils.getDateSecondFormat());
         Dto dto1 = (Dto) g4Dao.queryForObject("reqpollcfg.queryPollployForList", inDto);
         String pollid = dto1.getAsString("pollployid");
         dto.put("pollid", pollid);
         dto.put("time", DateTimeUtils.getDateSecondFormat());
         g4Dao.insert("reqpollcfg.saveReport", dto);
      }
   }
   
   // 监控列表
   protected void saveParamList(String repeaterid, String paramcode) {
      DeviceMagService deviceMagService = (DeviceMagService) SpringBeanLoader
            .getSpringBean("deviceMagService");
      Dto dto = new BaseDto();
      dto.put("repeaterid", repeaterid);
      dto.put("paramcode", paramcode);
      deviceMagService.insertItemTemp(dto);
   }
   
   protected abstract void specialSave(String stationid,String statsubid, String paramcode, String value);
   
   public abstract AbstractPack analy(String cmd);
   
   // flag:接收或发送算法，true：接收，flase：发送
   public static String getValue(String protype, String paramcode, String value, boolean flag) {
      DeviceMagService deviceMagService = (DeviceMagService) SpringBeanLoader
            .getSpringBean("deviceMagService");
      Dto dto = new BaseDto();
      dto.put("protype", protype);
      dto.put("paramcode", paramcode);
      Dto result = deviceMagService.queryParam(dto);
      if (result == null) {
         return null;
      }
      else {
         if (flag) { // 接收
            AidParser parser = new AidParser();
            String regex = "(FF)+";    // FFFFFFFFF为下位机初始化数据
            String iRArithmetic = result.getAsString("rarithmetic");
            String iDataType = result.getAsString("datatype");
            String dataLen = result.getAsString("datalen");
            if ("f(23)".equals(iRArithmetic)) {
               value = parser.highToLow(value);
               return parser.f23(value);
            }
            else if ("f(22)".equals(iRArithmetic)) {
               value = parser.highToLow(value);
               return parser.f22(value);
            }
            else if ("X/10".equals(iRArithmetic)) {
               return parser.D10(value, dataLen);
            }
            else if ("".equals(iDataType) || iDataType == null
                     || "uint4".equals(iDataType)) {
               return value;
            }
            else if ("bit".equals(iDataType)) {
               int temp = Integer.parseInt(value, 16);
               return String.valueOf(temp);
            }
            else if ("str".equals(iDataType)) {
               if (value.matches(regex)) {
                  return "";
               }
               else {
                  value = parser.highToLow(value);
                  return parser.HexToStr(value);
               }
            }
            else if (iDataType.startsWith("uint")) {
               return String.valueOf(parser.UnitToStr(value));
            }
            else if (iDataType.startsWith("sint")) {
               return String.valueOf(parser.SintToStr(value, dataLen));
            }
            else {
               return value;
            }
         }
         else{       //发送
            AidParser parser = new AidParser();
            String lSArithmetic = result.getAsString("sarithmetic");
            String iDataType = result.getAsString("datatype");
            String dataLen = result.getAsString("datalen");
            if ("f(13)".equals(lSArithmetic)) {
               return parser.f13(value);
            }
            else if ("f(12)".equals(lSArithmetic)) {
               return parser.f12(value); 
            }
            else if ("X*10".equals(lSArithmetic)) {
               value = parser.X10(value, dataLen);
               return parser.highToLow(value);
            }
            else if ("".equals(iDataType) || iDataType == null
                     || "bit".equals(iDataType)
                     || "uint4".equals(iDataType)) {
               return parser.highToLow(value);
               
            }
            else if (iDataType.startsWith("uint")) {
               int temp = Integer.parseInt(value);
               return parser.highToLow(StringUtils.complete(Integer.toHexString(temp),
                     "0", Integer.parseInt(dataLen) * 2));
               //vMonVal[i] = vMonVal[i];
               
            }
            else if (iDataType.startsWith("sint")) {
               int temp = Integer.parseInt(value);
               if (temp < 0) {
                  temp = temp & parser.getFF(Integer.parseInt(value));
               }
               value = StringUtils.complete(Integer.toHexString(temp),
                     "0", Integer.parseInt(dataLen) * 2).toUpperCase();
               return parser.highToLow(value);
               
            }
            else if ("str".equals(iDataType)) {
               String temp = value;
               char[] ch = temp.toCharArray();
               value = "";
               for (int j = 0; j < ch.length; j++) {
                  int x = ch[j];
                  value = value + Integer.toHexString(x)
                                     .toUpperCase();
               }
              return StringUtils.rComplete(value, "0", Integer
                     .parseInt(dataLen) * 2);
            }
         }
      }
      return null;
   }
}
