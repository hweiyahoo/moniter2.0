package com.sunnada.nms.logmgr.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.AlarmLogService;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.action.GeneralAction;
import com.sunnada.nms.util.sys.ToastMsgPush;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Aug 2, 2011 3:41:31 PM 告警日志控制器
 */
public class AlarmLogAction extends BaseAction implements GeneralAction {
   
   private static Logger   logger          = Logger.getLogger(AlarmLogAction.class);
   
   private AlarmLogService alarmLogService = (AlarmLogService) super.getService("alarmLogService");
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("param", inDto);
      return mapping.findForward("alarmLogInit");
   }
   
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      /**
       * 按照业务角色，添加直放站过滤 修改人：huangwei
       */
      // --- begin
      UserInfoVo userInfo = this.getSessionContainer(request).getUserInfo();
      if (Constant.DEPT_DMORG.equals(userInfo.getCustomId())) {
         Dto pDto = StringUtils.formatDMDeptidForNms(userInfo.getDeptid());
         inDto.put("province", pDto.getAsString("province"));
         inDto.put("city", pDto.getAsString("city"));
      }
      // --- end
      Dto outDto = this.alarmLogService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward updateFlag(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("modifyuser", account);
      inDto.put("modifytime", DateTimeUtils.getDateSecondFormat());
      Dto outDto = this.alarmLogService.updateFlag(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      
      /**
       * 更新后，检测是否还有未读、未处理事务，以便更新页面状态消息图标 修改人：huangwei
       */
      ToastMsgPush.getInstance().changeMessageIconsClass(request.getSession());
      return mapping.findForward(null);
   }
}
