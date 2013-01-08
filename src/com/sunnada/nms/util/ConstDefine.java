package com.sunnada.nms.util;


/**
 * @author 作者姓名 malb
 * @version 创建时间：2011.8.8
 * 
 * 解析报文后的返回值定义
 */
public enum ConstDefine {
	//
	CON_RESULT_OK (0),               //解析成功       
	CON_RESULT_FAIL (1),             //解析失败
	CON_RESULT_NO_COMPLETE_BAG (2),  //不完整的包
	CON_RESULT_EMPTY_BAG (3),        //空包
	CON_RESULT_BAG_ERR (4),          //错误的包头、包尾
	CON_RESULT_BAG_LEN_ERR (5),      //包长度不对
	CON_RESULT_DDU_LEN_ERR (6),      //DDU长度不够
	CON_RESULT_CRC_ERR (7),          //CRC校验错误
	CON_RESULT_RESP_ERR (8);         //应答标识不为00
	
	private final int value;
	private ConstDefine(int ret){
		this.value = ret;
	}
	
	public int getVal(){
		return value;
	}
}

