package com.sunnada.nms.remoteUpdate.defineConst;

public enum ConstRemoteUpdate {
	RU_Key_NO_UPDATE  (0),            //不能进行远程升级       
	RU_Key_USE_MCP_B (1),             //使用MCP:B协议进行远程升级
	RU_Key_USE_FTP (2);               //使用FTP方式进行远程升级
	
	private final int value;
	private ConstRemoteUpdate(int ret){
		this.value = ret;	
	}	
}
