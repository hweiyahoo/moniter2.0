package com.sunnada.nms.map.web.tag;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

/**
 * @author huangwei
 * @version 创建时间：Oct 21, 2011 10:05:28 AM
 * 
 * 地图标签
 */
public class MapTag extends TagSupport {
   
   private static Log log = LogFactory.getLog(MapTag.class);
   private String     province;
   private String     city;
   
   /**
    * 标签开始
    */
   public int doStartTag() throws JspException {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      StringBuffer sb = new StringBuffer();
      sb.append(TagConstant.SCRIPT_START);
      TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
      DefaultTemplate template = new FileTemplate();
      template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
      
      Dto inDto = new BaseDto();
      inDto.put("user_province", province);
      inDto.put("user_city", city);
      List pointInfoList = g4Dao.queryForList("map.queryStationPointInfo", inDto);
      
      inDto.put("pointInfoList", pointInfoList);
      StringWriter writer = engine.mergeTemplate(template, inDto);
      log.debug("----------MapPointInfo----------");
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
      province = null;
      city = null;
      super.release();
   }

   public String getProvince() {
      return province;
   }

   public void setProvince(String province) {
      this.province = province;
   }

   public String getCity() {
      return city;
   }

   public void setCity(String city) {
      this.city = city;
   }
   
   
}
