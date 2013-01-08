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
 * 处理聊天相关
 * 
 * @author lhq
 * 
 */
public class ToastMessagePush {
   
   private static Logger                    logger      = Logger.getLogger(ToastMessagePush.class);
   
   public static ServletContext             sc;
   
   public static String                     contextPath;                                           // 发布项目名称
                                                                                                    
   private static final String              USERINFO    = "userInfo";
   
   public static Map<String, ScriptSession> sessionBind = new HashMap();
   
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
    * 获取连接当前页面的所有用户scriptSession
    * 
    * @param userid
    * @param request
    * @return
    */
   @SuppressWarnings("unchecked")
   public Collection<ScriptSession> getScriptSession() {
      // 获得DWR上下文
      ServerContext sctx = ServerContextFactory.get(sc);
      // 获得当前浏览 index.jsp 页面的所有脚本session
      Collection sessions = sctx.getScriptSessionsByPage(contextPath + "/index.ered?reqCode=indexInit");
      return sessions;
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
    * 向全体在线用户发送消息
    * 
    * @param msg
    *           消息
    * @param changeMsgIcon
    *           是否改变消息盒图标
    */
   public void send(String msg, boolean changeMsgIcon) {
      if (!this.validationPush()) {
         logger.error("调用send进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         Util util = new Util(effectsession);
         if (!StringUtils.isEmpty(msg)) {
            util.addFunctionCall("showToast", "<span class='nmslightOnIcon'>" + msg + "</span>");
            if (changeMsgIcon) {
               util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
            }
         }
      }
   }
   
   /**
    * 按照角色发送
    * 
    * @param roles
    *           多角色
    * @param msg
    *           消息
    * @param changeMsgIcon
    *           是否改变消息盒图标
    */
   public void sendByRole(String roles, String msg, boolean changeMsgIcon) {
      if (!this.validationPush()) {
         logger.error("调用sendByRole进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      if (StringUtils.isEmpty(roles))
         return;
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         UserInfoVo userInfo = (UserInfoVo) effectsession.getAttribute(this.USERINFO);
         String userRoles = userInfo.getRoleids();
         if (StringUtils.isEmpty(userRoles))
            continue;
         String[] role = userRoles.split(",");
         for (int i = 0; i < role.length; i++) {
            if (roles.indexOf(role[i]) != -1) {
               Util util = new Util(effectsession);
               if (!StringUtils.isEmpty(msg)) {
                  util.addFunctionCall("showToast", "<span class='nmslightOnIcon'>" + msg + "</span>");
                  if (changeMsgIcon) {
                     util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
                  }
               }
               break;
            }
         }
      }
   }
   
   /**
    * 多用户发送
    * 
    * @param users
    *           多用户
    * @param msg
    *           消息
    * @param changeMsgIcon
    *           是否改变消息盒图标
    */
   public void sendByUser(String users, String msg, boolean changeMsgIcon) {
      if (!this.validationPush()) {
         logger.error("调用sendByUser进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      if (StringUtils.isEmpty(users))
         return;
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         UserInfoVo userInfo = (UserInfoVo) effectsession.getAttribute(this.USERINFO);
         if (users.indexOf(userInfo.getUserid()) != -1) {
            Util util = new Util(effectsession);
            if (!StringUtils.isEmpty(msg)) {
               util.addFunctionCall("showToast", "<span class='nmslightOnIcon'>" + msg + "</span>");
               if (changeMsgIcon) {
                  util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
               }
            }
         }
      }
   }
   
   /**
    * 按部门发送
    * 
    * @param depts
    *           多部门deptid
    * @param msg
    *           消息
    * @param changeMsgIcon
    *           是否改变消息盒图标
    */
   public void sendByDept(String depts, String msg, boolean changeMsgIcon) {
      if (!this.validationPush()) {
         logger.error("调用sendByDept进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      if (StringUtils.isEmpty(depts))
         return;
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      for (ScriptSession effectsession : effectsessions) {
         UserInfoVo userInfo = (UserInfoVo) effectsession.getAttribute(this.USERINFO);
         if (depts.indexOf(userInfo.getDeptid()) != -1) {
            Util util = new Util(effectsession);
            if (!StringUtils.isEmpty(msg)) {
               util.addFunctionCall("showToast", "<span class='nmslightOnIcon'>" + msg + "</span>");
               if (changeMsgIcon) {
                  util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
               }
            }
         }
      }
   }
   
   /**
    * 按用户所属地区 推送消息
    * 
    * @param province
    * @param city
    * @param msg
    * @param changeMsgIcon
    */
   public void sendBySite(String province, String city, String msg, boolean changeMsgIcon) {
      if (!this.validationPush()) {
         logger.error("调用sendBySite进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      if (StringUtils.isEmpty(province) || StringUtils.isEmpty(city))
         return;
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      Dto siteDto = null;
      for (ScriptSession effectsession : effectsessions) {
         UserInfoVo userInfo = (UserInfoVo) effectsession.getAttribute(this.USERINFO);
         siteDto = StringUtils.formatDMDeptidForNms(userInfo.getDeptid());
         if (province.equals(siteDto.getAsString("province")) && city.equals(siteDto.getAsString("city"))) {
            Util util = new Util(effectsession);
            if (!StringUtils.isEmpty(msg)) {
               util.addFunctionCall("showToast", "<span class='nmslightOnIcon'>" + msg + "</span>");
               if (changeMsgIcon) {
                  util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
               }
            }
         }
      }
   }
   
   /**
    * 按用户所属地区 推送业务通知信息 如：告警，开站，维修等上报信息。并且需要根据地区推送给指定管理员。
    * 
    * @param province
    * @param city
    * @param msg
    * @param changeMsgIcon
    */
   public void sendBizMsgBySite(String province, String city, String msg, boolean changeMsgIcon) {
      if (!this.validationPush()) {
         logger.error("调用sendBizMsgBySite进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      if (StringUtils.isEmpty(province) || StringUtils.isEmpty(city))
         return;
      Collection<ScriptSession> effectsessions = this.filterEffectSession();
      Dto siteDto = null;
      for (ScriptSession effectsession : effectsessions) {
         UserInfoVo userInfo = (UserInfoVo) effectsession.getAttribute(this.USERINFO);
         if ("0".equals(userInfo.getAccept()))// 表明用户没有接受上报信息的权限
            continue;
         siteDto = StringUtils.formatDMDeptidForNms(userInfo.getDeptid());
         if (province.equals(siteDto.getAsString("province")) && city.equals(siteDto.getAsString("city"))) {
            Util util = new Util(effectsession);
            if (!StringUtils.isEmpty(msg)) {
               util.addFunctionCall("showToast", "<span class='nmslightOnIcon'>" + msg + "</span>");
               if (changeMsgIcon) {
                  util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
               }
            }
         }
      }
   }
   
   /**
    * 根据当前用户sessionid，获取对应的scriptSession,去推送更新页面上的一些属性。
    * 
    * @param session
    * @param iconClass
    */
   public void changeMessageIconsClass(HttpSession session) {
      if (!this.validationPush()) {
         logger.error("调用changeMessageIconsClass进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      ScriptSession myScSession = (ScriptSession) sessionBind.get(session.getId());
      if (myScSession != null) {
         Util util = new Util(myScSession);
         UserInfoVo userInfo = (UserInfoVo) myScSession.getAttribute(this.USERINFO);
         Dto pDto = new BaseDto();
         pDto.put("userid", userInfo.getUserid());
         pDto.put("deptid", userInfo.getDeptid());
         List<Dto> noticeList = LoadNoticeTools.statsAllNoticeUnread(pDto);
         String iconClass = "newmessageIcon";
         if (noticeList == null || noticeList.size() == 0) {
            iconClass = "messageIcon";
         }
         util.addFunctionCall("changeMessageIconsClass", iconClass);
      }
   }
   
   /**
    * 用户第一次登录系统，系统自动统计用户公共、告警等相关信息
    * 
    * @param session
    */
   public void showWelcomeMessage(ScriptSession session) {
      if (!this.validationPush()) {
         logger.error("调用showWelcomeMessage进行推送失败，系统检测到当前无用户连接该页面！");
         return;
      }
      StringBuffer sb = new StringBuffer();
      sb.append("<font color='blue'><H3><span class='nmswelcomeIcon'>欢迎您使用三元达直放站监控系统！</span></H3></font>");
      Dto inDto = new BaseDto();
      UserInfoVo userInfo = (UserInfoVo) session.getAttribute(this.USERINFO);
      inDto.put("userid", userInfo.getUserid());
      inDto.put("deptid", userInfo.getDeptid());
      // 统计用户未读消息、未处理告警
      List<Dto> noticeList = LoadNoticeTools.statsAllNoticeUnread(inDto);
      Util util = new Util(session);
      if (noticeList != null && noticeList.size() > 0) {
         sb.append("<br><br><br><br>").append("<span class='nmslightOnIcon'>您有未读消息，详情点击顶端消息盒！</span>");
         // --首页消息图标改变
         util.addFunctionCall("changeMessageIconsClass", "newmessageIcon");
      }
      util.addFunctionCall("showToast", sb.toString());
   }
}
