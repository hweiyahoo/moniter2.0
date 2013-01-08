package com.sunnada.nms.cfg.web;

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

import com.sunnada.nms.dao.BaseMonCodeService;
import com.sunnada.nms.util.action.GeneralAction;

public class BaseMonCodeAction extends BaseAction implements GeneralAction {
   
   private static Logger      logger             = Logger
                                                       .getLogger(DeviceTypeAction.class);
   
   private BaseMonCodeService baseMonCodeService = (BaseMonCodeService) super
                                                       .getService("baseMonCodeService");
   
   /*
    * 删除
    */
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      String strChecked = request.getParameter("strChecked");
      Dto inDto = new BaseDto();
      inDto.put("strChecked", strChecked);
      Dto outDto = this.baseMonCodeService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /*
    * 页面初始化
    */
   public ActionForward init(ActionMapping mapping, ActionForm form,
                             HttpServletRequest request, HttpServletResponse response)
                                                                                      throws Exception {
      
      return mapping.findForward("BaseMonCodeMainInit");
   }
   
   /*
    * 插入记录
    */
   public ActionForward insertItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("create_user", account);
      Dto outDto = this.baseMonCodeService.insertItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /*
    * 查询记录
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.baseMonCodeService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /*
    * 更新记录
    */
   public ActionForward updateItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.baseMonCodeService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
}