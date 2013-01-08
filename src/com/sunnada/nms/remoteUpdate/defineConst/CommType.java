package com.sunnada.nms.remoteUpdate.defineConst;

public enum CommType {
	CT_TCP     (0x01),               //使用TCP通讯方式      
	CT_MODEOM  (0x02);               //使用猫通讯
	
	private final int value;
	private CommType(int ret){
		this.value = ret;
	}
	
	public int getVal(){
		return value;
	}
}
