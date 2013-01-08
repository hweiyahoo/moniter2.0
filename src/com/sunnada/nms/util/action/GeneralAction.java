package com.sunnada.nms.util.action; 

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

/** 
 * @author 作者姓名 HuangWei
 * @version 创建时间：Jan 5, 2011 4:57:19 PM 
 * 
 * 逻辑类接口
 * 	定义了CRUD接口，统一开发。开发人员实现这个类
 */
public interface GeneralAction {
	
	/**
	 * 页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward init(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception ;

	/**
	 * 查询
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryItems(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception ;

	/**
	 * 新增
	 * 
	 * @param
	 * @return
	 */
	public ActionForward insertItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception ;

	/**
	 * 删除
	 * 
	 * @param
	 * @return
	 */
	public ActionForward deleteItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception ;

	/**
	 * 修改
	 * 
	 * @param
	 * @return
	 */
	public ActionForward updateItem(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception ;

}
