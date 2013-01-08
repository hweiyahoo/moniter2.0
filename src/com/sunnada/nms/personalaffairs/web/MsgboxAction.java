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

import com.sunnada.nms.dao.CmdPraseService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:27:13 PM
 * 
 * 个人事务 逻辑控制器
 */
public class MsgboxAction extends BaseAction {
   private static Logger   logger          = Logger.getLogger(MsgboxAction.class);
   
   private CmdPraseService cmdPraseService = (CmdPraseService) super.getService("cmdPraseService");
   
   /**
    * 消息盒页面
    */
   public ActionForward initForShowMsgbox(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("msgboxInit");
   }
}
