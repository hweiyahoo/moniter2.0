package com.sunnada.nms.remoteUpdate;

import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

import com.sunnada.nms.remoteUpdate.defineConst.monCode;
import com.sunnada.nms.util.BitUnit;
import com.sunnada.nms.util.MapKeyDefine;
import java.text.*;


public class Global {
	
	/**
	 * 获得当前时间格式：yyyy-MM-dd HH:mm:ss:SSS
	 * @return
	 */
	static public String getNow(){
		SimpleDateFormat dm = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS");
		String msg = dm.format(new Date());
		return msg;
	}
	
	
	/**
	 * 将byte[]数组转换成十六进制的String字符串
	 * @param bArr，byte[]
	 * @return，返回十六进制的字符串
	 */
	static public String byteArrToHexStr(byte[] bArr, int avaLen){
		StringBuilder str = new StringBuilder();
		for(int i = 0; i <= avaLen - 1; i++){
			byte b = bArr[i];
			int iTmp = b;
			if (b < 0)
			 iTmp = 255 - ~b; 
			str.append(intToHex(iTmp, 2));
		}
		return str.toString();
	}
	
    /**
     * 数字转换成16进制字符串
     * @param iVal，数字
     * @return，16进制的字符串
     */
    static public String intToHex(int iVal, int digits){
    	return BitUnit.intToHex(iVal, digits);
    }
    
    /**
     * 监控参量enum变为16进制字符串
     * @param val，监控参量值
     * @return，16进制字符串
     */
    static public String mcToHexStr(monCode val){
    	return intToHex(val.getValue(), 4);
    }
    
    /**
     * string转化为int
     * @param sVal
     * @param defaultVal 转换失败后的默认值
     * @return 成功，则返回实际值，失败返回defaultVal
     */
    static public int strToIntDef(String sVal, int defaultVal){
    	int iVal = defaultVal;
    	try
		{
			iVal = Integer.parseInt(sVal);
		}catch(Exception e){}
		return iVal;
    }    
    
    /**
     * 十六进制字符串转化成int
     * @param sVal
     * @param defaultVal
     * @return
     */
    static public int hexToIntDef(String sVal, int defaultVal){
    	int iVal = defaultVal;
    	try
		{
			iVal = Integer.parseInt(sVal, 16);
		}catch(Exception e){}
		return iVal;    	
    }
    
    /**
     * 获得命令标识
     * @param record，记录
     * @return，10进制表示的命令标识号
     */
    static public int getCmdWord(Map<MapKeyDefine, Object> record){
    	return (Integer)record.get(MapKeyDefine.Map_Key_CMD_Flag);
    }


    /**
     * 获得站点编号和设备编号
     * @param record
     * @return，返回ArrayList，[0]=站点编号，[1]=设备编号
     */
    static public ArrayList<String> getCmdStation(Map<MapKeyDefine, Object> record){
    	ArrayList<String> arr = new ArrayList<String>();
    	arr.add((String)record.get(MapKeyDefine.Map_Key_Repater_Num));
    	arr.add((String)record.get(MapKeyDefine.Map_Key_Device_Num));
    	return arr;
    }
    
    /**
     * 获得命令执行结果
     * @param record，记录
     * @return，返回10进制的命令返回结果
     */
    static public int getCmdExcRslt(Map<MapKeyDefine, Object> record){
    	return (Integer)record.get(MapKeyDefine.Map_Key_Resp_Flag);
    }
}
