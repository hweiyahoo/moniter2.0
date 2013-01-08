package com.sunnada.nms.portal.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.MemoService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author huangwei
 * @version 创建时间：Dec 26, 2011 10:28:40 AM
 * 
 * 便签管理 逻辑控制类
 */
public class MemoAction extends BaseAction implements GeneralAction {
   private static Logger logger      = Logger.getLogger(MemoAction.class);
   private MemoService   memoService = (MemoService) super.getService("memoService");
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.memoService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // 加载用户标签列表
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = memoService.loadComboboxVal(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("createuser", account);
      inDto.put("createdate", DateTimeUtils.getDateSecondFormat());
      Dto outDto = this.memoService.insertItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.memoService.queryItems(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.memoService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
}
