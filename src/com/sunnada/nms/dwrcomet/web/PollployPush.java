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
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.InstructionBean;

/**
 * @author huangwei
 * @version 创建时间：Jan 5, 2012 9:06:27 AM
 * 
 * 轮询策略 推送
 * 
 * 主要用户多用户共同启动轮询的时候，达到页面表现轮询状态统一性，并保存轮询结果时效性
 */
public class PollployPush {
   private static Logger                     logger      = Logger.getLogger(PollployPush.class);
   
   private static ServletContext             sc;
   
   private static String                     contextPath;                                       // 发布项目名称
                                                                                                 
   private static final String               USERINFO    = "userInfo";
   
   private static Map<String, ScriptSession> sessionBind = new HashMap();
   
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
   private void scriptSessionBind(String httpSessionId, ScriptSession myScSession) {
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
   private boolean validationPush() {
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
   private Collection<ScriptSession> getScriptSession() {
      // 获得DWR上下文
      ServerContext sctx = ServerContextFactory.get(sc);
      // 获得当前浏览 index.jsp 页面的所有脚本session
      Collection sessions = sctx.getScriptSessionsByPage(contextPath + "/repcfg.ered?reqCode=init&menuid4Log=01020305");
      return sessions;
   }
   
   /**
    * 
    * 
    * @param repeaterId
    */
   public void updatePloyGrid(String msg) {
      if (!this.validationPush()) {
         logger.error("调用updatePloyGrid进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         util.addFunctionCall("updatePloyGrid", msg);
      }
   }
}
