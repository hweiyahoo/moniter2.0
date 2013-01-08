package com.sunnada.nms.util.action; 

import java.sql.SQLException;

import org.eredlab.g4.ccl.datastructure.Dto;

/** 
 * @author 作者姓名 HuangWei
 * @version 创建时间：Jan 5, 2011 5:03:06 PM 
 * 
 * 服务类接口，定义了CRUD的方法，开发人一样统一继承或实现这个接口。
 */
public interface GeneralService {
	/**
	 * 查询
	 * @param pDto
	 * @return
	 * @throws SQLException 
	 */
	public Dto queryItems(Dto pDto) throws SQLException;
	
	/**
	 * 新增
	 * @param pDto
	 * @return
	 */
	public Dto insertItem(Dto pDto);
	
	/**
	 * 删除
	 * @param pDto
	 * @return
	 */
	public Dto deleteItem(Dto pDto);
	
	/**
	 * 修改
	 * @param pDto
	 * @return
	 */
	public Dto updateItem(Dto pDto);
}
