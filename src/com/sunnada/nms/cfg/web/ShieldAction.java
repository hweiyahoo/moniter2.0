
package com.sunnada.nms.cfg.web; 

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sun.xml.bind.v2.runtime.unmarshaller.IntData;
import com.sunnada.nms.dao.ShieldService;
import com.sunnada.nms.util.action.GeneralAction;

/** 
 * @author linxingyu
 * @version 创建时间：2011-10-14 上午09:52:48 
 * 告警屏蔽 
 */
public class ShieldAction extends BaseAction implements GeneralAction{
   
   private ShieldService shieldService=(ShieldService)super.getService("shieldService");
   

   public ActionForward deleteItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }

   public ActionForward init(ActionMapping mapping, ActionForm form,
                             HttpServletRequest request, HttpServletResponse response)
                                                                                      throws Exception {
      return mapping.findForward("shieldView");
   }

   public ActionForward insertItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }

   public ActionForward queryItems(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      Dto result=shieldService.queryItems(inDto);
      String json=result.getAsString("json");
      write(json, response);
      return mapping.findForward(null);
   }

   public ActionForward updateItem(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward shield(ActionMapping mapping, ActionForm form,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      shieldService.shield(inDto);
      return mapping.findForward(null);
   }
   
}
