package com.sunnada.nms.parse;

import java.util.List;
import java.util.Map;

import org.eredlab.g4.ccl.datastructure.Dto;

/**
 * @author zhangys
 * created Dec 13, 2011 all copyright reserved by sunnada 
 * desc 处理联通多协议通讯解析发送逻辑的封装
 */
public class Sender4lt extends AbsSender {
   protected void splitCmdList() {
      // TODO Auto-generated method stub 联通多协议不需要实现
      
   }
   protected void trCmdListMeaning() {
      // TODO Auto-generated method stub 联通多协议不需要实现
      
   }
   public Sender4lt() {
      setHeadLen(11);
      init();
   }
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsSender#buildSendBody(java.util.Map)
    */
   protected void buildSendBody(Map<String, String> params) {
      String sVal, sTmp = "", sPkg;
      int nLen,nLenCnt = 0 ,nCntPkg = 0,nCurrPkg = 0;
      //计算总包数
      for (String sKey : params.keySet()) {
         sVal = params.get(sKey);
         nLen = sVal.length()/2;
         nLenCnt += nLen;
         if (nLenCnt + mHeadLen > mPkgSize) {
            nCntPkg++;
            nLenCnt = nLen;
         }
      }
      nCntPkg++;
      setCntPkg(nCntPkg);
      nLenCnt = 0;
      for (String sKey : params.keySet()) {
         sVal = params.get(sKey);
         nLen = sVal.length()/2;
         if (nLenCnt+nLen+mHeadLen>mPkgSize) {    
            nCurrPkg++;
            setCurrPkg(nCurrPkg);
            sPkg = mDelimStr + mHeadStr + sTmp;
            String str_crc = BitUnit.crc(mHeadStr + sTmp,true);
            sPkg += str_crc + mDelimStr;
            mSendCmdList.add(sPkg);
            nLenCnt = nLen;
            sTmp = "";
         } else 
            nLenCnt += nLen;
         sTmp += sVal;
      }
      nCurrPkg++;
      setCurrPkg(nCurrPkg);
      sPkg = mDelimStr + mHeadStr + sTmp;
      String str_crc = BitUnit.crc(mHeadStr + sTmp,true);
      sPkg += str_crc + mDelimStr;
      mSendCmdList.add(sPkg);
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsSender#buildSendHead(java.lang.String, java.lang.String)
    */
   protected void buildSendHead(String repeaterId, String cmd) {
      Dto headMap = reptInfo.getReptInfoById(repeaterId);
      headMap.put("cmd", cmd); 
      List<Dto> cmdHeadList = cmdHeadInfo.getByProtype(headMap.get("protype").toString());
      StringBuffer sbHead = new StringBuffer();
      String sPmCode,sHCode;
      for (Dto cmdHead : cmdHeadList) {
         sPmCode = cmdHead.get("pmcode").toString();
         sHCode = cmdHead.get("hcode").toString();
         int nLen = Integer.parseInt(cmdHead.get("hlen").toString());
         if (sPmCode.equals("DELIM")) {
            mDelimStr = sHCode;//.substring(getAP(),1);
         } else if (sPmCode.substring(0,1).equals("[")) {
            sHCode = headMap.get(sHCode.toLowerCase()).toString();
         }
         if (nLen > 1) {
            sbHead.append(BitUnit.highToLow(sHCode));
         } else {
            sbHead.append(sHCode);
         }
      }
      mHeadStr = sbHead.toString();
   }
   private void setCntPkg(int cntPkg) {
      String sRep;   
      sRep = BitUnit.intToHex(cntPkg,2);
      mHeadStr = mHeadStr.substring(0, 2) + sRep + mHeadStr.substring(4);      
   }
   private void setCurrPkg(int currPkg) {
      String sRep;   
      sRep = BitUnit.intToHex(currPkg,2);
      mHeadStr = mHeadStr.substring(0, 4) + sRep + mHeadStr.substring(6);      
   }
   /**
    * @param args
    */
   public static void main(String[] args) {
      // TODO Auto-generated method stub
      
   }

   
}
