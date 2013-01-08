package com.sunnada.nms.repeaterManager.web.tag;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.ccl.util.GlobalConstants;
import org.eredlab.g4.rif.taglib.util.TagHelper;

import com.sunnada.nms.util.StringUtils;

/**
 * @author 作者姓名 HuangWei
 * @version 创建时间：Jan 10, 2011 11:23:07 AM
 * 
 * 业务字典加载 结合标签:eRedG4_AMS专用
 */
public class DeviceMntStatusInfoTag extends TagSupport {
   
   private static Log        log      = LogFactory.getLog(DeviceMntStatusInfoTag.class);
   private Map<String, List> valueMap = null;
   private String            protype;
   private String            repeaterid;
   private String            paramclass;
   private String            isautoreflesh;
   private String            invaltime;
   private String            params;
   
   /**
    * 标签开始
    */
   public int doStartTag() throws JspException {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      StringBuffer sb = new StringBuffer();
      Dto dto = new BaseDto();
      dto.put("protype", protype);
      dto.put("repeaterid", repeaterid);
      dto.put("paramclass", StringUtils.StringFormatSqlUseInParam(paramclass));
      List<Dto> beanList = g4Dao.queryForList("devicemnt.queryItemsForParam", dto);
      for (int i = 0; i < beanList.size(); i++) {
         Dto pdto = beanList.get(i);
         String key = pdto.getAsString("editorcode");
         List<Dto> list = this.memoryValueMap(key);
         if (list == null) {
            int model = pdto.getAsInteger("editormodel");
            switch (model) {
               case 1:// 本地json数据
                  list = this.jsonValueMap(key, pdto.getAsString("editorcontent"));
                  break;
               case 2:// 需要查询数据库
                  list = this.dbValueMap(key, pdto.getAsString("editorcontent"));
                  break;
            }
         }
         pdto.put("valueList", list);
      }
      
      dto.put("beanList", beanList);
      dto.put("isautoreflesh", isautoreflesh);
      if (StringUtils.isEmpty(invaltime))
         invaltime = "20";
      dto.put("invaltime", invaltime);
      if (StringUtils.isEmpty(params))
         params = "800,600";
      int cmp_w = Integer.valueOf(params.split(",")[0]);
      int cmp_h = Integer.valueOf(params.split(",")[1]);
      dto.put("cmpwidth", cmp_w);
      dto.put("cmpwidth_1", (cmp_w - 66) / 5 + 60);
      dto.put("cmpwidth_2", (cmp_w - 66) / 5 - 50);
      dto.put("cmpwidth_3", (cmp_w - 66) / 5);
      dto.put("cmpwidth_4", (cmp_w - 66) / 5 - 50);
      dto.put("cmpwidth_5", (cmp_w - 66) / 5 - 10);
      dto.put("cmpheight", cmp_h);
      
      TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
      DefaultTemplate template = new FileTemplate();
      template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
      StringWriter writer = engine.mergeTemplate(template, dto);
      log.debug("----------deviceparam----------");
      log.debug(writer.toString());
      log.debug("----------");
      sb.append(writer.toString());
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
      protype = null;
      repeaterid = null;
      paramclass = null;
      invaltime = null;
      isautoreflesh = null;
      params = null;
      super.release();
   }
   
   public void setProtype(String protype) {
      this.protype = protype;
   }
   
   public void setRepeaterid(String repeaterid) {
      this.repeaterid = repeaterid;
   }
   
   public void setParamclass(String paramclass) {
      this.paramclass = paramclass;
   }
   
   public void setIsautoreflesh(String isautoreflesh) {
      this.isautoreflesh = isautoreflesh;
   }
   
   public void setInvaltime(String invaltime) {
      this.invaltime = invaltime;
   }
   
   public void setParams(String params) {
      this.params = params;
   }
   
   private List<Dto> memoryValueMap(String key) {
      if (this.valueMap == null) {
         valueMap = new HashMap();
         return null;
      }
      else {
         return valueMap.get(key);
      }
   }
   
   private List<Dto> dbValueMap(String key, String sqlStr) {
      if (StringUtils.isEmpty(sqlStr)) {
         return null;
      }
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      Dto pDto = new BaseDto();
      pDto.put("sql", sqlStr);
      List<Dto> list = g4Dao.queryForList("devicemnt.excuteSQL", pDto);
      if (this.valueMap == null)
         valueMap = new HashMap();
      valueMap.put(key, list);
      return list;
   }
   
   private List<Dto> jsonValueMap(String key, String jsonStr) {
      List list = new ArrayList();
      if (G4Utils.isEmpty(jsonStr)) {
         return list;
      }
      jsonStr = jsonStr.substring(1, jsonStr.length() - 1);
      String[] dirtyDatas = jsonStr.split("},");
      for (int i = 0; i < dirtyDatas.length; i++) {
         if (i != dirtyDatas.length - 1) {
            dirtyDatas[i] += "}";
         }
         Dto dto = JsonHelper.parseSingleJson2Dto(dirtyDatas[i]);
         list.add(dto);
      }
      if (this.valueMap == null)
         valueMap = new HashMap();
      valueMap.put(key, list);
      return list;
   }
   
}
