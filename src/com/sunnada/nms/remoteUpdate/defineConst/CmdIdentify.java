package com.sunnada.nms.remoteUpdate.defineConst;

public enum CmdIdentify {
	CI_NORMAL_Q                      (0x02),               //命令标识：查询      
	CI_NORMAL_S                      (0x03),               //命令标识：设置
	CI_NORMAL_SW_SOFT_MODE           (0x10),               //远程升级切换软件升级模式
	CI_NORMAL_U                      (0x01);               //主动上报
	
	private final int value;

	private CmdIdentify(int ret){
		this.value = ret;
	}
	
	public int getVal(){
		return value;
	}
}
