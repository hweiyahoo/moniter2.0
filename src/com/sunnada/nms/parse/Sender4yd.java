package com.sunnada.nms.parse;

import java.util.List;
import java.util.Map;

import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.StringUtils;


/**
 * @author zhangys
 * created Dec 5, 2011 all copyright reserved by sunnada
 * desc:处理移动通讯协议发送解析逻辑的封装 
 */
public class Sender4yd extends AbsSender {
   protected static int packNum=1;
   
   protected void splitCmdList() {      
      for (String str : mSendCmdList) {
         mDealedSendCmdList.add(StringUtils.charTobyteModem(str));
      }
   }
   protected String getCommNum() {
      AidParser parser=new AidParser();
      String vResult = parser.wordToFourAscii(parser.getUnsignedByte(packNum));
      packNum = parser.getUnsignedByte((parser.getUnsignedByte(packNum)) + 1);
      if (packNum > 0x7FFF) {
         packNum = 1;
      }
      return vResult;
   }
   
   protected String getAp(String channelcode){
      if("13".equals(channelcode)){
         setApType("03");
         return "03";
      }
      else if("03".equals(channelcode)){
         setApType("02");
         return "02";
      }
      setApType("03");
      return "03";
   }
   
   protected void trCmdListMeaning() {
      AidParser parser=new AidParser();
      for (String str : mSendCmdList) {
         byte[] temp=parser.dePressStr(str);
         mDealedSendCmdList.add(temp);
      }   
   }
   public Sender4yd() {
      setHeadLen(26);//去掉开始标志
      init();
   }
   /**
    * 生成发送字条串列表关键方法，参数是监控量和监控值关系，这个由调用方法组织生成
    */
   protected void buildSendBody(Map<String, String> params) {
      AidParser parser=new AidParser();
      String sVal, sTmp = "", sPkg;
      int nLen,nLenCnt = 0;
      for (String sKey : params.keySet()) {
         sVal = params.get(sKey);
         nLen = sKey.length() + sVal.length() + 2;
         nLenCnt += nLen;
         if (nLenCnt + mHeadLen+8 > mPkgSize) { //+8 是要加上4位CRC 2位结束标志  2位开始标志  
            sPkg = mDelimStr + mHeadStr + sTmp;
            String str_crc = parser.crc(mHeadStr + sTmp,true);
            sPkg += str_crc + mDelimStr;
            mSendCmdList.add(sPkg);
            nLenCnt = nLen;
            sTmp = "";
         }
         sTmp += parser.intToHex(nLen/2,2) + parser.highToLow(sKey) + sVal;
      }
      sPkg = mDelimStr+mHeadStr + sTmp;
      String str_crc = parser.crc(mHeadStr + sTmp,true);
      sPkg += str_crc + mDelimStr;
      mSendCmdList.add(sPkg);
   }
  
   
   protected void buildSendHead(String repeaterId, String cmd,String packNum,String respFlag,String vp) {   
      AidParser parser=new AidParser();
      Dto headMap = reptInfo.getReptInfoById(repeaterId);
      headMap.put("cmd", cmd);
      headMap.put("code", headMap.getAsString("stationid"));
      headMap.put("scode", headMap.getAsString("statsubid"));
      String apTem=getAp(headMap.getAsString("channelcode"));
      setApType(apTem);
      if("01".equals(apTem))
         headMap.put("ap", "02");
      else {
         headMap.put("ap", apTem);
      }
      headMap.put("vp", vp);
      if("".equals(packNum)){
         headMap.put("num",getCommNum());//通信包要计算
      }
      else
         headMap.put("num",packNum);
      List<Dto> cmdHeadList = cmdHeadInfo.getByProtype(headMap.getAsString("protype"));
      StringBuffer sbHead = new StringBuffer();
      String sPmCode,sHCode;
      for (Dto cmdHead : cmdHeadList) {
         sPmCode = cmdHead.getAsString("pmcode");
         sHCode = cmdHead.getAsString("hcode");
         int nLen = Integer.parseInt(cmdHead.getAsString("hlen"));
         if("end".equals(sPmCode))
            break;
         if (sPmCode.equals("DELIM")) {
            int temp=Integer.parseInt(getAp(headMap.getAsString("channelcode")));
            mDelimStr = String.valueOf(sHCode.charAt(temp-1));
            sHCode="";
         } else if(sPmCode.startsWith("[")){
            sHCode = headMap.getAsString(sHCode.toLowerCase());
         }
         if("RECVFLAG".equals(sPmCode)&&!"".equals(respFlag)){
            sHCode=respFlag;
         }
         if (nLen > 1) {
            sbHead.append(parser.highToLow(sHCode));
         } else {
            sbHead.append(sHCode);
         }
      }
      mHeadStr = sbHead.toString();
   }
   
   /**
    * @param args
    */
   public static void main(String[] args) {
      // TODO Auto-generated method stub
      
   }
   
}
