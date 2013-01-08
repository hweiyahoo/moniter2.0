package com.sunnada.nms.repeaterManager.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.sys.DMParamPush;

/**
 * @author huangwei
 * @version 创建时间：Aug 10, 2011 1:26:56 PM
 * 
 * 设备监控
 */
public class DeviceMonitorAction extends BaseAction {
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
      String customId = userInfo.getCustomId();
      // 添加用户区域过滤
      if (Constant.DEPT_DMORG.equals(customId)) {
         String deptid = userInfo.getDeptid();
         Dto outDto = StringUtils.formatDMDeptidForNms(deptid);
         request.setAttribute("params", outDto);
      }
      return mapping.findForward("deviceMntInit");
   }
   
   public ActionForward queryStationItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto dto = aForm.getParamAsDto(request);
      String[] node_id = request.getParameter("node").split("_");
      String node_prefix = node_id[0];
      List menuList = null;
      Dto menuDto = new BaseDto();
      if ("root".equals(node_prefix)) {// 加载 省级节点
         menuList = g4Reader.queryForList("devicemnt.queryItemsForProvince", dto);
         for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            menuDto.put("leaf", new Boolean(false));
            menuDto.put("expanded", new Boolean(true));
         }
         // 判断有没有未分类的上报站点 modify huangwei
         int count = (Integer) g4Reader.queryForObject("devicemnt.checkNoClassStation");
         if (count > 0) {
            menuDto = new BaseDto();
            menuDto.put("id", "notclass");
            menuDto.put("text", "未分类站点");
            menuDto.put("iconCls", "nmsnotclassIcon");
            menuDto.put("leaf", new Boolean(false));
            menuDto.put("expanded", new Boolean(true));
            menuList.add(menuDto);
         }
      }
      else if ("notclass".equals(node_prefix)) { // 加载未分类主站
         menuList = g4Reader.queryForList("devicemnt.queryItemsForNoClassStation", dto);
         for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            menuDto.put("iconCls", menuDto.get("iconcls"));
            menuDto.remove("iconcls");
            menuDto.put("leaf", new Boolean(false));
            menuDto.put("expanded", new Boolean(true));
         }
      }
      else if ("notclass|station".equals(node_prefix)) { // 加载未分类丛站
         dto.put("parentrepid", node_id[3]);
         menuList = g4Reader.queryForList("devicemnt.queryItemsForSubStation", dto);
         Dto nodeDto = null;
         for (int i = 0; i < menuList.size(); i++) {
            nodeDto = (Dto) menuList.get(i);
            nodeDto.put("iconCls", nodeDto.get("iconcls"));
            nodeDto.remove("iconcls");
         }
      }
      else if ("province".equals(node_prefix)) { // 加载 城市节点
         dto.put("province", node_id[1]);
         menuList = g4Reader.queryForList("devicemnt.queryItemsForCity", dto);
         for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            menuDto.put("leaf", new Boolean(false));
            menuDto.put("expanded", new Boolean(true));
         }
      }
      else if ("city".equals(node_prefix)) {// 加载 主站点节点
         dto.put("province", node_id[1]);
         dto.put("city", node_id[2]);
         menuList = g4Reader.queryForList("devicemnt.queryItemsForStation", dto);
         Dto nodeDto = null;
         for (int i = 0; i < menuList.size(); i++) {
            nodeDto = (Dto) menuList.get(i);
            nodeDto.put("iconCls", nodeDto.get("iconcls"));
            nodeDto.remove("iconcls");
         }
      }
      else if ("station".equals(node_prefix)) {// 加载 子站点节点
         // dto.put("station", node_id[1]);
         dto.put("parentrepid", node_id[3]);
         menuList = g4Reader.queryForList("devicemnt.queryItemsForSubStation", dto);
         Dto nodeDto = null;
         for (int i = 0; i < menuList.size(); i++) {
            nodeDto = (Dto) menuList.get(i);
            nodeDto.put("iconCls", nodeDto.get("iconcls"));
            nodeDto.remove("iconcls");
         }
      }
      write(JsonHelper.encodeObject2Json(menuList), response);
      return mapping.findForward(null);
   }
   
   public ActionForward queryStationItemsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      inDto = packageStationItemsForQuery(inDto);
      List codeList = g4Reader.queryForPage("devicemnt.queryItemsForStationList", inDto);
      Integer totalCount = (Integer) g4Reader.queryForObject("devicemnt.queryCountForStationList", inDto);
      write(JsonHelper.encodeList2PageJson(codeList, totalCount, null), response);
      return mapping.findForward(null);
   }
   
   public ActionForward setInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("param", inDto);
      // Thread.sleep(200);
      // ToastMsgPush.getInstance().send("123123",false);
      // ToastMsgPush.getInstance().sendBizMsgBySite("14","01","系统检测到有开站上报信息！",false);
      // PollPush.getInstance().updatePloyGrid("Test");
      // substation_14010008_01_2014
      DMParamPush.getInstance().updateTreeNodeConnStatus("substation","14010008","01","2014");
      return mapping.findForward("setInit");
   }
   
   public ActionForward statusInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("param", inDto);
      return mapping.findForward("statusInit");
   }
   
   public ActionForward paramsInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("param", inDto);
      return mapping.findForward("paramsInit");
   }
   
   public ActionForward baseInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      request.setAttribute("param", inDto);
      return mapping.findForward("baseInit");
   }
   
   public ActionForward saveParamInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      List list = aForm.getGridDirtyData(request);
      Dto outDto = new BaseDto();
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      for (int i = 0; i < list.size(); i++) {
         Dto dto = (BaseDto) list.get(i);
         dto.put("uptime", DateTimeUtils.getDateSecondFormat());
         try {
            g4Dao.update("devicemnt.updateParam", dto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "设置失败！");
         }
         outDto.put("success", new Boolean(true));
         outDto.put("msg", "设置成功！");
      }
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   /**
    * 设备监控列表 导出成excel add by xujinmei
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
      System.out.println();
      Dto parametersDto = new BaseDto();
      parametersDto.put("reportTitle", "直放站站点详细信息");
      parametersDto.put("user", super.getSessionContainer(request).getUserInfo().getUsername());
      parametersDto.put("datetime", G4Utils.getCurrentTime());
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      inDto = packageStationItemsForQuery(inDto);
      List fieldsList = g4Reader.queryForPage("devicemnt.queryItemsForStationList", inDto);
      ExcelExporter excelExporter = new ExcelExporter();
      excelExporter.setTemplatePath("/report/excel/repeaterReport.xls");
      excelExporter.setData(parametersDto, fieldsList);
      excelExporter.setFilename("直放站站点详细信息.xls");
      excelExporter.export(request, response);
      return mapping.findForward(null);
   }
   
   private Dto packageStationItemsForQuery(Dto inDto) {
      String menuid = inDto.getAsString("menuid");
      inDto.remove("parentrepid"); // 解决点击站点完，在点击地区节点数据加载不准确的bug！
      if (StringUtils.isEmpty(menuid))
         return inDto;
      String[] node_id = inDto.getAsString("menuid").split("_");
      String node_prefix = node_id[0];
      if ("province".equals(node_prefix)) { // 加载 城市节点
         inDto.put("province", node_id[1]);
      }
      else if ("city".equals(node_prefix)) {// 加载 主站点节点
         inDto.put("province", node_id[1]);
         inDto.put("city", node_id[2]);
      }
      else if ("station".equals(node_prefix)) {// 加载 主站点节点
         inDto.put("parentrepid", node_id[3]);
         inDto.put("repeaterid", node_id[3]);
      }
      else if ("substation".equals(node_prefix)) {// 加载 子站点节点
         inDto.put("repeaterid", node_id[3]);
      }
      else if ("notclass".equals(node_prefix)) {// 加载 未分类 所有站点节点
         inDto.put("notclass", "1");
      }
      else if ("notclass|station".equals(node_prefix)) {// 加载 未分类 站点节点
         inDto.put("parentrepid", node_id[3]);
         inDto.put("repeaterid", node_id[3]);
      }
      return inDto;
   }
}
