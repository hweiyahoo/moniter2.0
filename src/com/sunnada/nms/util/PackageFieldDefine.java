package com.sunnada.nms.util;



public final class PackageFieldDefine {
	public static byte CON_BAG = 0x7E;              //包头
	public static int CON_TP_A = 0x01;
    public static int CON_TP_B = 0x02;
	public static int CON_TP_C = 0x03;
	
	public static int CON_BODY_AP = 0;              //ap层代码，1个字节
	public static int CON_BODY_TP = 1;              //TP层代码，1个字节
	public static int CON_BODY_Addr_Code = 2;       //站点编号，4个字节
	public static int CON_BODY_Addr_Device = 6;     //设备编号，1个字节
	public static int CON_BODY_Net_Flag = 7;        //通讯层序列号，2个字节
	public static int CON_BODY_Alter = 9;           //VP层交互标志，80（下行一般为80），00（上行一般为00，即Resp），1个字节
	public static int CON_BODY_MCP_FLAG = 10;       //MCP层标志，1个字节
	public static int CON_BODY_COMMAND = 11;        //命令标识，1个字节
	public static int CON_BODY_RESP_FLAG = 12;      //应答标识，1个字节
	public static int CON_BODY_DATA_LEN = 13;       //监控数据长度，1个字节
}
