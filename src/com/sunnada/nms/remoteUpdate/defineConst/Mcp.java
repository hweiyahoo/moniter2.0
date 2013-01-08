package com.sunnada.nms.remoteUpdate.defineConst;

public enum Mcp {
	MCP_A  (0x01),               //MCP:A层      
	MCP_B  (0x02);               //MCP:B层
	
	private final int value;
	private Mcp(int ret){
		this.value = ret;
	}
	
	public int getVal(){
		return value;
	}
}

	
