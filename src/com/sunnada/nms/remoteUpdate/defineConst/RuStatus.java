package com.sunnada.nms.remoteUpdate.defineConst;

public enum RuStatus {
	
	Status_Running        (0),              //正在升级状态
	Status_Start          (1),              //开始升级状态
	Status_Q_UpdateParams (2),              //查询远程升级的通信参数状态
	Status_Switch_Update  (3),              //切换到软件升级模式
	Status_Get_BreakPoint (4),              //获取设备的断点信息
	Status_Start_TransFlg (5),              //开始传输标志
	Status_Start_Trans (6),                 //开始传输文件
	Status_END_NORMAL (7),                   //传输文件正常结束
	Status_Stop (8),                        //停止升级命令
	Status_END_Trans (9);                        //停止传输
	//TC_END
	
	private final int value;
	private RuStatus(int ret){
		this.value = ret;
	}
	
	public int getValue(){
		return value;
	}
}
