package com.sunnada.nms.remoteUpdate.defineConst;

public enum FileDataResp { //unit1
	FDR_OK                (0x00),               //MCP:A层      
	MCP_OK_RSEND_BAG      (0x01),               //MCP:B层
	MCP_OK_PAUSE          (0x02),               //MCP:B层
	MCP_DEVICE_CANCEL     (0x03),               //MCP:B层
	MCP_ERR_FAC_END_UPDATE(0x04),               //MCP:B层
	MCP_ERR_DEV_END_UPDATE(0x05),               //MCP:B层
	MCP_ERR_OTH_END_UPDATE(0x06);               //MCP:B层
	
	private final int value;
	private FileDataResp(int ret){
		this.value = ret;
	}
	
	public int getVal(){
		return value;
	}
}
