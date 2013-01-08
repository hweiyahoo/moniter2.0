package com.sunnada.nms.logmgr.web;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.fcf.Categorie;
import org.eredlab.g4.rif.report.fcf.CategoriesConfig;
import org.eredlab.g4.rif.report.fcf.DataSet;
import org.eredlab.g4.rif.report.fcf.FcfDataMapper;
import org.eredlab.g4.rif.report.fcf.GraphConfig;
import org.eredlab.g4.rif.report.fcf.Set;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.AlarmStatisticsService;
import com.sunnada.nms.util.action.GeneralAction;
import com.sunnada.nms.util.StringUtils;

/**
 * @author 杨智铮 E-mail: 278668433@qq.com
 * @version 创建时间：Jul 26, 2011 4:08:03 PM 告警统计 控制器
 */
public class AlarmStatisticsAction extends BaseAction implements GeneralAction {
   private static Logger          logger                 = Logger.getLogger(AlarmStatisticsAction.class);
   
   private AlarmStatisticsService alarmStatisticsService = (AlarmStatisticsService) super.getService("alarmStatisticsService");
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return mapping.findForward("alarmStatisticsInit");
   }
   
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStatisticsService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward queryStatisticsForList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStatisticsService.queryStatisticsForList(inDto);
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
      Dto outDto = this.alarmStatisticsService.queryStatisticsReportList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward queryParamCodeReportList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStatisticsService.queryParamCodeReportList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 告警统计结果 导出 add by huangwei
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
      parametersDto.put("reportTitle", "告警统计");
      parametersDto.put("user", super.getSessionContainer(request).getUserInfo().getUsername());
      parametersDto.put("datetime", G4Utils.getCurrentTime());
      List fieldsList = null;
      
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.alarmStatisticsService.queryItems(inDto);
      
      fieldsList = outDto.getAsList("codeList");
      ExcelExporter excelExporter = new ExcelExporter();
      excelExporter.setTemplatePath("/report/excel/AlarmStatisticsReport.xls");
      excelExporter.setData(parametersDto, fieldsList);
      excelExporter.setFilename("告警统计.xls");
      excelExporter.export(request, response);
      return mapping.findForward(null);
   }
   
   /**
    * 2D柱形组合图初始化 综合图和前面的单一图使用的元数据格式是不一样的,请大家注意它们的区别
    * 
    * @param
    * @return
    */
   public ActionForward fcf2DColumnMsInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      GraphConfig graphConfig = new GraphConfig();
      graphConfig.setCaption("各类告警数量统计");
      // graphConfig.setSubcaption("");
      // graphConfig.setXAxisName("站点名称");
      // graphConfig.setShowNames(true);
      // graphConfig.setYAxisName("数量");
      // graphConfig.setNumberPrefix("$");
      // graphConfig.put("propertyName", "value");
      graphConfig.setCanvasBorderThickness(new Boolean(true));
      CategoriesConfig categoriesConfig = new CategoriesConfig();
      List cateList = new ArrayList();
      List<Dto> alist = g4Reader.queryForList("alarmStatistics.statistFor2DChartCateList", inDto);
      List<String> repeatQueue = new ArrayList();
      for (Dto dto : alist) {
         cateList.add(new Categorie(dto.getAsString("name")));
         repeatQueue.add(dto.getAsString("repeaterid"));
      }
      categoriesConfig.setCategories(cateList);
      List list = getFcfDataList4Group(inDto, repeatQueue);
      String xmlString = FcfDataMapper.toFcfXmlData(list, graphConfig, categoriesConfig);
      Dto outDto = new BaseDto();
      outDto.put("success", new Boolean(true));
      outDto.put("xmlstring", xmlString);
      outDto.put("width", "400");
      write(JsonHelper.encodeObject2Json(outDto), response);
      return mapping.findForward(null);
   }
   
   /**
    * 获取FlashReport元数据 (柱状组合图)
    * 
    * @param pDto
    * @return
    */
   private List getFcfDataList4Group(Dto pDto, List<String> repeatQueue) {
      List dataList = new ArrayList(); // return value
      List<Dto> alist = g4Reader.queryForList("alarmStatistics.statistFor2DChartDataSet", pDto);
      String[] dataSetNames = { "一般告警", "重要告警", "严重告警" };
      String[] dataSetTypes = { "10", "20", "30" };
      String[] dataSetColors = { "F9DE39", "F98039", "F92939" };
      String alarmtype = pDto.getAsString("alarmtype");
      boolean findValue = false;
      boolean isBreak = false;// 指定加载单个告警统计数据，此时就需要用这个属性来控制遍历条件
      for (int i = 0; i < dataSetNames.length; i++) {
         if (isBreak)
            break;
         if (!StringUtils.isEmpty(alarmtype)) {
            for (int j = 0; j < dataSetTypes.length; j++) {
               if (alarmtype.equals(dataSetTypes[j])) {
                  i = j;
                  isBreak = true;
               }
            }
         }
         DataSet dataSet = new DataSet();
         dataSet.setSeriesname(dataSetNames[i]);
         dataSet.setColor(dataSetColors[i]);
         List aSetList = new ArrayList();
         for (String repeaterid : repeatQueue) {// 按站点顺序进行遍历
            findValue = false;
            Set set = new Set();
            for (Dto dto : alist) {// 遍历DataSet
               String repeaterid_ = dto.getAsString("repeaterid");
               String alarmName_ = dto.getAsString("name");
               if (repeaterid.equals(repeaterid_) && dataSetNames[i].equals(alarmName_)) {
                  set.setValue(dto.getAsString("value"));
                  findValue = true;
               }
            }
            if (!findValue) {
               set.setValue("0");
            }
            aSetList.add(set);
         }
         dataSet.setData(aSetList);
         dataList.add(dataSet);
      }
      return dataList;
   }
}
