package com.sunnada.nms.remoteUpdate.defineConst;

public enum ResultRemoteUpdate {
		Result_RU_SUCCESS       (0),               //监控软件运行模式
		Result_RU_ING           (-1),              //终端正在处于升级模式下
		Result_RU_NOT_UPDATE    (-2),              //终端不支持升级
		Result_RU_Conrol_Err    (-3),              //终端不支持升级
		Result_RU_Prms_Err    (-4);              //远程升级参数错误
		
		
		private final int value;
		private ResultRemoteUpdate(int ret){
			this.value = ret;
		}
		
		public int getValue(){
			return value;
		}
}
