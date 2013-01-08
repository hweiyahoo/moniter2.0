package com.sunnada.nms.dwrcomet.web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ServerContext;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.rif.util.WebUtils;

import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.InstructionBean;

public class DeviceMonitorPush {
   private static Logger                    logger      = Logger.getLogger(DeviceMonitorPush.class);
   
   public static ServletContext             sc;
   
   public static String                     contextPath;                                            // 发布项目名称
                                                                                                     
   private static final String              USERINFO    = "userInfo";
   
   public static Map<String, ScriptSession> sessionBind = new HashMap();
   
   public void handshake() {
      sc = WebContextFactory.get().getSession().getServletContext();
      WebContext webContext = WebContextFactory.get();
      contextPath = webContext.getHttpServletRequest().getContextPath();
      HttpSession session = WebContextFactory.get().getSession();
      String httpSessionId = session.getId();
      ScriptSession myScSession = webContext.getScriptSession();
      this.scriptSessionBind(httpSessionId, myScSession);
      UserInfoVo userInfo = WebUtils.getSessionContainer(session).getUserInfo();
      myScSession.setAttribute(this.USERINFO, userInfo);
   }
   
   /**
    * 将用户id和页面脚本session绑定
    * 
    * @param userid
    */
   public void scriptSessionBind(String httpSessionId, ScriptSession myScSession) {
      sessionBind.put(httpSessionId, myScSession);
   }
   
   private Collection<ScriptSession> filterEffectSession() {
      Collection<ScriptSession> effectsessions = new ArrayList();
      Collection<ScriptSession> sessions = this.getScriptSession(); // 获取指定页面上的所有用户scriptsession。
      Collection<ScriptSession> bindsessions = sessionBind.values();// 握手成功的用户session
      for (ScriptSession bindsession : bindsessions) {
         for (ScriptSession session : sessions) {
            if (bindsession.getId().equals(session.getId())) {// 获取有效的scripsession对象
               effectsessions.add(bindsession);
            }
         }
      }
      return effectsessions;
   }
   
   /**
    * 推送前的ServletContext非法验证
    * 
    * @return
    */
   public boolean validationPush() {
      if (this.sc == null) {
         return false;
      }
      else {
         return true;
      }
   }
   
   /**
    * 获取连接当前页面的 scriptsession
    * 
    * @param request
    * @return
    */
   @SuppressWarnings("unchecked")
   public Collection<ScriptSession> getScriptSession() {
      // 获得DWR上下文
      ServerContext sctx = ServerContextFactory.get(sc);
      // 获得当前浏览 index.jsp 页面的所有脚本session
      Collection sessions = sctx.getScriptSessionsByPage(contextPath + "/devicemnt.ered?reqCode=init&menuid4Log=01020306");
      return sessions;
   }
   
