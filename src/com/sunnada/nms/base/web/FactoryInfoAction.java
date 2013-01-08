package com.sunnada.nms.base.web;

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

import com.sunnada.nms.dao.FactoryInfoService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 22, 2011 5:10:10 PM 
 * 厂家管理 控制器
 * 
 */
public class FactoryInfoAction extends BaseAction implements GeneralAction {
   private static Logger      logger             = Logger
                                                       .getLogger(FactoryInfoAction.class);
   private FactoryInfoService factoryInfoService = (FactoryInfoService) super
                                                       .getService("factoryInfoService");
   
   /**
    * 页面初始化
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("factoryInfoInit");
   }

   public ActionForward deleteItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      String strChecked = request.getParameter("strChecked");
      Dto inDto = new BaseDto();
      inDto.put("strChecked", strChecked);
      Dto outDto = this.factoryInfoService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }

   public ActionForward insertItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("create_user", account);
      Dto outDto = this.factoryInfoService.insertItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }

   public ActionForward queryItems(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.factoryInfoService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }

   public ActionForward updateItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.factoryInfoService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
}
