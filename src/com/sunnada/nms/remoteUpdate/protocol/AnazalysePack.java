package com.sunnada.nms.remoteUpdate.protocol;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.sunnada.nms.remoteUpdate.Global;
import com.sunnada.nms.remoteUpdate.Log;
import com.sunnada.nms.remoteUpdate.defineConst.AP;
import com.sunnada.nms.remoteUpdate.defineConst.CmdIdentify;
import com.sunnada.nms.remoteUpdate.defineConst.CommType;
import com.sunnada.nms.remoteUpdate.defineConst.Mcp;
import com.sunnada.nms.remoteUpdate.defineConst.monCode;
import com.sunnada.nms.repeaterManager.web.DeviceMagAction;
import com.sunnada.nms.util.BitUnit;
import com.sunnada.nms.util.MapKeyDefine;
import com.sunnada.nms.util.StringUtils;

public class AnazalysePack  {

	/**
	 * 远程升级命令解析函数(暂时没用)
	 * 
	 * @param sBag，报文包
	 * @param mcpType，使用MCP:A或者MCP:B协议解析
	 * @return 0-成功，其他-失败
	 */
	public Map<MapKeyDefine, Object> parseBag(String sBag, Mcp mcpType) {
		Map<MapKeyDefine, Object> map = new HashMap<MapKeyDefine, Object>();
		
		return map;
	}
	
	
	/**
	 * 根据接入层获得单个包需要的最大长度
	 * @param ap，AP层协议
	 * @return，返回该包的最大长度
	 */
	private int getCmdMaxLen(AP ap){
		int iLen = 0;
		switch (ap.getVal()){
		case 1://串口
			iLen = 256;
			break;
		case 2://短信
			iLen = 140;
			break;
		case 3://TCP/IP
			iLen = 1500;
			break;
		}
		return iLen;
	}
	
	/**
	 * 获得命令的标志位，即命令头
	 * @param ap
	 * @return
	 */
	private String getBagFlg(AP ap){
		String sBagFlg = "";
		switch (ap.getVal()){
		case 1:
			sBagFlg = "7E";
			break;
		case 2:
			sBagFlg = "21";
			break;
		case 3:
			sBagFlg = "7E";
			break;
		}
		return sBagFlg;
	}

	static int iOrder = 1;
	/**
	 * 生成通迅包标识号
	 * @return，生成4位16进制的字符串
	 */
	synchronized private static String getOrderID(){
		if (iOrder >= 65535) iOrder = 1;
		iOrder++;
		return Global.intToHex(iOrder, 4);
	}
	
	// 转义操作，(5E,5D = 5E; 5E,7D = 7E)
	private int[] pressStr(int[] aMsg) {
		int iLen = aMsg.length;
		ArrayList<Integer> resultBytes = new ArrayList<Integer>();
		int i = 0;
		while (i <= iLen - 1) {
			if ((aMsg[i] == 0x5E) ||(aMsg[i] == 0x7E)) {
				int val = 0;
				if (aMsg[i] == 0x5E)
					val = 0x5D;
				else
					val = 0x7D;
				resultBytes.add(0x5E);
				resultBytes.add(val);
			} else {
				resultBytes.add(aMsg[i]);
			}
			i++;
		}
		int[] iArr = new int[resultBytes.size()];
		for (int idx = 0 ; idx <= resultBytes.size() - 1; idx++)
			iArr[idx] = resultBytes.get(idx);
		return iArr;
	}	
	
	/**
	 * 转义函数
	 * @return
	 */
	public String trnsfrrd(String sBag){
		Log.printLog("转义前=" + sBag);
		int[] byteArr = pressStr(StringUtils.charToInt(sBag.substring(2, sBag.length() - 2)));
		String sBagHead = sBag.substring(0, 2);  
		StringBuilder str = new StringBuilder(sBagHead);
		for(int i = 0; i <= byteArr.length - 1; i++)
			str.append(BitUnit.intToHex(byteArr[i], 2));
		str.append(sBagHead);		
		String sRet = str.toString();
		Log.printLog("转义后=" + sRet);
		return sRet;
	}
	
	/**
	 * 获得命令的头，即命令前9个主要标志，总长度为：13个字节，26个字符
	 * @param mcp
	 * @param ap
	 * @param sSation
	 * @param sSub
	 * @param cmd
	 * @return
	 */
	private String getCmdHead(Mcp mcp, AP ap, String sSation, String sSub, CmdIdentify cmd){
		String sBagFlg = getBagFlg(ap);
		
		StringBuilder str = new StringBuilder(sBagFlg);
		str.append(Global.intToHex(ap.getVal(), 2));//AP层标志
		str.append(Global.intToHex(1, 2));  //VP层标志
		str.append(BitUnit.highToLow(sSation));  //站点编号
		str.append(sSub); //子站点编号
		str.append(BitUnit.highToLow(getOrderID()));//通讯标识号
		str.append("80");  //VP层交互标志
		str.append(Global.intToHex(mcp.getVal(), 2));  //MCP层标志
		str.append(Global.intToHex(cmd.getVal(), 2));  //命令标识号
		str.append("FF");  //应答标志，命令下发使用FF
		return str.toString();
	}
	
