package com.sunnada.nms.dwrcomet.web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
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
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.util.WebUtils;

import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.sys.LoadNoticeTools;

/**
 * @author huangwei
 * @version 创建时间：Aug 10, 2011 1:26:56 PM
 * 
 * 监控平台推送基类
 */
public class NmsCometHandshakeBase {
   
   private static Logger                    logger      = Logger.getLogger(NmsCometHandshakeBase.class);
   
   public static ServletContext             sc;
   
   public static String                     contextPath;                                                // 发布项目名称
                                                                                                         
   public static final String               USERINFO    = "userInfo";
   
   public static Map<String, ScriptSession> sessionBind = new HashMap();
   
   public boolean validationPush() {
      if (this.sc == null) {
         return false;
      }
      else {
         return true;
      }
   }
   
   /**
    * 客服端通过调用此方法与服务器握手建立个长连接。
    */
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
      showWelcomeMessage(myScSession);
   }
   
   /**
    * 将用户id和页面脚本session绑定
    * 
    * @param userid
    */
   public void scriptSessionBind(String httpSessionId, ScriptSession myScSession) {
      sessionBind.put(httpSessionId, myScSession);
   }
   
   /**
    * 获取首页消息框连接的所有用户scriptSession
    * 
    * @param userid
    * @param request
    * @return
    */
   @SuppressWarnings("unchecked")
   public Collection<ScriptSession> getToastMsgScriptSession() {
      // 获得DWR上下文
      ServerContext sctx = ServerContextFactory.get(sc);
      // 获得当前浏览 index.jsp 页面的所有脚本session
      Collection sessions = sctx.getScriptSessionsByPage(contextPath + "/index.ered?reqCode=indexInit");
      return filterEffectSession(sessions);
   }
   
   /**
    * 获取设备监控页面连接当前页面的 scriptsession
    * 
    * @param request
    * @return
    */
   @SuppressWarnings("unchecked")
   public Collection<ScriptSession> getDMScriptSession() {
      // 获得DWR上下文
      ServerContext sctx = ServerContextFactory.get(sc);
      // 获得当前浏览 devicemnt.jsp 页面的所有脚本session
       Collection sessions = sctx.getScriptSessionsByPage(contextPath + "/devicemnt.ered?reqCode=init&menuid4Log=01020306");
      return filterEffectSession(sessions);
   }
   
   @SuppressWarnings("unchecked")
   private Collection<ScriptSession> filterEffectSession(Collection<ScriptSession> pageScriptSessions) {
      Collection<ScriptSession> effectsessions = new ArrayList();
      Collection<ScriptSession> bindsessions = sessionBind.values();// 握手成功的用户session
      for (ScriptSession bindsession : bindsessions) {
         for (ScriptSession session : pageScriptSessions) {
            if (bindsession.getId().equals(session.getId())) {// 获取有效的scripsession对象
               effectsessions.add(bindsession);
            }
         }
      }
      return effectsessions;
   }
   
   /**
    * 用户第一次登录系统，系统自动统计用户公共、告警等相关信息
    * 
    * @param session
    */
   @SuppressWarnings("unchecked")
   public void showWelcomeMessage(ScriptSession session) {
      StringBuffer sb = new StringBuffer();
      sb.append("<font color='blue'><H3>欢迎您使用三元达下位机监控系统！</H3></font>");
      Dto inDto = new BaseDto();
      UserInfoVo userInfo = (UserInfoVo) session.getAttribute(this.USERINFO);
      inDto.put("userid", userInfo.getUserid());
      inDto.put("deptid", userInfo.getDeptid());
      // 统计用户未读消息、未处理告警
      List<Dto> noticeList = LoadNoticeTools.statsAllNoticeUnread(inDto);
      Util util = new Util(session);
      if (noticeList != null && noticeList.size() > 0) {
         sb.append("<br><br>").append("<b>您有未读消息，详情点击顶端消息盒！</b>");
         // --首页消息图标改变
         util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
      }
      util.addFunctionCall("showToast", sb.toString());
   }
}
