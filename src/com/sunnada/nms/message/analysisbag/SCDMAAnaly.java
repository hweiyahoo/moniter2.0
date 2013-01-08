package com.sunnada.nms.message.analysisbag;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.dao.UpdateService;
import com.sunnada.nms.message.pack.AbstractPack;
import com.sunnada.nms.message.pack.AlarmPack;
import com.sunnada.nms.message.pack.ErrorPack;
import com.sunnada.nms.message.pack.HeartBeatPack;
import com.sunnada.nms.message.pack.InitQueryPack;
import com.sunnada.nms.message.pack.InitSetupPack;
import com.sunnada.nms.message.pack.LoginPack;
import com.sunnada.nms.message.pack.OpenPack;
import com.sunnada.nms.message.pack.ParamListPack;
import com.sunnada.nms.message.pack.QueryPack;
import com.sunnada.nms.message.pack.SetupPack;
import com.sunnada.nms.parse.AidParser;
import com.sunnada.nms.parse.Recver4yd;
import com.sunnada.nms.util.Error;
import com.sunnada.nms.util.StringUtils;

/**
 * @author linxingyu
 * @version 创建时间：2011-12-29 下午03:16:21 类说明
 */
public class SCDMAAnaly extends AbstractAnaly {
   
   @Override
   public AbstractPack analy(String cmd) {
      if ("".equals(cmd) || cmd == null) {
         return null;
      }
      absRecver = new Recver4yd(cmd);
      try {
         absRecver.buildRecvStr();
      }
      catch (Exception e) {
         return new ErrorPack();
      }
      Dto dto = new BaseDto();   
      dto.put("stationid", absRecver.getStationId());
      dto.put("statsubid", absRecver.getStatSubId());
      DeviceMagService deviceMagService = (DeviceMagService) SpringBeanLoader
            .getSpringBean("deviceMagService");
      Dto result = deviceMagService.queryProtype(dto); // 含有
      // repeaterid,province,city
      Map map = absRecver.getRecvBodyList();
      String cmdIdentifier = absRecver.getRecvHeadMap().get("CMD").toString();
      String respFlag = absRecver.getRecvHeadMap().get("RECVFLAG").toString();
      if ("01".equals(cmdIdentifier) && "FF".equals(respFlag)) { // 主动上报+应答表示为FF
         if (map.containsKey("0141")) {
            String value = map.get("0141").toString();
            if ("06".equals(value)) { // 心跳
               LoginPack pack = new LoginPack();
               pack.setCmd(cmd);
               pack.setDdu(map);
               pack.setStationid(absRecver.getStationId());
               pack.setStatsubid(absRecver.getStatSubId());
               pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
               return pack;
            }
            else if ("07".equals(value)) { // 登录
               HeartBeatPack pack = new HeartBeatPack();
               pack.setCmd(cmd);
               pack.setDdu(map);
               pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
               pack.setStationid(absRecver.getStationId());
               pack.setStatsubid(absRecver.getStatSubId());
               return pack;
            }
            else if ("02".equals(value)) { // 开站上报
               OpenPack pack = new OpenPack();
               pack.setCmd(cmd);
               pack.setDdu(map);
               pack.setStationid(absRecver.getStationId());
               pack.setStatsubid(absRecver.getStatSubId());
               pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
               return pack;
            }
            else if ("01".equals(value)) {
               AlarmPack pack = new AlarmPack();
               pack.setCmd(cmd);
               pack.setDdu(map);
               pack.setStationid(absRecver.getStationId());
               pack.setStatsubid(absRecver.getStatSubId());
               pack.setRepeaterid(result.getAsString("repeaterid"));
               pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
               Set set = map.keySet();
               Iterator it = set.iterator();
               while (it.hasNext()) {
                  String key = (String) it.next();
                  if ("0141".equals(key))
                     continue;
                  else {
                     String keyValue = map.get(key).toString();
                     dto = new BaseDto();
                     dto.put("paramcode", key);
                     dto.put("protype", result.getAsString("protype"));
                     Dto result1 = deviceMagService.queryParam(dto);
                     if (result1 == null)
                        break;
                     if ("01".equals(keyValue)) { // 告警上报
                        saveAlarm(true, false, key, keyValue, result
                              .getAsString("repeaterid"), absRecver.getStationId(),
                              absRecver.getStatSubId(), result.getAsString("province"),
                              result.getAsString("city"), result1
                                    .getAsString("alarmtype"), result1
                                    .getAsString("paramname"));
                     }
                     else if ("00".equals(keyValue)) { // 告警恢复上报
                        saveAlarm(true, true, key, keyValue, result
                              .getAsString("repeaterid"), absRecver.getStationId(),
                              absRecver.getStatSubId(), result.getAsString("province"),
                              result.getAsString("city"), result1
                                    .getAsString("alarmtype"), result1
                                    .getAsString("paramname"));
                     }
                  }
               }
               return pack;
            }
         }
      }
      else if ("02".equals(cmdIdentifier) && "00".equals(respFlag)) {// 查询命令+00命令正确执行
         if ("0000".equals(absRecver.getRecvHeadMap().get("NUM").toString())) { // 轮询
         
         }
         else {
            if (map.containsKey("0009")) { // 读取监控列表
               AidParser parser=new AidParser();
               String value = map.get("0009").toString();
               String count = value.substring(0, 2);
               String num = value.substring(2, 4);
               if ("01".equals(num)) { // 第一个包，删除临时表
                  dto = new BaseDto();
                  dto.put("repeaterid", result.getAsString("repeaterid"));
                  deviceMagService.delRepeaterParamTemp(dto);
               }
               String[] paramCode = new String[value.length() / 4 - 1];
               for (int j = 0; j < paramCode.length; j++) {
                  paramCode[j] = parser.highToLow(value.substring(4 + 4 * j, 8 + 4 * j));
                  saveParamList(result.getAsString("repeaterid"), paramCode[j]);
               }
               if (num.equals(count)) { // 最后一个包
                  dto = new BaseDto();
                  dto.put("repeaterid", result.getAsString("repeaterid"));
                  deviceMagService.reloadParam(dto);
               }
               ParamListPack pack = new ParamListPack();
               pack.setCmd(cmd);
               pack.setCount(count);
               pack.setNum(num);
               pack.setDdu(map);
               pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
               pack.setRepeaterid(result.getAsString("repeaterid"));
               pack.setStationid(absRecver.getStationId());
               pack.setStatsubid(absRecver.getStatSubId());
               return pack;
            }
            else if (map.containsKey("01C3")) { // 监控板初始化
               InitQueryPack pack=new InitQueryPack();
               pack.setCmd(cmd);
               pack.setStationid(absRecver.getStationId());
               pack.setStatsubid(absRecver.getStatSubId());
               pack.setDdu(map);
               pack.setPackNum(absRecver.getRecvHeadMap().get("NUM").toString());
               pack.setRespFlag(respFlag);
               pack.setResult("");
               Set set=map.keySet();
               Iterator it=set.iterator();
               while(it.hasNext()){
                  String key=(String)it.next();
                  if("01C3".equals(key))
                     continue;
                  String value=(String)map.get(key);
                  if("0101".equals(key))
                     pack.setQueryStationid((String)map.get(key));
                  else if("0102".equals(key))
                     pack.setQueryStatsubid((String)map.get(key));
                  else if("0110".equals(key))
                     pack.setTelephone((String)map.get(key));
               }
               return pack;  
            }
            else { // 普通查询命令
               Set set = map.keySet();
               Iterator it = set.iterator();
               String paramclass="";
               while (it.hasNext()) {
                  String key = (String) it.next();
                  String value = (String) map.get(key);
                  value = getValue(result.getAsString("protype"), key, value, true);
                  saveValue(result.getAsString("repeaterid"), key, value, false,absRecver.getStationId(),absRecver.getStatSubId());
                  dto=new BaseDto();
                  dto.put("paramcode", key);
                  dto.put("protype", result.getAsString("protype"));
                  Dto result1=deviceMagService.queryClass(dto);
                  paramclass=result1.getAsString("paramclass");                 
               }
               QueryPack pack=new QueryPack();
               pack.setCmd(cmd);
               pack.setDdu(map);
               pack.setParamclass(paramclass);
               pack.setRespFlag(respFlag);
               pack.setPackNum(absRecver.getRecvHeadMap().get("NUM").toString());
               pack.setRepeaterid(result.getAsString("repeaterid"));
               pack.setProtype(result.getAsString("protype"));
               pack.setStationid(absRecver.getStationId());
               pack.setStatsubid(absRecver.getStatSubId());
               return pack;
            }
         }
      }
      else if("02".equals(cmdIdentifier) && "01".equals(respFlag)){     //查询命令被有条件执行
         if ("0000".equals(absRecver.getRecvHeadMap().get("NUM").toString())) { // 轮询
            
         }
         else if(map.containsKey("11C3")||map.containsKey("21C3")||map.containsKey("31C3")||map.containsKey("41C3")||map.containsKey("51C3")||map.containsKey("61C3")||map.containsKey("71C3")||map.containsKey("91C3")){
            InitQueryPack pack=new InitQueryPack();
            pack.setCmd(cmd);
            pack.setStationid(absRecver.getStationId());
            pack.setStatsubid(absRecver.getStatSubId());
            pack.setPackNum(absRecver.getRecvHeadMap().get("NUM").toString());
            pack.setDdu(map);
            pack.setRespFlag(respFlag);
            String temp="";
            Set set=map.keySet();
            Iterator it=set.iterator();
            while(it.hasNext()){
               String key=(String)it.next();
               String value=(String)map.get(key);
               if(key.endsWith("1C3"))
                  continue;
               else{
                  if(!key.startsWith("0")){
                     temp=temp+Error.getReason(key);
                  }
                  if(key.startsWith("0")||key.startsWith("2")){
                     key="0"+key.substring(1);
                     if("0101".equals(key))
                        pack.setQueryStationid(value);
                     else if("0102".equals(key))
                        pack.setQueryStatsubid(value);
                     else if ("0110".equals(key)) {
                        pack.setTelephone(value);
                     }
                  }
               }
            }
            pack.setResult(temp);
            return pack;  
         }
         else{
            QueryPack pack=new QueryPack();
            pack.setCmd(cmd);
            pack.setPackNum(absRecver.getRecvHeadMap().get("NUM").toString());
            pack.setRepeaterid(result.getAsString("repeaterid"));
            pack.setProtype(result.getAsString("protype"));
            pack.setStationid(absRecver.getStationId());
            pack.setStatsubid(absRecver.getStatSubId());
            pack.setRespFlag(respFlag);
            Set set = map.keySet();
            Iterator it = set.iterator();
            String paramclass="";
            String temp="";
            while (it.hasNext()) {
               String key = (String) it.next();
               String value = (String) map.get(key);
               if(!key.startsWith("0")){
                  temp=temp+Error.getReason(key);
               }
               if(key.startsWith("0")||key.startsWith("2")){
                  key="0"+key.substring(1);
                  value = getValue(result.getAsString("protype"), key, value, true);
                  saveValue(result.getAsString("repeaterid"), key, value, false,absRecver.getStationId(),absRecver.getStatSubId());
               }
               dto=new BaseDto();
               dto.put("paramcode", "0"+key.substring(1));
               dto.put("protype", result.getAsString("protype"));
               Dto result1=deviceMagService.queryClass(dto);
               paramclass=result1.getAsString("paramclass");     
            }
            pack.setParamclass(paramclass);
            pack.setResult(temp);
            return pack;
         }
      }
      else if("02".equals(cmdIdentifier)&&!"01".equals(respFlag)&&!"00".equals(respFlag)){  //查询命令，返回出错
         QueryPack pack=new QueryPack();
         pack.setCmd(cmd);
         pack.setPackNum(absRecver.getRecvHeadMap().get("NUM").toString());
         pack.setRepeaterid(result.getAsString("repeaterid"));
         pack.setProtype(result.getAsString("protype"));
         pack.setStationid(absRecver.getStationId());
         pack.setStatsubid(absRecver.getStatSubId());
         pack.setRespFlag(respFlag);
         Dto temp=new BaseDto();
         temp.put("protype", result.getAsString("protype"));
         temp.put("respcode", respFlag);
         Dto result1=deviceMagService.error(temp);
         pack.setResult(result1.getAsString("respname"));
         return pack;
      }
      else if("03".equals(cmdIdentifier)&&"00".equals(respFlag)){//设置命令+00命令正确执行
         if(map.containsKey("01C3")){
            InitSetupPack pack=new InitSetupPack();
            pack.setCmd(cmd);
            pack.setDdu(map);
            pack.setPackNum(absRecver.getRecvHeadMap().get("NUM").toString());
            pack.setRespFlag(respFlag);
            pack.setResult("");
            pack.setStationid(absRecver.getStationId());
            pack.setStatsubid(absRecver.getStatSubId());
            Set set=map.keySet();
            Iterator it=set.iterator();
            while(it.hasNext()){
               String key=(String)it.next();
               String value=(String)map.get(key);
               if("01C3".equals(key))
                  break;
               else if("0101".equals(key))
                  pack.setSetupStationid(value);
               else if("0102".equals(key))
                  pack.setSetupStatsubid(value);
               else if("0111".equals(key))
                  pack.setTelephone(value);
            }
            return pack;
         }//设置监控列表
         else{//普通设置命令
            Set set = map.keySet();
            Iterator it = set.iterator();
            String paramclass="";
            while (it.hasNext()) {
               String key = (String) it.next();
               String value = (String) map.get(key);
               value = getValue(result.getAsString("protype"), key, value, true);
               saveValue(result.getAsString("repeaterid"), key, value, false,absRecver.getStationId(),absRecver.getStatSubId());
               dto=new BaseDto();
               dto.put("paramcode", key);
               dto.put("protype", result.getAsString("protype"));
               Dto result1=deviceMagService.queryClass(dto);
               paramclass=result1.getAsString("paramclass");                 
            }
            SetupPack pack=new SetupPack();
            pack.setCmd(cmd);
            pack.setDdu(map);
            pack.setParamclass(paramclass);
            pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
            pack.setRepeaterid(result.getAsString("repeaterid"));
            pack.setProtype(result.getAsString("protype"));
            pack.setStationid(absRecver.getStationId());
            pack.setStatsubid(absRecver.getStatSubId());
            pack.setRespFlag(respFlag);
            return pack;
         }
      }
      else if("03".equals(cmdIdentifier)&&("01".equals(respFlag))){//设置命令，被有条件执行
         if(map.containsKey("11C3")||map.containsKey("21C3")||map.containsKey("31C3")||map.containsKey("41C3")||map.containsKey("51C3")||map.containsKey("61C3")||map.containsKey("71C3")||map.containsKey("91C3")){
            InitSetupPack pack=new InitSetupPack();
            pack.setCmd(cmd);
            pack.setDdu(map);
            pack.setPackNum(absRecver.getRecvHeadMap().get("NUM").toString());
            pack.setRespFlag(respFlag);
            pack.setStationid(absRecver.getStationId());
            pack.setStatsubid(absRecver.getStatSubId());
            Set set=map.keySet();
            Iterator it=set.iterator();
            String temp="";
            while(it.hasNext()){
               String key=(String)it.next();
               String value=(String)map.get(key);
               if(key.endsWith("1C3"))
                  break;
               else{
                  if(!key.startsWith("0")){
                     temp=temp+Error.getReason(key);
                  }
                  if(key.startsWith("0")||key.startsWith("2")){
                     key="0"+key.substring(1);
                     if("0101".equals(key))
                        pack.setSetupStationid(value);
                     else if("0102".equals(key))
                        pack.setSetupStatsubid(value);
                     else if("0111".equals(key))
                        pack.setTelephone(value);
                  }
               }
            }
            pack.setResult(temp);
            return pack;
         }
         else{//普通设置命令
            Set set = map.keySet();
            Iterator it = set.iterator();
            String paramclass="";
            String temp="";
            while (it.hasNext()) {
               String key = (String) it.next();
               String value = (String) map.get(key);
               if(!key.startsWith("0")){
                  temp=temp+Error.getReason(key);
               }
               if(key.startsWith("0")||key.startsWith("1")){
                  key="0"+key.substring(1);
                  value = getValue(result.getAsString("protype"), key, value, true);
                  saveValue(result.getAsString("repeaterid"), key, value, false,absRecver.getStationId(),absRecver.getStatSubId());
               }
               dto=new BaseDto();
               dto.put("paramcode", "0"+key.substring(1));
               dto.put("protype", result.getAsString("protype"));
               Dto result1=deviceMagService.queryClass(dto);
               paramclass=result1.getAsString("paramclass");                 
            }
            SetupPack pack=new SetupPack();
            pack.setCmd(cmd);
            pack.setDdu(map);
            pack.setParamclass(paramclass);
            pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
            pack.setRepeaterid(result.getAsString("repeaterid"));
            pack.setProtype(result.getAsString("protype"));
            pack.setStationid(absRecver.getStationId());
            pack.setStatsubid(absRecver.getStatSubId());
            pack.setRespFlag(respFlag);
            pack.setResult(temp);
            return pack;
         }
      }
      else if("03".equals(cmdIdentifier)&&!"01".equals(respFlag)&&!"00".equals(respFlag)){   //设置命令，出错
         SetupPack pack=new SetupPack();
         pack.setCmd(cmd);
         pack.setNumPack(absRecver.getRecvHeadMap().get("NUM").toString());
         pack.setRepeaterid(result.getAsString("repeaterid"));
         pack.setProtype(result.getAsString("protype"));
         pack.setStationid(absRecver.getStationId());
         pack.setStatsubid(absRecver.getStatSubId());
         pack.setRespFlag(respFlag);
         Dto temp=new BaseDto();
         temp.put("protype", result.getAsString("protype"));
         temp.put("respcode", respFlag);
         Dto result1=deviceMagService.error(temp);
         pack.setResult(result1.getAsString("respname"));
         return pack;
      }
      return null;
   }
   
   @Override
   protected void specialSave(String stationid, String statsubid, String paramcode,
                              String value) {
      UpdateService update = (UpdateService) SpringBeanLoader
            .getSpringBean("updateService");
      if ("0003".equals(paramcode)) {// 修改repeaterin  fo中的devicetype
         Dto temp1 = new BaseDto();
         temp1.put("stationid", stationid);
         temp1.put("statsubid", statsubid);
         temp1.put("devicetype", StringUtils.complete(value, "0", 2));
         update.updateInfo(temp1);
      }
      if ("0007".equals(paramcode)) {// X
         Dto temp1 = new BaseDto();
         temp1.put("stationid", stationid);
         temp1.put("statsubid", statsubid);
         if (!"".equals(value)) {
            temp1.put("x", value);
         }
         else {
            temp1.put("x", "");
         }
         update.updateInfo(temp1);
      }
      if ("0008".equals(paramcode)) {// y
         Dto temp1 = new BaseDto();
         temp1.put("stationid", stationid);
         temp1.put("statsubid", statsubid);
         if (!"".equals(value)) {
            temp1.put("y", value);
         }
         else {
            temp1.put("y", "");
         }
         update.updateInfo(temp1);
      }
   }
   
}
