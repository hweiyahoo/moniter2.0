package com.sunnada.nms.moniterutil.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.parse.AidParser;

/** 
 * @author 杨智铮  E-mail: 278668433@qq.com 
 * @version 创建时间：Sep 13, 2011 2:31:28 PM 
 * CRC计算和ASCII与字符串的相互转换工具 
 */
public class CRCUtilAction extends BaseAction{
   /**
    * 初始化界面
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward init(ActionMapping mapping, ActionForm form,
                             HttpServletRequest request, HttpServletResponse response)
                                                                                      throws Exception {
      return mapping.findForward("CRCUtilInit");
   }
   /**
    * ascii码转成字符串
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward transformToString(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      int i,result;
      StringBuffer jsonStr = new StringBuffer();
      String transformString = "";
      String subAsciiText,json;
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      String asciiText = inDto.getAsString("asciiText");
      for(i=0;i<asciiText.length();) {
         subAsciiText = asciiText.substring(i,i+2);
         result = Integer.parseInt(subAsciiText,16);
         transformString = transformString + (char)result;
         i = i + 2;
      }
      jsonStr.append("{success:true,transformString:'");
      jsonStr.append(transformString).append("'}");
      json = jsonStr.toString();
      response.getWriter().write(json);
      return mapping.findForward(null);
   }
   /**
    * 计算CRC
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward calculateCRC(ActionMapping mapping, ActionForm form,
                                          HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
             // TODO Auto-generated method stub
             StringBuffer jsonStr = new StringBuffer();
             String CRCInvertOrder,CRCOrder,json;
             CommonActionForm aForm = (CommonActionForm) form;
             Dto inDto = aForm.getParamAsDto(request);
             String CRCString = inDto.getAsString("CRCString");
             AidParser parser=new AidParser();
             CRCInvertOrder = parser.crc(CRCString, true);
             CRCOrder = parser.highToLow(CRCInvertOrder);
             jsonStr.append("{success:true,CRCOrder:'");
             jsonStr.append(CRCOrder).append("',CRCInvertOrder:'");
             jsonStr.append(CRCInvertOrder).append("'}");
             json = jsonStr.toString();
             response.getWriter().write(json);
             return mapping.findForward(null);
          }
   
}
