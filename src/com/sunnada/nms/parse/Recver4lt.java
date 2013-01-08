package com.sunnada.nms.parse;

import java.util.List;

import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.dao.ReptParamInfo;

/**
 * @author zhangys
 * created Dec 13, 2011 all copyright reserved by sunnada 
 * desc:处理联通多协议接收通讯解析逻辑的封装
 */
public class Recver4lt extends AbsRecver {
   private ReptParamInfo reptParamInfo;
   /**
    * @return the reptParamInfo
    */
   public ReptParamInfo getReptParamInfo() {
      return reptParamInfo;
   }
   /**
    * @param reptParamInfo the reptParamInfo to set
    */
   public void setReptParamInfo(ReptParamInfo reptParamInfo) {
      this.reptParamInfo = reptParamInfo;
   }
   public Recver4lt(String sRecvStr) {
      init();
      setHeadLen(11);
      recvStr = sRecvStr;
      ReptParamInfo reptParamInfo = (ReptParamInfo) SpringBeanLoader.getSpringBean("reptParamInfo");
      setReptParamInfo(reptParamInfo);
   }
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#buildRecvBody()
    */
   protected void buildRecvBody() {
      int nStrLen =  recvStr.length();
      int nPos = headLen;
      int nSeq = 1;
      String sLen =  recvStr.substring(nPos,2);
      int nBodyLen = Integer.parseInt(sLen,16);
      String sBody = recvStr.substring(nPos,nStrLen); 
      String sReptID = getRepeaterId();
      String sCmd = getCmdType();
      String sCode, sVal;
      int nLen;
      List<Dto> paramInfo = reptParamInfo.getParamInfoByReptIDType(sReptID, sCmd);
      for (Dto param : paramInfo) {
         sCode = param.get("paramcode").toString();
         nLen = Integer.parseInt(param.get("datalen").toString()) * 2;
         sVal = BitUnit.highToLow(recvStr.substring(nPos,nLen));         
         recvBodyMap.put(sCode,sVal);
         nPos +=nLen;
      }
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getCntPkg()
    */
   public int getCntPkg() {
      // TODO Auto-generated method stub
      return 0;
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getCurrPkg()
    */
   public int getCurrPkg() {
      // TODO Auto-generated method stub
      return 0;
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getProVer()
    */
   public String getProVer() {
      // TODO Auto-generated method stub
      return null;
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getStatSubId()
    */
   public String getStatSubId() {
      String sTemp = recvStr.substring(18,2);
      sTemp = BitUnit.highToLow(sTemp);
      setStationId(sTemp);
      return sTemp;  
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getStationId()
    */
   public String getStationId() {
      String sTemp = recvStr.substring(10,8);
      sTemp = BitUnit.highToLow(sTemp);
      setStationId(sTemp);
      return sTemp;      
   }
   
   /**
    * @param args
    */
   public static void main(String[] args) {
      // TODO Auto-generated method stub
      
   }
   @Override
   protected String trMeaning() {
      // TODO Auto-generated method stub
      return null;
   }
   @Override
   protected String uniteCmd() {
      // TODO Auto-generated method stub
      return null;
   }
   
}
