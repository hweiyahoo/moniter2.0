package com.sunnada.nms.parse;

/**
 * @author zhangys
 * created Dec 9, 2011 all copyright reserved by sunnada 
 * desc 处理通讯中对接收解析逻辑的抽象封装
 */

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.dao.CmdHeadInfo;
import com.sunnada.nms.dao.ReptInfo;

public abstract class AbsRecver {
   
   public void buildRecvStr() throws Exception {
      judge();
      delim = aidParser.hex2Str(recvStr.substring(0,2));//取得分隔符,要转字符
      buildRecvHead();
      buildRecvBody();
   }
   public String getARecvHeadVal(final String sKey) {
      return recvHeadMap.get(sKey);
   }
   public String getARecvBodyVal(final String sKey) {
      return recvBodyMap.get(sKey);
   }
   protected void init() {
      recvHeadMap = new HashMap<String, String>();
      recvBodyMap = new HashMap<String,String>();
      aidParser = new AidParser();
      ReptInfo reptInfo = (ReptInfo) SpringBeanLoader.getSpringBean("reptInfoService");
      CmdHeadInfo cmdHeadInfo = (CmdHeadInfo) SpringBeanLoader.getSpringBean("cmdHeadInfoService");
      setReptInfo(reptInfo);
      setCmdHeadInfo(cmdHeadInfo);
   }
   protected void  buildRecvHead() {
      AidParser parser=new AidParser();
      String stationId = getStationId();
      String statSubId = getStatSubId();
      Dto reptInfoMap = reptInfo.getReptInfoByStatInfo(stationId, statSubId);
      setRepeaterId(reptInfoMap.getAsString("repeaterid"));
      setProType(reptInfoMap.getAsString("protype"));
      setDevType(reptInfoMap.getAsString("devicetype"));
      int nPos = 2;
      String sPmCode,sVal;
      List<Dto> cmdHeadList = cmdHeadInfo.getByProtype(reptInfoMap.getAsString("protype"));
      for (Dto cmdHead : cmdHeadList) {
         sPmCode = cmdHead.getAsString("pmrecv");
         int nLen = Integer.parseInt(cmdHead.getAsString("hlen"));
         if (!sPmCode.equals("DELIM")) {
           sVal = parser.highToLow(recvStr.substring(nPos,nPos+nLen*2));
           if("code".equals(sPmCode)){
              setStationId(sVal);
           }
           recvHeadMap.put(sPmCode,sVal);
           nPos += nLen*2;
         }       
      }
      setHeadStr(recvStr.substring(2,nPos));
   }
   public abstract String getProVer(); 
   public abstract int getCntPkg();
   public abstract int getCurrPkg();
   public abstract String getStationId();
   public abstract String getStatSubId();
   protected abstract void  buildRecvBody() throws Exception; 
   protected abstract void judge() throws Exception;
   
   public String getRepeaterId() {
      return repeaterId;
   }
   public void setRepeaterId(String repeaterId) {
      this.repeaterId = repeaterId;
   }
   public void setStationId(String stationId) {
      this.stationId = stationId;
   }   
   public void setStatSubId(String statSubId) {
      this.statSubId = statSubId;
   }
   public String getProType() {
      return proType;
   }
   public void setProType(String proType) {
      this.proType = proType;
   }
   public String getDevType() {
      return devType;
   }
   public void setDevType(String devType) {
      this.devType = devType;
   }
   public String getHeadStr() {
      return headStr;
   }
   public void setHeadStr(String headStr) {
      this.headStr = headStr;
   }
   public String getBodyStr() {
      return bodyStr;
   }
   public void setBodyStr(String bodyStr) {
      this.bodyStr = bodyStr;
   }
   public String getRecvStr() {
      return recvStr;
   }
   public void setRecvStr(String recvStr) {
      this.recvStr = recvStr;
   }
   public String getDelim() {
      return delim;
   }
   public void setDelim(String delim) {
      this.delim = delim;
   }
   public int getHeadLen() {
      return headLen;
   }
   public void setHeadLen(int headLen) {
      this.headLen = headLen;
   }
   public ReptInfo getReptInfo() {
      return reptInfo;
   }
   public void setReptInfo(ReptInfo reptInfo) {
      this.reptInfo = reptInfo;
   }
   public CmdHeadInfo getCmdHeadInfo() {
      return cmdHeadInfo;
   }
   public void setCmdHeadInfo(CmdHeadInfo cmdHeadInfo) {
      this.cmdHeadInfo = cmdHeadInfo;
   }
   public Map<String, String> getRecvHeadMap() {
      return recvHeadMap;
   }
   public void setRecvHeadMap(Map<String, String> recvHeadMap) {
      this.recvHeadMap = recvHeadMap;
   }
   public Map<String, String> getRecvBodyList() {
      return recvBodyMap;
   }
   public void setRecvBodyList(Map<String, String> recvBodyMap) {
      this.recvBodyMap = recvBodyMap;
   }
   public String getCmdType() {
      return recvHeadMap.get("cmd");
   }
   public boolean isTrMeaning() {
      return trMeaning;
   }
   
   /**
    * @return the apType
    */
   public String getApType() {
      return apType;
   }
   /**
    * @param apType the apType to set
    */
   public void setApType(String apType) {
      this.apType = apType;
   }
   /**
    * @return the vpType
    */
   public String getVpType() {
      return vpType;
   }
   /**
    * @param vpType the vpType to set
    */
   public void setVpType(String vpType) {
      this.vpType = vpType;
   }
   /**
    * @return the mcpType
    */
   public String getMcpType() {
      return mcpType;
   }
   /**
    * @param mcpType the mcpType to set
    */
   public void setMcpType(String mcpType) {
      this.mcpType = mcpType;
   }   
   public boolean isUniteCmd() {
      return uniteCmd;
   }
   protected void setUniteCmd() {//ap:b
      uniteCmd = false;
      if (apType.equals("02")) {
         uniteCmd = true;
      }
   }
   protected void setTrMeaning(){//ap:a  ap:c
      trMeaning = false;
      if (apType.equals("01") || apType.equals("03")) {
         trMeaning = true;
      }
   }
   public void dealRecvStr() {
      if (isTrMeaning()) recvStr = trMeaning();
      if (isUniteCmd()) recvStr = uniteCmd();
   }
   protected abstract String uniteCmd();
   protected abstract String trMeaning();
   
   protected String apType = "",vpType = "",mcpType = "";
   protected boolean trMeaning = false,//转义标志
            uniteCmd = false;//合并标志
   protected AidParser aidParser;
   protected ReptInfo reptInfo;//站点信息
   protected CmdHeadInfo cmdHeadInfo;//包头配置信息
   protected String proVer,repeaterId,stationId,
               statSubId,proType,devType,
               headStr,bodyStr,recvStr,delim,ap;
   protected Map<String,String> recvHeadMap,//解析后的包头
            recvBodyMap;//解析后的包体
   protected int headLen;//包头长度
}
