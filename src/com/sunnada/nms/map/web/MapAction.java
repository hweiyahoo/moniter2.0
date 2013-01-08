package com.sunnada.nms.map.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.MapService;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.StringUtils;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:27:13 PM
 * 
 * 测试 控制器
 */
public class MapAction extends BaseAction {
   private static Logger logger     = Logger.getLogger(MapAction.class);
   
   private MapService    mapService = (MapService) super.getService("mapService");
   
   /**
    * 地图引擎初始化页面
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
      String customId = userInfo.getCustomId();
      Dto outDto = null;
      // 添加用户区域过滤
      if (Constant.DEPT_DMORG.equals(customId)) {
         String deptid = userInfo.getDeptid();
         outDto = StringUtils.formatDMDeptidForNms(deptid);
      }
      request.setAttribute("params", outDto);
      return mapping.findForward("mapbarInit");
   }
   
   /**
    * 站点信息，包括站点名称和告警数量，告警状态
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryStationPointInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      List pointInfoList = g4Reader.queryForList("map.queryStationPointInfo", inDto);
      // write(JsonHelper.encodeObject2Json(pointInfoList), response);
      write(JsonHelper.encodeList2PageJson(pointInfoList, 0, null), response);
      return mapping.findForward(null);
   }
   
   /**
    * 加载站点树菜单
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryStationItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto dto = aForm.getParamAsDto(request);
      String[] node_id = request.getParameter("node").split("_");
      String node_prefix = node_id[0];
      List menuList = null;
      Dto menuDto = new BaseDto();
      if ("root".equals(node_prefix)) {// 加载 省级节点
         menuList = g4Reader.queryForList("map.queryItemsForProvince", dto);
         for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            menuDto.put("leaf", new Boolean(false));
            menuDto.put("expanded", new Boolean(true));
         }
         // 判断有没有未分类的上报站点 modify huangwei
         int count = (Integer) g4Reader.queryForObject("map.checkNoClassStation");
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
         menuList = g4Reader.queryForList("map.queryItemsForNoClassStation", dto);
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
         menuList = g4Reader.queryForList("map.queryItemsForSubStation", dto);
         Dto nodeDto = null;
         for (int i = 0; i < menuList.size(); i++) {
            nodeDto = (Dto) menuList.get(i);
            nodeDto.put("iconCls", nodeDto.get("iconcls"));
            nodeDto.remove("iconcls");
         }
      }
      else if ("province".equals(node_prefix)) { // 加载 城市节点
         dto.put("province", node_id[1]);
         menuList = g4Reader.queryForList("map.queryItemsForCity", dto);
         for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            menuDto.put("leaf", new Boolean(false));
            // menuDto.put("expanded", new Boolean(true));
         }
      }
      else if ("city".equals(node_prefix)) {// 加载 主站点节点
         dto.put("province", node_id[1]);
         dto.put("city", node_id[2]);
         menuList = g4Reader.queryForList("map.queryItemsForStation", dto);
         for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            menuDto.put("leaf", new Boolean(false));
            // menuDto.put("expanded", new Boolean(true));
            menuDto.put("iconCls", menuDto.get("iconcls"));
            menuDto.remove("iconcls");
         }
      }
      else if ("station".equals(node_prefix)) {// 加载 子站点节点
         dto.put("station", node_id[1]);
         menuList = g4Reader.queryForList("map.queryItemsForSubStation", dto);
         for (int i = 0; i < menuList.size(); i++) {
            menuDto = (BaseDto) menuList.get(i);
            menuDto.put("leaf", new Boolean(false));
            // menuDto.put("expanded", new Boolean(true));
            menuDto.put("iconCls", menuDto.get("iconcls"));
            menuDto.remove("iconcls");
         }
      }
      write(JsonHelper.encodeObject2Json(menuList), response);
      return mapping.findForward(null);
   }
   
   /**
    * 保存省份地市位子信息
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward saveSitePointInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.mapService.saveSitePointInfo(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      write(jsonString, response);
      return mapping.findForward(null);
   }
   
   /**
    * 保存站点位子信息
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward saveStationPointInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto outDto = this.mapService.saveStationPointInfo(inDto);
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      write(jsonString, response);
      return mapping.findForward(null);
   }
   
}
