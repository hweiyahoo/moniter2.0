package com.sunnada.nms.repeaterManager.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.RepeaterCheckService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 28, 2011 1:50:53 PM 轮询报表 控制器
 */
public class RepeaterCheckAction extends BaseAction {
   private static Logger        logger               = Logger.getLogger(RepeaterCheckAction.class);
   
   private RepeaterCheckService repeaterCheckService = (RepeaterCheckService) super.getService("repeaterCheckService");
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("repeaterCheckInit");
   }
   
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterCheckService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward pollComboBox(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      Dto outDto = this.repeaterCheckService.getPollName();
      String json = outDto.getAsString("json");
      write(json, response);
      return mapping.findForward(null);
   }
   
   public ActionForward repeaterComboBox(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterCheckService.getRepeaterName(inDto);
      String json = outDto.getAsString("json");
      write(json, response);
      return mapping.findForward(null);
   }
   
   public ActionForward beginComboStore(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterCheckService.getBeginStore(inDto);
      String json = outDto.getAsString("json");
      write(json, response);
      return mapping.findForward(null);
   }
   
   public ActionForward endComboStore(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterCheckService.getEndStore(inDto);
      String json = outDto.getAsString("json");
      write(json, response);
      return mapping.findForward(null);
   }
   
   /**
    * 轮询报表 导出 add by huangwei
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward exportExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      Thread.sleep(2000);
      Dto parametersDto = new BaseDto();
      parametersDto.put("reportTitle", "轮询报表");
      parametersDto.put("user", super.getSessionContainer(request).getUserInfo().getUsername());
      parametersDto.put("datetime", G4Utils.getCurrentTime());
      List fieldsList = null;
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterCheckService.queryItems(inDto);
      fieldsList = outDto.getAsList("codeList");
      if (fieldsList != null && fieldsList.size() > 0) {
         Dto dto = (Dto) fieldsList.get(0);
         parametersDto.put("pollployname", dto.getAsString("pollployname"));
         parametersDto.put("pollbegintime", dto.getAsString("pollbegintime"));
         parametersDto.put("time", dto.getAsString("time"));
      }
      ExcelExporter excelExporter = new ExcelExporter();
      excelExporter.setTemplatePath("/report/excel/PollployReport.xls");
      excelExporter.setData(parametersDto, fieldsList);
      excelExporter.setFilename("轮询报表.xls");
      excelExporter.export(request, response);
      return mapping.findForward(null);
   }
   
}
