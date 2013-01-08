package com.sunnada.nms.repeaterManager.web;

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

import com.sunnada.nms.dao.RepeaterPollCfgService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.action.GeneralAction;
import com.sunnada.nms.util.schedule.PollJobInit;
import com.sunnada.nms.util.schedule.QuartzUtils;
import com.sunnada.nms.util.sys.PollPush;

/**
 * @author huangwei
 * @version 创建时间：Jul 30, 2011 12:24:25 PM
 * 
 * 直放站轮询设置 逻辑控制类
 */
public class RepeaterPollCfgAction extends BaseAction implements GeneralAction {
   private static Logger          logger                 = Logger.getLogger(RepeaterPollCfgAction.class);
   private RepeaterPollCfgService repeaterPollCfgService = (RepeaterPollCfgService) super.getService("repeaterPollCfgService");
   
   /**
    * 删除轮询策略
    */
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.deleteItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 轮询设置首页 页面初始化
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      request.setAttribute("CurrentDay", DateTimeUtils.getDateDayFormat());
      return mapping.findForward("repcfgInit");
   }
   
   /**
    * 新增轮询策略
    */
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.insertItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 查询轮询策略列表
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 修改 轮询策略
    */
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.updateItem(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 启用/停用 轮询策略
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward ployEnabled(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String flag = inDto.getAsString("flag");
      Dto outDto = this.repeaterPollCfgService.updateItemForployEnabled(inDto);
      // 当成功启动轮询策略时，把指定的策略添加到任务调度中...
      if ("1".equals(flag)) {
         if ((Boolean) outDto.get("success")) {
            // 开启任务调度
            PollJobInit.addJobToScheduleAtSysInit(getServlet().getServletContext());
         }
      }
      else if ("0".equals(flag)) {
         String pollployid = inDto.getAsString("pollployid");
         boolean temp = QuartzUtils.stopJobForPoll(pollployid);
         outDto = new BaseDto();
         String msg = temp == true ? "停止成功！" : "停止失败！";
         outDto.put("msg", msg);
         outDto.put("success", temp);
         response.getWriter().write(JsonHelper.encodeObject2Json(outDto));
         return mapping.findForward(null);
      }
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 查询 已经选中，需要轮询的直放站站点
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryChoiseRepeaters(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.queryChoisedRepeaterForList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 添加 指定策略的轮询站点
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward insertChoisedRepeater(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.insertChoisedRepeater(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 删除 轮询的直放站站点
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward deleteChoisedRepeater(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.deleteChoisedRepeater(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 查询 全部直放站站点信息
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryRepeaters(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.queryRepeaterForList(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 选择轮询站点 页面初始化
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward initForSelectRepeater(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("params", inDto);
      return mapping.findForward("repeaterInit");
   }
   
   /**
    * 设置轮询策略 监控参数 页面初始化
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward initForSetMoniterParams(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("params", inDto);
      return mapping.findForward("moniterParamsInit");
   }
   
   /**
    * 可选监控量参数
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
      Dto outDto = this.repeaterPollCfgService.queryMoncodeListForSel(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 已选监控量参数
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryMoncodeListForSet(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.queryMoncodeListForSet(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 添加 监控量参数
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward updateMoniterParams(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.updateMoniterParams(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 检测 监控量参数
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward validateMoniterParams(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.repeaterPollCfgService.validateMoniterParams(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 轮询任务 开始
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward pollStart(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      Dto outDto = new BaseDto();
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      inDto.put("flag", "1");
      inDto.put("pollstatus", 1);
      // inDto.put("pollbegintime", DateTimeUtils.getDateSecondFormat());
      Dto dto = (Dto) g4Reader.queryForObject("reqpollcfg.queryPollployForList", inDto);
      if (dto != null) {
         outDto.put("msg", "轮询任务开始失败！已经有轮询任务在执行了！");
         outDto.put("success", new Boolean(false));
         response.getWriter().write(JsonHelper.encodeObject2Json(outDto));
         return mapping.findForward(null);
      }
      
      boolean success = PollJobInit.addJobForPollToSchedule(getServlet().getServletContext());
      if (success) {
         inDto.put("pollstatus", 1);
         this.repeaterPollCfgService.updateItemForployStatus(inDto);// 设置轮询状态为1：正在轮询中...
         PollPush.getInstance().updatePloyGrid("已经开始轮询，轮询结果正在接受中...在此过程中，你可以进行其他操作！");// 前台推送轮询状态
      }
      outDto.put("msg", success == true ? "" : "请先设置轮询策略并设置启用状态！");
      outDto.put("success", success);
      response.getWriter().write(JsonHelper.encodeObject2Json(outDto));
      return mapping.findForward(null);
   }
   
   /**
    * 轮询任务 停止
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward pollStop(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      Dto outDto = new BaseDto();
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      inDto.put("flag", "1");
      inDto.put("pollstatus", 1);
      // inDto.put("pollbegintime", DateTimeUtils.getDateSecondFormat());
      Dto dto = (Dto) g4Reader.queryForObject("reqpollcfg.queryPollployForList", inDto);
      if (dto == null) {
         outDto.put("msg", "轮询任务结束失败！没有需要停止的轮询任务！");
         outDto.put("success", new Boolean(false));
         response.getWriter().write(JsonHelper.encodeObject2Json(outDto));
         return mapping.findForward(null);
      }
      String pollployid = dto.getAsString("pollployid");
      boolean flag = QuartzUtils.stopJobForPoll(pollployid);
      if (flag) {
         inDto.put("pollstatus", 0);
         this.repeaterPollCfgService.updateItemForployStatus(inDto);// 设置轮询状态为3：轮询终止...
         PollPush.getInstance().updatePloyGrid("轮询被停止！");// 前台推送轮询状态
      }
      
      String msg = flag == true ? "" : "停止失败！";
      outDto.put("msg", msg);
      outDto.put("success", flag);
      response.getWriter().write(JsonHelper.encodeObject2Json(outDto));
      return mapping.findForward(null);
   }
   
}
