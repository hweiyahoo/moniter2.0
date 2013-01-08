package com.sunnada.nms.remoteUpdate.defineConst;

/**
 * 接入层标识号
 * @author Administrator
 *AP:A,AP:B,AP:C
 */
public enum AP {
	AP_A                      (0x01),               //   
	AP_B                      (0x02),               //
	AP_C                      (0x03);               //
	
	private final int value;

	private AP(int ret){
		this.value = ret;
	}
	
	public int getVal(){
		return value;
	}
}
