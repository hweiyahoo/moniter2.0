package com.sunnada.nms.personalaffairs.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.NoticeService;
import com.sunnada.nms.util.action.GeneralAction;
import com.sunnada.nms.util.sys.LoadNoticeTools;
import com.sunnada.nms.util.sys.ToastMsgPush;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Sep 20, 2011 10:05:40 AM 公告管理 控制器
 */
public class NoticeAction extends BaseAction implements GeneralAction {
   private static Logger logger        = Logger.getLogger(NoticeAction.class);
   private NoticeService noticeService = (NoticeService) super.getService("noticeService");
   
   /**
    * 删除公告信息
    */
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      String strChecked = request.getParameter("strChecked");
      Dto inDto = new BaseDto();
      inDto.put("strChecked", strChecked);
      Dto outDto = this.noticeService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 初始化界面
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("noticeInit");
   }
   
   /**
    * 发布单人或多人公告
    */
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("create_user", account);
      Dto outDto = this.noticeService.insertItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      
      /**
       * 更新后，检测是否还有未读、未处理事务，并推送到前台通知用户，以便更新页面状态消息图标
       * 修改人：huangwei
       */
      ToastMsgPush.getInstance().sendByUser(inDto.getAsString("rece_obj"), "<p>您有一条新消息！</p>",true);
      return mapping.findForward(null);
   }
   
   /**
    * 发布角色或全部人员公告
    */
   public ActionForward insertAllUserItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("create_user", account);
      Dto outDto = this.noticeService.insertAllUserItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      
      /**
       * 基于通告发布模式为角色和全部人的，要检查在线用户，根据在线用户相关条件插入通告接收表中
       * 修改人：huangwei
       */
      LoadNoticeTools.updateReceFornewNotice(inDto);
      
      /**
       * 更新后，检测是否还有未读、未处理事务，并推送到前台通知用户，以便更新页面状态消息图标
       * 修改人：huangwei
       */
      String model = inDto.getAsString("model_id");
      if("3".equals(model)){// 全部用户
         ToastMsgPush.getInstance().send("<p>您有一条新消息！</p>",true);
      }else if("4".equals(model)){// 根据角色推送
         ToastMsgPush.getInstance().sendByRole(inDto.getAsString("rece_obj"), "<p>您有一条新消息！</p>",true);
      }
      return mapping.findForward(null);
   }
   
   /**
    * 查询列表
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.noticeService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 更新单人或多人公告信息
    */
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("modify_user", account);
      Dto outDto = this.noticeService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      
      /**
       * 更新后，检测是否还有未读、未处理事务，并推送到前台通知用户，以便更新页面状态消息图标
       * 修改人：huangwei
       */
      ToastMsgPush.getInstance().sendByUser(inDto.getAsString("rece_obj"), "<p>您有一条新消息！</p>",true);
      return mapping.findForward(null);
   }
   
   /**
    * 更新全部或角色公告信息
    */
   public ActionForward updateAllUserItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("modify_user", account);
      Dto outDto = this.noticeService.updateAllUserItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      
      /**
       * 基于通告发布模式为角色和全部人的，要检查在线用户，根据在线用户相关条件插入通告接收表中
       * 修改人：huangwei
       */
      LoadNoticeTools.updateReceFornewNotice(inDto);
      
      /**
       * 更新后，检测是否还有未读、未处理事务，并推送到前台通知用户，以便更新页面状态消息图标
       * 修改人：huangwei
       */
      String model = inDto.getAsString("model_id");
      if("3".equals(model)){// 全部用户
         ToastMsgPush.getInstance().send("<p>您有一条新消息！</p>",true);
      }else if("4".equals(model)){// 根据角色推送
         ToastMsgPush.getInstance().sendByRole(inDto.getAsString("rece_obj"), "<p>您有一条新消息！</p>",true);
      }
      return mapping.findForward(null);
   }
   
   /**
    * 选择人员的选中列表
    */
   public ActionForward queryCheckedStore(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.noticeService.queryCheckedStore(inDto);
      String arrStr = outDto.getAsString("arrStr");
      response.getWriter().write(arrStr);
      return mapping.findForward(null);
   }
   
   /**
    * 选择人员的未选中列表
    */
   public ActionForward queryNoCheckedStore(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.noticeService.queryNoCheckedStore(inDto);
      String arrStr = outDto.getAsString("arrStr");
      response.getWriter().write(arrStr);
      return mapping.findForward(null);
   }
   
   /**
    * 选择角色的选中列表
    */
   public ActionForward queryCheckedRoleStore(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.noticeService.queryCheckedRoleStore(inDto);
      String arrStr = outDto.getAsString("arrStr");
      response.getWriter().write(arrStr);
      return mapping.findForward(null);
   }
   
   /**
    * 选择角色的未选中列表
    */
   public ActionForward queryNoCheckedRoleStore(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.noticeService.queryNoCheckedRoleStore(inDto);
      String arrStr = outDto.getAsString("arrStr");
      response.getWriter().write(arrStr);
      return mapping.findForward(null);
   }
   
}
