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

import com.sunnada.nms.dao.RepeaterStatisticsService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 28, 2011 9:11:02 AM 直放站统计 控制器
 */
public class RepeaterStatisticsAction extends BaseAction implements GeneralAction {
   
   private static Logger             logger                    = Logger.getLogger(RepeaterStatisticsAction.class);
   
   private RepeaterStatisticsService repeaterStatisticsService = (RepeaterStatisticsService) super.getService("repeaterStatisticsService");
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 初始化页面
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("repeaterStatisticsInit");
   }
   
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   /**
    * 查询页面
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterStatisticsService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward queryStatisticsReportList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterStatisticsService.queryStatisticsReportList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward queryDeviceReportList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterStatisticsService.queryDeviceReportList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 直放站统计结果 导出 add by huangwei
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
      parametersDto.put("reportTitle", "直放站统计");
      parametersDto.put("user", super.getSessionContainer(request).getUserInfo().getUsername());
      parametersDto.put("datetime", G4Utils.getCurrentTime());
      List fieldsList = null;
      
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterStatisticsService.queryItems(inDto);
      
      fieldsList = outDto.getAsList("codeList");
      ExcelExporter excelExporter = new ExcelExporter();
      excelExporter.setTemplatePath("/report/excel/RepeaterStatisticsReport.xls");
      excelExporter.setData(parametersDto, fieldsList);
      excelExporter.setFilename("直放站统计.xls");
      excelExporter.export(request, response);
      return mapping.findForward(null);
   }
   
}
