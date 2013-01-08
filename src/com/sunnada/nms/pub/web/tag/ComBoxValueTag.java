package com.sunnada.nms.pub.web.tag;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.util.ArmConstants;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.ccl.util.GlobalConstants;
import org.eredlab.g4.rif.taglib.util.TagConstant;
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;

import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.StringUtils;

/**
 * @author 作者姓名 HuangWei
 * @version 创建时间：Jan 10, 2011 11:23:07 AM
 * 
 * 业务字典加载 结合标签:eRedG4_AMS专用
 */
public class ComBoxValueTag extends TagSupport {
   
   private static Log log = LogFactory.getLog(ComBoxValueTag.class);
   private String     name;
   private String     storeName;
   private String     paramName;
   private String     paramValue;
   private String     sql;
   
   /**
    * 标签开始
    */
   public int doStartTag() throws JspException {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      StringBuffer sb = new StringBuffer();
      sb.append(TagConstant.SCRIPT_START);
      Dto dto = new BaseDto();
      TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
      DefaultTemplate template = new FileTemplate();
      template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
      String cbxName = name;
      Dto paramDto = null;
      if (StringUtils.isEmpty(cbxName)) {
         return 0;
      }
      
      if (StringUtils.isEmpty(storeName)) {
         dto.put("code", cbxName);
      }
      else {
         dto.put("code", storeName);
      }
      
      if (!cbxName.equalsIgnoreCase(Constant.CBX_EXCUTESQL)) {
         if (!StringUtils.isEmpty(paramName)) {
            paramDto = new BaseDto();
            String[] paramNames = paramName.split(",");
            String[] paramValues = paramValue.split(",");
            // 处理输入的参数名称和参数值个数不匹配的情况，取最小长度的。
            int len = paramNames.length >= paramValues.length ? paramNames.length : paramValues.length;
            for (int i = 0; i < len; i++) {
               paramDto.put(paramNames[i], paramValues[i]);
            }
         }
      }
      else {
         paramDto = new BaseDto();
         paramDto.put("sql", sql);
      }
      String sqlmapId = this.mappingSqlMapId(cbxName);
      if (StringUtils.isEmpty(sqlmapId)) {
         return 0;
      }
      
      // 添加额外过滤条件
      paramDto = addCondition(cbxName, paramDto);
      
      List codeList = g4Dao.queryForList(sqlmapId, paramDto);
      dto.put("codeList", codeList);
      StringWriter writer = engine.mergeTemplate(template, dto);
      log.debug("----------" + storeName + "----------");
      log.debug(writer.toString());
      log.debug("----------");
      sb.append(writer.toString());
      sb.append(TagConstant.SCRIPT_END);
      try {
         pageContext.getOut().write(sb.toString());
      }
      catch (IOException e) {
         log.error(GlobalConstants.Exception_Head + e.getMessage());
         e.printStackTrace();
      }
      return super.SKIP_BODY;
   }
   
   private Dto addCondition(String cbxName, Dto paramDto) {
      HttpServletRequest request = (HttpServletRequest) this.pageContext.getRequest();
      SessionContainer sessionContainer = WebUtils.getSessionContainer(request);
      String account = sessionContainer.getUserInfo().getAccount();
      account = account == null ? "" : account;
      if (!account.equalsIgnoreCase(WebUtils.getParamValue("DEFAULT_ADMIN_ACCOUNT", request)) && !account.equalsIgnoreCase(WebUtils.getParamValue("DEFAULT_DEVELOP_ACCOUNT", request))) {
         String deptid = sessionContainer.getUserInfo().getDeptid();
         if (Constant.CBX_SITE.equalsIgnoreCase(cbxName)) {// 地区
            Dto deptInfoDto = StringUtils.formatDMDeptidForNms(deptid);
            // paramDto.put("province", deptInfoDto.getAsString("province"));
            // paramDto.put("city", deptInfoDto.getAsString("city"));
            paramDto.put("sitecode", deptInfoDto.getAsString("province"));
         }
      }
      return paramDto;
   }
   
   /**
    * 查找对应的 sqlmap id
    * 
    * @param cbxName
    * @return
    */
   private String mappingSqlMapId(String cbxName) {
      String sqlmapId = null;
      if (Constant.CBX_PROTOCOL.equalsIgnoreCase(cbxName)) {// 协议类型
         sqlmapId = "nmscombox.queryProtocol";
      }
      else if (Constant.CBX_DEVICETYPE.equalsIgnoreCase(cbxName)) {// 设备类型
         sqlmapId = "nmscombox.queryDevicetype";
      }
      else if (Constant.CBX_SITE.equalsIgnoreCase(cbxName)) {// 地区
         sqlmapId = "nmscombox.querySite";
      }
      else if (Constant.CBX_BASETABLE.equalsIgnoreCase(cbxName)) {// 数据字典
         sqlmapId = "nmscombox.queryBasetable";
      }
      else if (Constant.CBX_BASETABLE2.equalsIgnoreCase(cbxName)) {// 数据字典2
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
      else if (Constant.CBX_DEPTROLE.equalsIgnoreCase(cbxName)) {// querydeptrole
         sqlmapId = "nmscombox.querydeptrole";
      }
      return sqlmapId;
   }
   
   /**
    * 标签结束
    */
   public int doEndTag() throws JspException {
      return super.EVAL_PAGE;
   }
   
   /**
    * 释放资源
    */
   public void release() {
      name = null;
      storeName = null;
      paramName = null;
      paramValue = null;
      sql = null;
      super.release();
   }
   
   public static void setLog(Log log) {
      ComBoxValueTag.log = log;
   }
   
   public void setName(String name) {
      this.name = name;
   }
   
   public void setParamName(String paramName) {
      this.paramName = paramName;
   }
   
   public void setParamValue(String paramValue) {
      this.paramValue = paramValue;
   }
   
   public void setStoreName(String storeName) {
      this.storeName = storeName;
   }
   
   public void setSql(String sql) {
      this.sql = sql;
   }
   
}
