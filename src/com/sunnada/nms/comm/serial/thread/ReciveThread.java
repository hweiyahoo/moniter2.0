package com.sunnada.nms.comm.serial.thread;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.comm.serial.SerialConnection;
import com.sunnada.nms.dao.ComDataService;
import com.sunnada.nms.dao.DevSetBoardInitService;
import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.message.util.AnalysisBag;
import com.sunnada.nms.util.BitUnit;
import com.sunnada.nms.util.ConstDefine;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.MapKeyDefine;
import com.sunnada.nms.util.PackageFieldDefine;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.sys.DMParamPush;

/**
 * @author linxingyu
 * @version 创建时间：2011-8-31 下午01:38:54 串口接收数据解析类
 */
public class ReciveThread /*extends Thread */{
   private static Logger    logger           = Logger.getLogger(ReciveThread.class);
   public String            recvData         = "";
   private String           leftData         = "";
   public boolean           stop             = false;
   private ComDataService   cdService        = (ComDataService) SpringBeanLoader
                                                   .getSpringBean("ComDataService");
   private DeviceMagService deviceMagService = (DeviceMagService) SpringBeanLoader
                                                   .getSpringBean("deviceMagService");
   
   public void run() {
//      while (true) {
//         if (stop)
//            break;
         Map result = ReceiveMsg();
//         if (result == null)
//            continue;
         if (result.get(MapKeyDefine.Map_Key_Result).equals(ConstDefine.CON_RESULT_OK)) {
            Map dduMap = (Map) result.get(MapKeyDefine.Map_Key_DDU);
            Set set = dduMap.keySet();
            if (set.contains("0009")) {// 读取监控列表
               int count = Integer.parseInt(result.get(MapKeyDefine.Map_Key_Count)
                     .toString(), 16);
               int num = Integer.parseInt(
                     result.get(MapKeyDefine.Map_Key_Num).toString(), 16);
               if (num < count) {
                  DevSetBoardInitService devSetBoardInitService = (DevSetBoardInitService) SpringBeanLoader
                        .getSpringBean("devSetBoardInitService");
                  Dto dto = new BaseDto();
                  dto.put("stationid", result.get(MapKeyDefine.Map_Key_Repater_Num));
                  dto.put("statsubid", result.get(MapKeyDefine.Map_Key_Device_Num));
                  Dto resultDto = devSetBoardInitService.checkProtypeDtoAndRePId(dto);
                  ArrayList list = BitUnit.sendCommandData(resultDto
                        .getAsString("repeaterid"), "0009", "02", "",
                        StringUtils.complete(String.valueOf(count), "0", 2) + StringUtils
                                    .complete(String.valueOf(num + 1), "0", 2));
                  for (int i = 0; i < list.size(); i++) {
                     logger.info("发送查询列表指令" + list.get(0).toString());
                     SerialConnection.getInstance().SendCMD(
                           StringUtils.charTobyte(list.get(i).toString()));
                  }
               }
               else if (num == count) {
                  String stationid = (String) result
                        .get(MapKeyDefine.Map_Key_Repater_Num);
                  String statsubid = (String) result.get(MapKeyDefine.Map_Key_Device_Num);
                  Dto dto = new BaseDto();
                  dto.put("stationid", stationid);
                  dto.put("statsubid", statsubid);
                  dto = deviceMagService.queryProtype(dto);
                  String repeaterid = dto.getAsString("repeaterid");
                  DMParamPush.getInstance().updateMonitorParamList(repeaterid);
                  logger.info("读取完毕");
               }
            }
            else if (set.contains("01C3")) {
               
            }
         }
//      }
      logger.info("退出串口");
   }
   
   private Map AnalyseBag(String ABag) {
      AnalysisBag a = new AnalysisBag(ABag);
      
      return a.getAnalysizResult(); // 获得返回值
   }
   
   private Map ReceiveMsg() {
      // 接收完之后，进行对接收到的数据进行处理，按照7E为包头包尾的原则。
      int[] recArrInt;
      Map result = null;
      logger.info(recvData);
      String sRec = leftData + recvData;
      recvData = "";
      recArrInt = StringUtils.charToInt(sRec);
      leftData = ""; // 清空上次接收到的剩余包
      String sBag = null;
      int iBegin = -1, iEnd = -1;
      // 查找包头和包尾
      for (int i = 0; i <= recArrInt.length - 1; i++) {
         char ch = (char) PackageFieldDefine.CON_BAG;
         if (recArrInt[i] == ch) {
            if (iBegin == -1) {
               iBegin = i;
            }
            else {
               iEnd = i;
               // 当发现第2个7E时，就认为包截取成功
               sBag = AnalysisBag.hIntToStr(recArrInt, iBegin, iEnd + 1 - iBegin);
               result = AnalyseBag(sBag);
               ConstDefine cRet = (ConstDefine) result.get(MapKeyDefine.Map_Key_Result);
               if (cRet == ConstDefine.CON_RESULT_EMPTY_BAG) {
                  // 当为空包时，很可能第一个是包尾，第二个是包头。
                  iBegin = iEnd;
                  iEnd = -1;
                  continue;
               }
               if ((cRet == ConstDefine.CON_RESULT_BAG_ERR) || (cRet == ConstDefine.CON_RESULT_DDU_LEN_ERR)
                   || (cRet == ConstDefine.CON_RESULT_FAIL)) {
                  // 当包头、包尾错误时，当DDU单元数据长度不对时，还有解析失败，丢弃此包
                  break;
               }
               if (cRet == ConstDefine.CON_RESULT_OK) {
                  // 当为完整包时，继续截取下一个包
                  iBegin = -1;
                  iEnd = -1;
                  sRec = "";
                  logger.info("串口接收到完整数据包:" + sBag);
                  Dto dto = new BaseDto();
                  dto.put("com", "COM");
                  dto.put("cmddetail", sBag);
                  dto.put("insertdate", DateTimeUtils.getDateSecondFormat());
                  dto.put("flag", "1");
                  cdService.insertItem(dto);
                  
               }
            }
         }
      }
      // 如果没有找到包尾
      if (iEnd == -1) {
         leftData = sRec;
      }
      return result;
      
   }
   
   public String getLeftData() {
      return leftData;
   }
   
   public void setLeftData(String leftData) {
      this.leftData = leftData;
   }
   
   public void setRecvData(String recvData) {
      this.recvData = this.recvData + recvData;
      
   }
   
}
