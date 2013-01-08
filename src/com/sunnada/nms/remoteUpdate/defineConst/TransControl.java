package com.sunnada.nms.remoteUpdate.defineConst;

import com.sunnada.nms.remoteUpdate.Global;

public enum TransControl {
	
	TC_STAR         (1),              //传输开始
	TC_END          (2),              //传输结束
	TC_OMC_CANCEL   (3),              //OMC取消升级
	TC_UPDATE_END   (4);              //升级正常结束
	
	private final int value;
	private TransControl(int ret){
		this.value = ret;
	}
	
	public int getValue(){
		return value;
	}
	
	public String getHexStr(){
		return Global.intToHex(value, 2);
	}
}
