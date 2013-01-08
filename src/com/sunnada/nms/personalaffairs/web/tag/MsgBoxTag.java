package com.sunnada.nms.personalaffairs.web.tag;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.vo.UserInfoVo;
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
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.WebUtils;

import com.sunnada.nms.util.sys.LoadNoticeTools;

/**
 * @author 作者姓名 HuangWei
 * @version 创建时间：Jan 10, 2011 11:23:07 AM
 * 
 * 消息盒 结合标签:eRedG4_nms专用
 */
public class MsgBoxTag extends TagSupport {
   
   private static Log log = LogFactory.getLog(MsgBoxTag.class);
   
   /**
    * 标签开始
    */
   public int doStartTag() throws JspException {
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      StringBuffer sb = new StringBuffer();
      Dto inDto = new BaseDto();
      HttpServletRequest request = (HttpServletRequest) this.pageContext.getRequest();
      UserInfoVo userInfo = WebUtils.getSessionContainer(request).getUserInfo();
      inDto.put("userid", userInfo.getUserid());
      inDto.put("deptid", userInfo.getDeptid());
      inDto.put("accept", userInfo.getAccept());
      List<Dto> noticeList = LoadNoticeTools.statsAllNoticeUnread(inDto);
      Dto dto = new BaseDto();
      dto.put("noticeList", noticeList);
      
      TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
      DefaultTemplate template = new FileTemplate();
      template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
      StringWriter writer = engine.mergeTemplate(template, dto);
      log.debug("----------msgbox----------");
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
      super.release();
      
   }
}
