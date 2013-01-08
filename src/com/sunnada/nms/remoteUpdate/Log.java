package com.sunnada.nms.remoteUpdate;

import org.apache.log4j.Logger;

import com.sunnada.nms.util.sys.DMParamPush;

public class Log {
	
	private static Logger   logger          = Logger.getLogger(Log.class);

	static public void printToGUILog(String sLog, String sStaionID, String sSubID) {

		sLog = String.format("%s 远程升级log：%s", Global.getNow(), sLog);
		printLog(sLog);
		DMParamPush.getInstance().updateLogPanel(sStaionID, sSubID, sLog);
	}

	static public void printLog(String sLog) {
		sLog = String.format("%s 远程升级log：%s", Global.getNow(), sLog);
		logger.info(Global.getNow()+" 远程升级log: " + sLog);
	}
}