	/**
	 * 获得CRC校验码
	 * @param sPack
	 * @return
	 */
	private String getCrc(String sPack){
		return BitUnit.crc(sPack, true);
	}
	
	/**
	 * 打包命令函数
	 * 
	 * @param sStaion，站点编号
	 * @param sSub，设备编号
	 * @param cmd，命令标识，0x02（查询），0x03（设置）
	 * @param codeValList，命令=值，对照表
	 * @return，打包返回的若干命令
	 */
	private ArrayList<String> packBag(String sStaion, String sSub,
			CmdIdentify cmd, Map<monCode, String> codeValList, Mcp mcp, AP ap) {
		ArrayList<String> retArr = new ArrayList<String>();
		StringBuilder packStr = new StringBuilder();
		int cmdTtlLen = getCmdMaxLen(ap);  //协议规定的命令总长度
		String strHead = getCmdHead(mcp, ap, sStaion, sSub, cmd);
		int cmdCrrntLen = 14;
		packStr.append(strHead);		
		for (monCode oKey : codeValList.keySet()){
			String sMonCode = BitUnit.highToLow(Global.intToHex(oKey.getValue(), 4));
			Log.printLog("SendCMD 打包监控参量 = " + sMonCode);
			String sVal = BitUnit.highToLow((String)codeValList.get(oKey));
			Log.printLog("SendCMD 打包监控参量值 = " + sVal);
			int iLen = getCmdFldLen(sVal, mcp);
			if ((cmdCrrntLen + iLen) >= cmdTtlLen){
				//如果大于协议规定长度，分包
				String sCrc = getCrc(packStr.toString().substring(2)); //从7E后面开始取字符串
				packStr.append(sCrc);
				packStr.append(getBagFlg(ap));
				retArr.add(trnsfrrd(packStr.toString()));
				packStr.delete(0, packStr.toString().length() - 1);
				packStr.append(strHead);
				cmdCrrntLen = 14;
				continue;
			}
			else{
				//如果小于协议规定长度，继续加入
				packStr.append(getCmdFldLenStr(sVal, mcp));  //长度
				packStr.append(sMonCode);//监控参量
				packStr.append(sVal);//参量的值
				cmdCrrntLen = cmdCrrntLen + iLen;
			}
		}
		//如果大于协议规定长度，分包
		String sCrc = getCrc(packStr.toString().substring(2)); //从7E后面开始取字符串
		packStr.append(sCrc);
		packStr.append(getBagFlg(ap));
		retArr.add(trnsfrrd(packStr.toString()));		
		return retArr;
	}
	
	/**
	 * 获得MCP模式下，监控数据长度字段的值
	 * @return
	 */
	private int getCmdFldLen(String val, Mcp mcp){
		int iLen = (mcp == Mcp.MCP_B)? 2 : 1;
		return iLen + 2 + val.length() / 2;
	}
	
	/**
	 * 获得MCP模式下，监控数据长度字段的值，此值为字符串
	 * @param val
	 * @param mcp
	 * @return
	 */
	private String getCmdFldLenStr(String val, Mcp mcp){
		int i = getCmdFldLen(val, mcp);
		int digits = (mcp == Mcp.MCP_A)? 2: 4;
		String sRet = Global.intToHex(i, digits);
		return BitUnit.highToLow(sRet);
		
	}

	/**
	 * 命令发送函数
	 * 
	 * @param repeaterID
	 *            直放站ID
	 * @param cmd
	 *            命令标识，0x02（查询），0x03（设置），0x10（切换软件升级模式）
	 * @param codeList
	 *            命令=值，对照表
	 * @return
	 */
	public int sendCMD(String sStaion, String sSub, CmdIdentify cmd,
			Map<monCode, String> codeValList, Mcp mcp, CommType ct, String ctPrms) {
				
		if ((ctPrms == null) || ("".equals(ctPrms)))
			return -1;
		AP ap = AP.AP_C;
		switch (CommType.CT_TCP.getVal()) {
		case 2: // 猫通讯
			ap = AP.AP_B;
			break;
		}
		ArrayList<String> cmdList = packBag(sStaion, sSub, cmd, codeValList,
				mcp, ap);
		boolean bSndRet = true;
		try {
			if (ap == AP.AP_B)
				DeviceMagAction.sendCmdByModem(ctPrms, cmdList);
			else if (ap == AP.AP_C){
				bSndRet = DeviceMagAction.sendCmdByTCP(sStaion, cmdList);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			Log.printLog("sendCMD()出错");
			return -1;
		}
		String sRet = "";
		if (!bSndRet)
			sRet = "站点不在线，请重新发送命令";
		else
			sRet = "发送命令：" + cmdList.toString();
		Log.printToGUILog(sRet, sStaion, sSub);
		return 0;
	}
	
	

}
