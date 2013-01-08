package com.sunnada.nms.cfg.web;

import java.util.ArrayList;
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
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.EditorMngService;
import com.sunnada.nms.util.action.GeneralAction;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:27:13 PM
 * 
 * 编辑控件管理 控制器
 */
public class EditorMngAction extends BaseAction{
   private static Logger    logger           = Logger.getLogger(EditorMngAction.class);
   private EditorMngService editorMngService = (EditorMngService) super.getService("editorMngService");
   
   /**
    * 删除 映射表信息
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward deleteMapping(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.editorMngService.deleteMapping(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("editorMngInit");
   }
   
   /**
    * 加载 控件详细信息列表
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryEditorList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.editorMngService.queryEditorList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 加载编辑控件树
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryEditor(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String jsonStrList = "";
      if ("00".equals(inDto.getAsString("node"))) {
         Dto outDto = editorMngService.queryEditorType(null);
         jsonStrList = outDto.getAsString("jsonStrList");
      }
      else {
         Dto outDto = editorMngService.queryEditor(inDto);
         jsonStrList = outDto.getAsString("jsonStrList");
      }
      write(jsonStrList, response);
      return mapping.findForward(null);
   }
   
   /**
    * 显式监控参数与编辑控件映射列表
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryMappingItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.editorMngService.queryMappingList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 跳转到监控参数页面
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward initSelectMoncode(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("param", inDto);
      return mapping.findForward("selectMoncodeInit");
   }
   
   /**
    * 选择监控参数
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryMoncodeListForSel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.editorMngService.queryMoncodeListForSel(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 添加映射表记录
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward insertMapping(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.editorMngService.insertMapping(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 保存 控件类型 [新增 or 修改]
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward saveSubEditor(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String windowmodel = inDto.getAsString("windowmodel");
      Dto outDto = null;
      if ("add".equals(windowmodel)) {
         outDto = this.editorMngService.insertEditor(inDto);
      }
      else if ("edit".equals(windowmodel)) {
         outDto = this.editorMngService.updateEditor(inDto);
      }
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 删除 控件类型
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward deleteEditor(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.editorMngService.deleteEditor(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 查询 编辑数据集
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryEditorData(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      // Dto inDto = aForm.getParamAsDto(request);
      List list = aForm.getGridDirtyData(request);
      String jsonString = JsonHelper.encodeObject2Json(list);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 保存 编辑数据集
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward saveEditorData(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String windowmodel = inDto.getAsString("windowmodel");
      Dto outDto = null;
      List<Dto> dataList = null;
      String editorcontent = "";
      String value = inDto.getAsString("value");
      String text = inDto.getAsString("text");
      if ("add".equals(windowmodel)) {
         dataList = aForm.getGridDirtyData(request);
         // validation
         for (int i = 0; i < dataList.size(); i++) {
            Dto dto = dataList.get(i);
            if (text.equals(dto.getAsString("text"))) {
               outDto = new BaseDto();
               outDto.put("msg", "text=" + text + "已经存在，请重新输入!");
               outDto.put("success", new Boolean(false));
               String jsonString = JsonHelper.encodeObject2Json(outDto);
               response.getWriter().write(jsonString);
               return mapping.findForward(null);
            }
            else if (value.equals(dto.getAsString("value"))) {
               outDto = new BaseDto();
               outDto.put("msg", "value=" + value + "已经存在，请重新输入!");
               outDto.put("success", new Boolean(false));
               String jsonString = JsonHelper.encodeObject2Json(outDto);
               response.getWriter().write(jsonString);
               return mapping.findForward(null);
            }
         }
         if (dataList == null || dataList.size() == 0) {
            dataList = new ArrayList();
         }
         Dto dto = new BaseDto();
         dto.put("text", text);
         dto.put("value", value);
         dataList.add(dto);
         editorcontent = JsonHelper.encodeObject2Json(dataList);
      }
      else if ("edit".equals(windowmodel)) {
         dataList = aForm.getGridDirtyData(request);
         String text_old = inDto.getAsString("text_old");
         String value_old = inDto.getAsString("value_old");
         // validation
         for (int i = 0; i < dataList.size(); i++) {
            Dto dto = dataList.get(i);
            if (text.equals(dto.getAsString("text")) && !value_old.equals(dto.getAsString("value"))) {
               outDto = new BaseDto();
               outDto.put("msg", "text=" + text + "已经存在，请重新输入!");
               outDto.put("success", new Boolean(false));
               String jsonString = JsonHelper.encodeObject2Json(outDto);
               response.getWriter().write(jsonString);
               return mapping.findForward(null);
            }
            else if (value.equals(dto.getAsString("value")) && !text_old.equals(dto.getAsString("text"))) {
               outDto = new BaseDto();
               outDto.put("msg", "value=" + value + "已经存在，请重新输入!");
               outDto.put("success", new Boolean(false));
               String jsonString = JsonHelper.encodeObject2Json(outDto);
               response.getWriter().write(jsonString);
               return mapping.findForward(null);
            }
         }
         for (int i = 0; i < dataList.size(); i++) {
            Dto dto = dataList.get(i);
            if (dto.getAsString("text").equals(text_old)) {
               dto.put("text", text);
            }
            if (dto.getAsString("value").equals(value_old)) {
               dto.put("value", value);
            }
         }
         editorcontent = JsonHelper.encodeObject2Json(dataList);
      }
      else if ("del".equals(windowmodel)) {
         dataList = aForm.getGridDirtyData(request);
         for (int i = 0; i < dataList.size(); i++) {
            Dto dto = dataList.get(i);
            if (dto.getAsString("value").equals(value) && dto.getAsString("text").equals(text)) {
               dataList.remove(i);
            }
         }
         editorcontent = JsonHelper.encodeObject2Json(dataList);
      }
      inDto.put("editorcontent", editorcontent);
      outDto = this.editorMngService.saveEditorData(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
}
