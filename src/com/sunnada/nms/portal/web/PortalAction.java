package com.sunnada.nms.portal.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.util.HttpUtils;
import com.sunnada.nms.util.StringUtils;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:27:13 PM
 * 
 * 我的工作台 控制器
 */
public class PortalAction extends BaseAction {
   private static Logger logger = Logger.getLogger(PortalAction.class);
   
   public ActionForward calendar(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      Map paramsMap = new HashMap();
      paramsMap.put("t", "3"); // 显式3天天气信息
      paramsMap.put("js", "0");
      String weatherStr = HttpUtils.URLPost("http://api.liqwei.com/weather/", paramsMap, HttpUtils.URL_PARAM_DECODECHARSET_UTF8);
      List weatherList = null;
      if (!StringUtils.isEmpty(weatherStr)) {
         weatherList = new ArrayList();
         String[] weatherInfos = weatherStr.split("<br/>");
         for (int i = 0; i < weatherInfos.length; i++) {
            Map weather = new HashMap();
            String temp = weatherInfos[i].split(",")[1];
            String fontStyle = "<span style='font-weight:bold;color:DC532E'>今天</span>";
            if (i == 1) {
               fontStyle = "<span style='font-weight:bold;color:DC532E'>明天</span>";
            }
            else if (i == 2) {
               fontStyle = "<span style='font-weight:bold;color:DC532E'>后天</span>";
            }
            String weatherInfo = weatherInfos[i].replace(temp, fontStyle + "[" + temp + "]");
            weather.put("weatherInfo", weatherInfo);
            weatherList.add(weather);
         }
      }
      request.setAttribute("weatherList", weatherList);
      return mapping.findForward("calendaInit");
   }
   
   public ActionForward memo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      return mapping.findForward("memoInit");
   }
   
   public ActionForward notice(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      inDto.put("user_id", userInfoVo.getUserid());
      inDto.put("type_id", "2");
      inDto.put("start", "0");
      inDto.put("limit", "5");// 显式5条数据
      List noticeList = g4Dao.queryForPage("receive.queryItemForList", inDto);
      request.setAttribute("noticeList", noticeList);
      return mapping.findForward("noticeInit");
   }
   
   public ActionForward alarm(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      String deptId = userInfoVo.getDeptid();
      Dto dto = StringUtils.formatDMDeptidForNms(deptId);
      if (StringUtils.isEmpty(dto.getAsString("province")) && StringUtils.isEmpty(dto.getAsString("city"))) {
         return mapping.findForward("alarmInit");
      }
      inDto.putAll(dto);
      inDto.put("flag", "1");// 未处理
      inDto.put("start", "0");
      inDto.put("limit", "10");// 显式10条数据
      List alarmList = g4Dao.queryForPage("alarmLog.queryItemForList", inDto);
      request.setAttribute("alarmList", alarmList);
      inDto.put("alarmtype", "10");
      int alarm_10 = (Integer) g4Dao.queryForObject("alarmLog.statsUnDoAlarmForUserSite", inDto);
      inDto.put("alarmtype", "20");
      int alarm_20 = (Integer) g4Dao.queryForObject("alarmLog.statsUnDoAlarmForUserSite", inDto);
      inDto.put("alarmtype", "30");
      int alarm_30 = (Integer) g4Dao.queryForObject("alarmLog.statsUnDoAlarmForUserSite", inDto);
      request.setAttribute("alarm_10", alarm_10);
      request.setAttribute("alarm_20", alarm_20);
      request.setAttribute("alarm_30", alarm_30);
      return mapping.findForward("alarmInit");
   }
   
   public ActionForward weather(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      return mapping.findForward("weatherInit");
   }
}
