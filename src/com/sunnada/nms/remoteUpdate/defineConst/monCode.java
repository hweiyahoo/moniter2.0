package com.sunnada.nms.remoteUpdate.defineConst;

public enum monCode {
	CON_MC_RUN_MODE  (0x0010),               //监控软件运行模式
	CON_MC_APC_LEN   (0x0011),               //AP:C协议最大长度
	CON_MC_MCPB_BAGS (0x0012),               //MCP:B采用的交互机制
	CON_MC_NC        (0x0013),               //连发系数
	CON_MC_TOT1      (0x0014),               //设备相应超时
	CON_MC_TG        (0x0015),               //发送间隔时间
	CON_MC_TP        (0x0016),               //暂停传输等待时间
	CON_MC_WAIT_TIME (0x0017),               //切换到升级模式，OMC需要等待时间
	CON_MC_UPDATE_RET(0x0018),               //远程升级执行结果
	CON_MC_UPDATE_TY (0x0020),               //远程升级方式
	CON_MC_FILE_CRC  (0x0301),               //MCP:B协议中的crc长度为20个字节
	CON_MC_NEXT_IDX  (0x0202),               //MCP:B协议中的下一个文件序号unit4
	CON_MC_DATA_LEN  (0x0203),               //MCP:B协议中的数据块长度unit2
	CON_MC_TRANS_CTRL(0x0302),               //MCP:B协议文件传输控制
	CON_MC_PACK_RESP (0x0303),               //MCP:B协议文件数据包应答 unit1
	CON_MC_FILE_INDX (0x0304),               //MCP:B协议文件数据块序号 unit4
	CON_MC_FILE_PACK (0x0305),               //MCP:B协议文件包
	CON_MC_RU_RPT    (0x0141);               //MCP:A协议，软件更新上报
	
	private final int value;
	private monCode(int ret){
		this.value = ret;
	}
	
	public int getValue(){
		return value;
	}
}