   /**
    * 推送更新消息给【状态信息】页面
    * 
    * @param protype
    *           协议编号
    * @param repeaterid
    *           直放站编号
    * @param request
    */
   // reqCode=statusInfoInit&paramclass=03&protype=70&repeaterid=1939
   public void pushStatusInfo(String protype, String repeaterid) {
      if (!this.validationPush()) {
         logger.error("调用pushStatusInfo进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      String StatusInfoUrl = "reqCode=statusInfoInit&paramclass=03" + this.formatRefleshUrl(protype, repeaterid);
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("refleshContentCall", StatusInfoUrl);
      }
   }
   
   /**
    * 推送更新消息给【参数信息】页面
    * 
    * @param protype
    *           协议编号
    * @param repeaterid
    *           直放站编号
    * @param request
    */
   public void pushParamsInfoInit(String protype, String repeaterid) {
      if (!this.validationPush()) {
         logger.error("调用pushParamsInfoInit进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      String ParamsInfoUrl = "reqCode=paramsInfoInit&paramclass=00,01" + this.formatRefleshUrl(protype, repeaterid);
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("refleshContentCall", ParamsInfoUrl);
      }
   }
   
   /**
    * 推送更新消息给【状态信息】页面
    * 
    * @param protype
    *           协议编号
    * @param repeaterid
    *           直放站编号
    * @param request
    */
   public void pushBaseInfoInit(String protype, String repeaterid) {
      if (!this.validationPush()) {
         logger.error("调用pushBaseInfoInit进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      String BaseInfoUrl = "reqCode=baseInfoInit&paramclass=04,05" + this.formatRefleshUrl(protype, repeaterid);
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("refleshContentCall", BaseInfoUrl);
      }
   }
   
   /**
    * 格式化各个刷新页面url
    * 
    * @param protype
    * @param repeaterid
    * @return
    */
   private String formatRefleshUrl(String protype, String repeaterid) {
      StringBuffer sbstr = new StringBuffer();
      sbstr.append("&protype=").append(protype);
      sbstr.append("&repeaterid=").append(repeaterid);
      return sbstr.toString();
   }
   
   /**
    * 刷新站点树节点。
    * 
    * @param nodeId
    *           树节点id
    */
   public void updateTreeNodeConnStatus(String stationType, String stationId, String statsubid, String repeaterId) {
      if (!this.validationPush()) {
         logger.error("调用updateTreeNodeConnStatus进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("refreshNodeCall", this.formatTreeNodeId(stationType, stationId, statsubid, repeaterId));
      }
   }
   
   /**
    * 格式化树节点nodeid
    * 
    * @param stationType
    *           站点类型
    * @param stationId
    *           站点id
    * @param repeaterId
    *           repeaterId
    * @return
    */
   private String formatTreeNodeId(String stationType, String stationId, String statsubid, String repeaterId) {
      StringBuffer sbstr = new StringBuffer();
      sbstr.append(stationType).append("_");
      sbstr.append(stationId).append("_");
      sbstr.append(statsubid).append("_");
      sbstr.append(repeaterId);
      return sbstr.toString();
   }
   
   /**
    * 更新设备监控参数初始化参数列表
    * 
    * @param repeaterId
    */
   public void updateMonitorParamList(String repeaterId) {
      if (!this.validationPush()) {
         logger.error("调用updatemonitorParamList进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("refreshMonitorParamList", repeaterId);
      }
   }
   
   /**
    * 更新监控面板3个参数
    * 
    * @param vstationid
    * @param vstatsubid
    * @param vtel
    * @param comm_seq
    * @param stationid
    * @param statsubid
    */
   public void updateMonitorBoardParam(String vstationid, String vstatsubid, String vtel, String stationid, String statsubid) {
      if (!this.validationPush()) {
         logger.error("调用updateMonitorBoardParam进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("refreshMonitorBoardParam", vstationid, vstatsubid, vtel, stationid, statsubid);
      }
   }
   
   /**
    * 更新监控设备更新日志
    * 
    * @param stationId
    * @param statsubId
    * @param msg
    */
   public void updateLogPanel(String stationId, String statsubId, String msg) {
      if (!this.validationPush()) {
         logger.error("调用updateLogPanel进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("updateLogPanel", stationId, statsubId, msg);
      }
   }
   
   /**
    * 命令回显面板 显式命令消息 使用sessionID
    * 
    * @param sessionId
    * @param instructionBean
    */
   public void debugLogPanel(InstructionBean instructionBean) {
      if (!this.validationPush()) {
         logger.error("调用debugLogPanel进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      if (instructionBean == null) {
         logger.error("InstructionBean is NULL!推送失败，系统检测到参数无效！");
         return;
      }
      ScriptSession effectsession = sessionBind.get(instructionBean.getSessionId());
      if (effectsession != null) {
         Collection<ScriptSession> effectsessions = this.filterEffectSession();
         if (effectsessions.contains(effectsession)) {
            Util util = new Util(effectsession);
            String logType = Constant.LOG_INFO_ICON;
            if (!"00".equals(instructionBean.getResult())) {
               logType = Constant.LOG_ERROR_ICON;
            }
            String nodeid = instructionBean.getStationid() + "_" + instructionBean.getStatsubid();
            util.addFunctionCall("debugLogPanel", logType, instructionBean.getHearAlarm(), DateTimeUtils.getDateSecondFormat(), nodeid, formatDebugLogMsg(instructionBean));
         }
      }
   }
   
   /**
    * 命令回显面板 显式心跳和告警回显消息 不用sessionID
    * 
    * @param sessionId
    * @param instructionBean
    */
   public void debugLogPanelForHeartAlarm(InstructionBean instructionBean) {
      if (!this.validationPush()) {
         logger.error("调用debugLogPanelForHeartAlarm进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      if (instructionBean == null) {
         logger.error("InstructionBean is NULL!推送失败，系统检测到参数无效！");
         return;
      }
      String logType = Constant.LOG_HEART_ICON;
      String msg = "";
      if (instructionBean.getHearAlarm().equals("2")) {// 告警
         logType = Constant.LOG_ALARM_ICON;
      }
      String nodeid = instructionBean.getStationid() + "_" + instructionBean.getStatsubid();
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("debugLogPanel", logType, instructionBean.getHearAlarm(), DateTimeUtils.getDateSecondFormat(), nodeid, formatDebugLogMsg(instructionBean));
      }
   }
   
   /**
    * 格式化命令回显字符串
    * 
    * @param instructionBean
    * @return
    */
   private String formatDebugLogMsg(InstructionBean instructionBean) {
      StringBuffer sb = new StringBuffer();
      String heartAlarm = instructionBean.getHearAlarm();
      String operType = instructionBean.getFlag();
      if (operType.equals("0")) {
         operType = "发送";
      }
      else if (operType.equals("1")) {
         operType = "接受";
      }
      if ("0".equals(heartAlarm)) {// 普通命令
         sb.append("通讯[" + instructionBean.getType() + "]-");
         sb.append(operType);
         if (!"00".equals(instructionBean.getResult())) {
            sb.append("状态[" + instructionBean.getResult() + ":" + instructionBean.getReason() + "]:");
         }
         sb.append(instructionBean.getCmd());
      }
      else if ("1".equals(heartAlarm)) {// 心跳包
         sb.append("通讯[" + instructionBean.getType() + "]-");
         sb.append(operType + "-");
         sb.append("心跳包：");
         sb.append(instructionBean.getCmd());
      }
      else if ("2".equals(heartAlarm)) {// 告警
         sb.append("通讯[" + instructionBean.getType() + "]-");
         sb.append(operType + "-");
         sb.append("告警：");
         sb.append(instructionBean.getCmd());
      }
      
      return sb.toString();
   }
   
}
