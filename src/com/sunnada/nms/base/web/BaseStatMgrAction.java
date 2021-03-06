package com.sunnada.nms.base.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.BaseStatMgrService;
import com.sunnada.nms.dao.ComboxService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author gezhidong E-mail: fengyu_hqu@sina.com
 * @version 创建时间：Jul 25, 2011 9:07:47 AM 基站管理 控制器
 */
public class BaseStatMgrAction extends BaseAction implements GeneralAction {
   
   private static Logger      logger             = Logger
                                                       .getLogger(BaseStatMgrAction.class);
   
   private BaseStatMgrService baseStatMgrService = (BaseStatMgrService) super
                                                       .getService("baseStatMgrService");
   
   private ComboxService      comboxService      = (ComboxService) super
                                                       .getService("comboxService");
   
   /**
    * 删除
    */
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      String strChecked = request.getParameter("strChecked");
      Dto inDto = new BaseDto();
      inDto.put("strChecked", strChecked);
      Dto outDto = this.baseStatMgrService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 页面初始化
    */
   public ActionForward init(ActionMapping mapping, ActionForm form,
                             HttpServletRequest request, HttpServletResponse response)
                                                                                      throws Exception {
      
      return mapping.findForward("BaseStatMgrInit");
   }
   
   /**
    * 插入记录
    */
   public ActionForward insertItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String account = super.getSessionContainer(request).getUserInfo().getAccount();
      inDto.put("create_user", account);
      Dto outDto = this.baseStatMgrService.insertItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 查询记录
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.baseStatMgrService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 更新记录
    */
   public ActionForward updateItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.baseStatMgrService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 导入数据
    */
   public ActionForward importFromExcel(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      
      CommonActionForm aForm = (CommonActionForm) form;
      FormFile formFile = aForm.getTheFile();
      // 指定Excel字段名称
      String metaData = "basestatcode,basestatname,cid,x,y,pnbcch,province,city,detail";
      ExcelReader er = new ExcelReader(metaData, formFile.getInputStream());
      List fileData = er.read(3);
      Dto outDto = this.baseStatMgrService.importFromExcel(fileData);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
}
