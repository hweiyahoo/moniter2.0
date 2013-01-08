package com.sunnada.nms.parse;

/**
 * @author zhangys
 * created Dec 5, 2011 all copyright reserved by sunnada 
 * desc:处理通讯中对发送解析逻辑的抽象封装
 */
import java.util.*;

import org.eredlab.g4.bmf.util.SpringBeanLoader;

import com.sunnada.nms.dao.*;

public abstract class AbsSender {
   
   //取得解析后包的内容

   public String getDelim() {
      return mDelimStr;
   }
   public String getHeadStr(){
      return mHeadStr;
   }
   public int getAP() {
      return mAp;
   }
   public void setAp(int nAp) {
      mAp = nAp;
   }
   public int getHeadLen() {
      return mHeadLen;
   }
   public void setHeadLen(int nHeadLen) {
      mHeadLen = nHeadLen;
   }
   public int getPkgSize() {
      return mPkgSize;
   }
   public void setPkgSize(int nPkgSize) {
      mPkgSize = nPkgSize;
   }
   public ReptInfo getReptInfo() {
      return reptInfo;
   }
   public void setReptInfo(ReptInfo retptInfo) {
      this.reptInfo = retptInfo;
   }
   public CmdHeadInfo getCmdHeadInfo() {
      return cmdHeadInfo;
   }
   public void setCmdHeadInfo(CmdHeadInfo cmdHeadInfo) {
      this.cmdHeadInfo = cmdHeadInfo;
   }
   
   public List<byte[]> buildSendStr(String sRepeaterId,String sCmd,Map<String,String> params,String packnum) {
      buildSendHead(sRepeaterId, sCmd,packnum,"","80");
      buildSendBody(params);
      dealCmdList();
      return mDealedSendCmdList;
   }
   
   public List<byte[]> buildSendStr(String sRepeaterId,String sCmd,Map<String,String> params) {
      buildSendHead(sRepeaterId, sCmd,"","","80");
      buildSendBody(params);
      dealCmdList();
      return mDealedSendCmdList;
   }
   
   public List<byte[]> respondSendStr(String sRepeaterId,Map<String,String> params,String packnum){
      buildSendHead(sRepeaterId, "01",packnum,"00","00");
      buildSendBody(params);
      dealCmdList();
      return mDealedSendCmdList;
   }
   
   public void init() {
      aidParser = new AidParser();
      setPkgSize(256);
      mSendCmdList = new ArrayList<String>();
      mDealedSendCmdList = new ArrayList<byte[]>(); 
      ReptInfo reptInfo = (ReptInfo) SpringBeanLoader.getSpringBean("reptInfoService");
      CmdHeadInfo cmdHeadInfo = (CmdHeadInfo) SpringBeanLoader.getSpringBean("cmdHeadInfoService");
      setReptInfo(reptInfo);
      setCmdHeadInfo(cmdHeadInfo);
   }
   public boolean isTrMeaning() {
      if(getApType().equals("03"))
         return true;
      else {
         return false;
      }
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
   public boolean isSpltCmd() {
     if(getApType().equals("02"))
        return true;
     else 
        return false;
   }
   protected void setSpltCmd() {
      splitCmd = false;
      if (apType.equals("02")) {
         splitCmd = true;//ap:b modem(sms) deal this modem(sms)
      }
   }
   protected void setTrMeaning(){
      trMeaning = false;
      if (apType.equals("01") || apType.equals("03")) {
         trMeaning = true;//ap:a and ap:c must deal this method
      }
   }
   /**
    * 对组成要发送的串的列表进行转义和拆分处理后再发送给下位机，
    * 前提是要对转义和拆分的条件进行正确设置，转义和拆分由子类实现，
    * @return 处理后要字符串列表
    */
   public List<byte[]> dealCmdList() {
      if (isTrMeaning()) trCmdListMeaning();
      if (isSpltCmd()) splitCmdList();
      if (mDealedSendCmdList.size() > 0)  
         return mDealedSendCmdList;
      return null;
   }
   protected abstract void trCmdListMeaning();//转义处理，由子类实现
   protected abstract void splitCmdList(); //拆分处理，由子类实现  

   protected String apType = "",vpType = "",mcpType = "";
   protected boolean trMeaning = false, //转义标志
            splitCmd = false;//拆分标志
   protected int mAp;//AP标志，取字标志时用
   protected String  mHeadStr,//包头串
      mDelimStr,//分隔符
      mSendStr;//包体串
   protected AidParser aidParser;
   protected int mHeadLen,//包头长度
            mPkgSize;//包体长度
   protected ReptInfo reptInfo;//站点信息
   protected CmdHeadInfo cmdHeadInfo;//包头配置信息
   protected List<String> mSendCmdList; //原生的要发送的列表
   protected List<byte[]> mDealedSendCmdList;//经过转义等处理后要发送的列表
   protected abstract void buildSendHead(String sRepeaterId,String sCmd,String packNum,String respFlag,String vp);
   protected abstract void buildSendBody(Map<String,String> params);
   
}
