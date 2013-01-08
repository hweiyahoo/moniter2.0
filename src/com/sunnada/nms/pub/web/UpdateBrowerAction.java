package com.sunnada.nms.pub.web;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

/**
 * @author huangwei
 * @version 创建时间：Jul 23, 2011 1:14:15 PM
 * 
 * 浏览器下载 逻辑类
 */
public class UpdateBrowerAction extends BaseAction {
   
   private static final String BROWER_RESOURCE_PATH = "/resource/brower/";
   
   /**
    * 浏览器下载
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward downloadBrower(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto dto = aForm.getParamAsDto(request);
      String browername = dto.getAsString("browername");
      // 这里可稍做优化,根据文件类型动态设置此属性
      String filename = G4Utils.encodeChineseDownloadFileName(request, browername);
      response.setHeader("Content-Disposition", "attachment; filename=" + filename + ";");
      String path = BROWER_RESOURCE_PATH + browername;
      File file = new File(path);
      BufferedInputStream in = new BufferedInputStream(new FileInputStream(file));
      ByteArrayOutputStream out = new ByteArrayOutputStream(1024);
      byte[] temp = new byte[1024];
      int size = 0;
      while ((size = in.read(temp)) != -1) {
         out.write(temp, 0, size);
      }
      in.close();
      ServletOutputStream os = response.getOutputStream();
      os.write(out.toByteArray());
      os.flush();
      os.close();
      return mapping.findForward(null);
   }
}
