package com.sunnada.nms.remoteUpdate.protocol;

import java.util.Map;

import com.sunnada.nms.remoteUpdate.Global;
import com.sunnada.nms.remoteUpdate.defineConst.monCode;
import com.sunnada.nms.util.BitUnit;

public class RUpdateParams {

	public int  rup_APC_LEN;  //unit2  AP：C协议最大长度
	public int  rup_MCPB_SW;  //unit1  MCP：B交互机制
	public int  rup_NC;       //unit1  连发系数（NC）
	public int  rup_T0T1;     //unit1 单位：S 设备响应超时（TOT1）
	public int  rup_TG;       //unit2 单位：mS  发送间隔时间（Tg）（此数据在NC＞1时才有意义）
	public int  rup_TP;       //unit1 单位：S   暂停传输等待时间（Tp）
	public int  rup_WAIT_TIME;  //unit2 单位：S  监控模式－升级模式转换时间
	
	public RUpdateParams(Map<String, String> record) throws Exception{		
		rup_APC_LEN = Integer.parseInt(BitUnit.highToLow(record.get(Global.mcToHexStr(monCode.CON_MC_APC_LEN))), 16);
		rup_MCPB_SW = Integer.parseInt(record.get(Global.mcToHexStr(monCode.CON_MC_MCPB_BAGS)), 16);
		rup_NC = Integer.parseInt(record.get(Global.mcToHexStr(monCode.CON_MC_NC)), 16); 
		rup_T0T1 = Integer.parseInt(record.get(Global.mcToHexStr(monCode.CON_MC_TOT1)), 16);
		rup_TG = Integer.parseInt(BitUnit.highToLow(record.get(Global.mcToHexStr(monCode.CON_MC_TG))), 16);
		rup_TP = Integer.parseInt(record.get(Global.mcToHexStr(monCode.CON_MC_TP)), 16);
		rup_WAIT_TIME = Integer.parseInt(BitUnit.highToLow(record.get(Global.mcToHexStr(monCode.CON_MC_WAIT_TIME))), 16);
	}
}
