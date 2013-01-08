package com.sunnada.nms.logmgr.web;

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

import com.sunnada.nms.dao.AlarmStateService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Aug 2, 2011 9:44:21 AM 告警情况 控制器
 */
public class AlarmStateAction extends BaseAction implements GeneralAction {
   
   private static Logger     logger            = Logger.getLogger(AlarmStateAction.class);
   
   private AlarmStateService alarmStateService = (AlarmStateService) super.getService("alarmStateService");
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return mapping.findForward("alarmStateInit");
   }
   
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 严重和重要报警列表
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStateService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 一般报警
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryGeneralItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStateService.queryGeneralItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 告警简要
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryAlarmConcise(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStateService.queryAlarmConcise(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 告警详细
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryAlarmDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStateService.queryAlarmDetail(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 导出 直放站一般警告
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward exportExcelForGeneralAlarm(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      Thread.sleep(2000);
      Dto parametersDto = new BaseDto();
      parametersDto.put("reportTitle", "直放站一般警告");
      parametersDto.put("user", super.getSessionContainer(request).getUserInfo().getUsername());
      parametersDto.put("datetime", G4Utils.getCurrentTime());
      List fieldsList = null;
      
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStateService.queryGeneralItems(inDto);
      fieldsList = outDto.getAsList("codeList");
      ExcelExporter excelExporter = new ExcelExporter();
      excelExporter.setTemplatePath("/report/excel/AlarmStateReport.xls");
      excelExporter.setData(parametersDto, fieldsList);
      excelExporter.setFilename("直放站一般警告.xls");
      excelExporter.export(request, response);
      return mapping.findForward(null);
   }
   
   /**
    * 导出 直放站严重和重要警告
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward exportExcelForAlarm(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      Thread.sleep(2000);
      Dto parametersDto = new BaseDto();
      parametersDto.put("reportTitle", "直放站严重和重要警告");
      parametersDto.put("user", super.getSessionContainer(request).getUserInfo().getUsername());
      parametersDto.put("datetime", G4Utils.getCurrentTime());
      List fieldsList = null;
      
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStateService.queryItems(inDto);
      fieldsList = outDto.getAsList("codeList");
      ExcelExporter excelExporter = new ExcelExporter();
      excelExporter.setTemplatePath("/report/excel/AlarmStateReport.xls");
      excelExporter.setData(parametersDto, fieldsList);
      excelExporter.setFilename("直放站严重和重要警告.xls");
      excelExporter.export(request, response);
      return mapping.findForward(null);
   }
   
}
