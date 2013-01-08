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

import com.sun.org.apache.bcel.internal.classfile.Code;
import com.sunnada.nms.dao.SiteService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 25, 2011 4:43:24 PM 地区编码 控制器
 */
public class SiteAction extends BaseAction implements GeneralAction {
   private static Logger logger      = Logger.getLogger(SiteAction.class);
   private SiteService   siteService = (SiteService) super.getService("siteService");
   
   /**
    * 页面初始化
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String type = inDto.getAsString("type");
      if ("1".equals(type)) {
         inDto.put("root_menuname", "地区编码信息");
         request.setAttribute("params", inDto);
         return mapping.findForward("siteInit");
      }
      else {
         inDto.put("root_menuname", "铁路编码信息");
         request.setAttribute("params", inDto);
         return mapping.findForward("railInit");
      }
   }
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.siteService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("modifyuser", account);
      Dto outDto = this.siteService.insertItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.siteService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("modifyuser", account);
      Dto outDto = this.siteService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   public ActionForward queryTreeItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String node = inDto.getAsString("node").split("_")[1];
      inDto.put("node", node);
      Dto outDto = this.siteService.queryTreeItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 省份列表
    */
   public ActionForward queryProvinceList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.siteService.queryProvinceList(inDto);
      String arrStr = outDto.getAsString("arrStr");
      response.getWriter().write(arrStr);
      return mapping.findForward(null);
   }
}
