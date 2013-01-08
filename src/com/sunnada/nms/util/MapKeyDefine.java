package com.sunnada.nms.util;

/**
 * @author 作者姓名 malb
 * @version 创建时间：2011.8.13
 * 
 * 解析报文后的map key定义
 */

public enum MapKeyDefine {
	Map_Key_Result  (0),             //返回值       
	Map_Key_AP_Flag (1),             //AP层标志
	Map_Key_TP_Flag (2),             //TP层标志
	Map_Key_Repater_Num (3),         //站点编号
	Map_Key_Device_Num (4),          //设备编号
	Map_Key_Comm_Seq (5),            //通讯层序列号
	Map_Key_Mutual_Flag (6),         //交互标志
	Map_Key_MCP_Flag (7),            //MCP层协议标识
	Map_Key_CMD_Flag (8),            //命令标识
	Map_Key_Resp_Flag (9),           //命令应答标识
	Map_Key_DDU (10),                //DDU数据
	Map_Key_CRC (11),                //CRC校验值
	Map_Key_Count (12),             //如果是读监控列表，则放查询总数，如果不是则不存在此值 
	Map_Key_Num (13),               //如果是读监控列表，则放当前查询次数，如果不是则不存在此值
	Map_Alarm_Flag (14);            //告警标识
	
	private final int value;
	private MapKeyDefine(int ret){
		this.value = ret;
	}	
}
