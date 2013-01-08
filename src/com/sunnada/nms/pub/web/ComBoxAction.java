package com.sunnada.nms.pub.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.ComboxService;
import com.sunnada.nms.util.CommSerialUtil;

/**
 * @author huangwei
 * @version 创建时间：Jul 23, 2011 1:14:15 PM
 * 
 * 下拉框 逻辑类
 */
public class ComBoxAction extends BaseAction {
   
   private ComboxService comboxService = (ComboxService) super.getService("comboxService");
   
   public ActionForward queryCode(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      inDto.put("HttpServletRequest", request);
      Dto outDto = this.comboxService.loadComboxValue(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward loadCommSerialPorts(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // 通过调用comm公共类，获取comm接口名称
      List list = CommSerialUtil.getSerialPortsToList();
      response.getWriter().write(JsonHelper.encodeObject2Json(list));
      return mapping.findForward(null);
   }
}
