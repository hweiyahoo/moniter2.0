package com.sunnada.nms.dao.impl;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;

import com.sunnada.nms.dao.ComboxService;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.StringUtils;

/**
 * @author huangwei
 * @version 创建时间：Jul 22, 2011 5:39:10 PM
 * 
 * 公共下拉框 服务类实现
 */
public class ComboxServiceImpl extends BaseServiceImpl implements ComboxService {
   
   /**
    * 下拉框
    */
   public Dto loadComboxValue(Dto pDto) {
      String sqlmapId = null;
      String cbxName = pDto.getAsString("cbxName");
      if (Constant.CBX_PROTOCOL.equalsIgnoreCase(cbxName)) {// 协议类型
         sqlmapId = "nmscombox.queryProtocol";
      }
      else if (Constant.CBX_DEVICETYPE.equalsIgnoreCase(cbxName)) {// 设备类型
         sqlmapId = "nmscombox.queryDevicetype";
      }
      else if (Constant.CBX_SITE.equalsIgnoreCase(cbxName)) {// 地区
         HttpServletRequest request = (HttpServletRequest) pDto.get("HttpServletRequest");
         SessionContainer sessionContainer = WebUtils.getSessionContainer(request);
         String account = sessionContainer.getUserInfo().getAccount();
         account = account == null ? "" : account;
         if (!account.equalsIgnoreCase(WebUtils.getParamValue("DEFAULT_ADMIN_ACCOUNT", request)) && !account.equalsIgnoreCase(WebUtils.getParamValue("DEFAULT_DEVELOP_ACCOUNT", request))) {
            String deptid = sessionContainer.getUserInfo().getDeptid();
            if (Constant.CBX_SITE.equalsIgnoreCase(cbxName)) {// 地区
               Dto deptInfoDto = StringUtils.formatDMDeptidForNms(deptid);
               pDto.put("sitecode", deptInfoDto.getAsString("city"));
            }
         }
         sqlmapId = "nmscombox.querySite";
      }
      else if (Constant.CBX_BASETABLE.equalsIgnoreCase(cbxName)) {// 数据字典
         sqlmapId = "nmscombox.queryBasetable";
      }
      else if (Constant.CBX_BASETABLE2.equalsIgnoreCase(cbxName)) {// 数据字典
         sqlmapId = "nmscombox.queryBasetable2";
      }
      else if (Constant.CBX_EXCUTESQL.equalsIgnoreCase(cbxName)) {// 数据字典
         sqlmapId = "nmscombox.excuteSQL";
      }
      else if (Constant.CBX_BASESTAT.equalsIgnoreCase(cbxName)) {// queryBaseStat
         sqlmapId = "nmscombox.queryBaseStat";
      }
      else if (Constant.CBX_DEVICEBASE.equalsIgnoreCase(cbxName)) {// queryDevicebase
         sqlmapId = "nmscombox.queryDevicebase";
      }
      else if (Constant.CBX_NOTICEMODEL.equalsIgnoreCase(cbxName)) {// queryNoticemodel
         sqlmapId = "nmscombox.queryNoticemodel";
      }
      else if (Constant.CBX_NOTICETYPE.equalsIgnoreCase(cbxName)) {// queryNoticetype
         sqlmapId = "nmscombox.queryNoticetype";
      }
      else if (Constant.CBX_DEPTUSER.equalsIgnoreCase(cbxName)) {// querydeptuser
         sqlmapId = "nmscombox.querydeptuser";
      }
      else if (Constant.CBX_DEPTROLE.equalsIgnoreCase(cbxName)) {// querydeptuser
         sqlmapId = "nmscombox.querydeptrole";
      }
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForList(sqlmapId, pDto);
      String jsonStrList = JsonHelper.encodeObject2Json(codeList);
      outDto.put("jsonStrList", jsonStrList);
      return outDto;
   }
}
