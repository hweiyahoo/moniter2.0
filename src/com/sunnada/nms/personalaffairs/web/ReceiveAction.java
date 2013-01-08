package com.sunnada.nms.personalaffairs.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.ReceiveService;
import com.sunnada.nms.util.action.GeneralAction;
import com.sunnada.nms.util.sys.LoadNoticeTools;
import com.sunnada.nms.util.sys.ToastMsgPush;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Sep 22, 2011 9:10:54 AM 类说明
 */
public class ReceiveAction extends BaseAction {
   
   private static Logger  logger         = Logger.getLogger(ReceiveAction.class);
   private ReceiveService receiveService = (ReceiveService) super.getService("receiveService");
   
   /**
    * 删除通告
    */
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      String strChecked = request.getParameter("strChecked");
      Dto inDto = new BaseDto();
      inDto.put("strChecked", strChecked);
      Dto outDto = this.receiveService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 初始化阅读通告页面
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("receiveInit");
   }
   
   /**
    * 接收到的通告列表
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String user_id = super.getSessionContainer(request).getUserInfo().getUserid();
      inDto.put("user_id", user_id);
      Dto outDto = this.receiveService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 更新通告阅读状态
    */
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.receiveService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      
      /**
       * 更新后，检测是否还有未读、未处理事务，以便更新页面状态消息图标 修改人：huangwei
       */
      ToastMsgPush.getInstance().changeMessageIconsClass(request.getSession());
      return mapping.findForward(null);
   }
   
   /**
    * 查看通告
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward showNotice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.receiveService.showNotice(inDto);
      request.setAttribute("noticeInfo", outDto);
      /**
       * 更新后，检测是否还有未读、未处理事务，以便更新页面状态消息图标 修改人：huangwei
       */
      ToastMsgPush.getInstance().changeMessageIconsClass(request.getSession());
      return mapping.findForward("showNotice");
   }
}
