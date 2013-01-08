package com.sunnada.nms.cfg.web;

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

import com.sunnada.nms.comm.serial.SerialParameters;
import com.sunnada.nms.dao.ComConfigService;
import com.sunnada.nms.util.sys.InitBusinessParams;
import com.sunnada.nms.util.sys.NMSBusinessParams;

/**
 * @author gezhidong E-mail: fengyu_hqu@sina.com
 * @version 创建时间：Jul 28, 2011 10:51:17 AM 通讯参数配置转发
 */
public class ComConfigAction extends BaseAction {
   
   private static Logger    logger           = Logger.getLogger(DeviceTypeAction.class);
   
   private ComConfigService comConfigService = (ComConfigService) super.getService("comConfigService");
   
   /**
    * 页面初始化
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      request.setAttribute("comminfo", this.comConfigService.queryCommInfo(null));
      return mapping.findForward("ComConfigMainInit");
   }
   
   /**
    * 设置通讯参数后执行某些操作
    */
   public ActionForward setComConfig(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.comConfigService.setCommInfo(inDto);
      // 重新更新 通讯参数
      if ((Boolean) outDto.get("success")) {
         InitBusinessParams.updateBusinessParamsForSp(getServlet().getServletContext(), inDto);
      }
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
}
