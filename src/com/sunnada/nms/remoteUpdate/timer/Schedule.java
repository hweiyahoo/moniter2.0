package com.sunnada.nms.remoteUpdate.timer;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.*;

import com.sunnada.nms.remoteUpdate.Global;
import com.sunnada.nms.remoteUpdate.Log;
import com.sunnada.nms.remoteUpdate.UpdateController;
import com.sunnada.nms.remoteUpdate.defineConst.*;
import com.sunnada.nms.remoteUpdate.protocol.*;
import com.sunnada.nms.util.BitUnit;

public class Schedule extends ScheduledThreadPoolExecutor {

	private UpdateTask m_cyc_task; // 主定时器，负责轮询升级状态，发送相应的命令
	private DlyTimeSnd m_Snd_task; // 延迟发送文件定时器
	private OverTimeResp m_Ovr_Rsp_task; // 超时应答定时器

	private ScheduledFuture<?> m_f_cyc_task;
	private ScheduledFuture<?> m_f_Snd_task;
	private ScheduledFuture<?> m_f_Ovr_Rsp_task;

	// 状态
	private RuStatus m_status;
	// 在某种状态下，是否执行操作
	private boolean m_exec = false;
	// 在某种状态下，某个命令执行的次数
	private int m_exec_tms = 0;
	// 命令重发次数
	final private int m_reSnd = 3;

	// private int m_repeaterID;
	private String m_SationID;
	private String m_DevID;
	private CommType m_ct; // 当前通讯方式
	private String m_ct_prms; // 当前通讯方式所需参数

	// 查询远程升级参数
	private int m_RU_APC_LEN = 1500; // AP:C协议最大长度
	private int m_RU_SW = 0; // MCP:B采用的交互机制（0-每帧确认，1-多问一答）
	private int m_NC = 1; // NC，连发系数
	private int m_TOT1 = -1; // TOT1，设备相应超时，单位S
	private int m_TG = 1; // TG，发送间隔时间（此数据在NC＞1时才有意义）单位为mS
	private int m_TP = 0; // 暂停传输等待时间（TP）单位为S
	private int m_SW_WAITTIME = 0; // 转换到软件升级模式时，OMC需要等待的时间，单位为S，当该值为0时，表示无需等待。
	//

	// 发送文件
	private String m_Crc; // 文件CRC校验码
	//private BufferedInputStream m_File; // 文件字节流
	private int m_File_Ln; // 文件长度
	private int m_Brk_Indx; // 终端返回的文件断点索引号
	private int m_File_Block_size; // 文件块大小
	private StringBuilder m_File_Str = new StringBuilder();

	//

	/**
	 * 构造函数
	 * 
	 * @param corePoolSize，最小任务池大小
	 */
	public Schedule(int corePoolSize) {
		super(corePoolSize);
		// TODO Auto-generated constructor stub
		this.crtCycTsk();
	}

	/**
	 * 打印log
	 * 
	 * @param sLog
	 */
	public void printLog(String sLog) {
		Log.printToGUILog(sLog, m_SationID, m_DevID);
	}

	/**
	 * 退出升级
	 */
	private void exitUpdate() {
		printLog(String.format("站点%s %s退出升级", m_SationID, m_DevID));
		UpdateController.getInstance().del(m_SationID, m_DevID);
	}

	/**
	 * 传入从页面得到的文件路径，名称以及CRC等属性
	 * 
	 * @param sCrc，CRC字符
	 * @param sPath，文件的绝对路径
	 * @param sName，文件名
	 */
	public void updateFlPrms(String sCrc, BufferedInputStream fs) {
		m_Crc = sCrc;
		int iLen = 0;
		try {
			iLen = fs.available();
			byte[] buff = new byte[iLen];
			int iRet = fs.read(buff);
			if (iRet > -1)
				m_File_Str.append(Global.byteArrToHexStr(buff, iRet));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 发送次数加1
	 */
	private void addTms() {
		m_exec_tms++;
	}

	/**
	 * 重置发送次数
	 */
	private void resetTms() {
		m_exec_tms = 0;
	}

	/**
	 * 获得发送次数
	 * 
	 * @return
	 */
	private int getTms() {
		return m_exec_tms;
	}

	/**
	 * 循环状态定时器启动
	 */
	private void crtCycTsk() {
		Log.printLog("[循环状态定时器]启动");
		if (m_cyc_task == null)
			m_cyc_task = new UpdateTask();
		this.addTaskCyc(m_cyc_task, 20);
	}

	/**
	 * 将主循环的定时器时间改变为"切换升级状态需要等待时间"
	 * 
	 * @return，如果成功返回true，反之，返回false
	 */
	// private boolean changeCrtCycBySw(){
	// int millSec = m_SW_WAITTIME;
	// Log.printLog(String.format("[循环状态定时器]改变执行间隔时间为：[%d]", millSec));
	// if (m_cyc_task == null)
	// return false;
	// else{
	// //
	// }
	// }
	// /**
	// * 查询断点定时器启动
	// * @param spanTp
	// */
	// public void starQryTsk() {
	// Log.printLog("[查询断点定时器]启动");
	// if (m_Qry_Break == null) {
	// m_Qry_Break = new QryBrk();
	// m_f_Qry_Break = addTaskDly(m_cyc_task, m_SW_WAITTIME);
	// }
	// }
	//
	// /**
	// * 停止查询断点定时器
	// */
	// public void stopQryTsk(){
	// Log.printLog("停止[查询断点定时器]");
	// if (m_f_Qry_Break != null){
	// m_f_Qry_Break.cancel(true);
	// remove(m_Qry_Break);
	// m_f_Qry_Break = null;
	// }
	// purge();
	// }
	/**
	 * 增加第一次延迟执行任务，以后间隔执行。
	 * 
	 * @param command，任务
	 * @param delay，第一次延迟时间，毫秒
	 * @param span，以后间隔执行时间，毫秒
	 */
	private ScheduledFuture<?> addTaskDlyExeCyc(Runnable command, int delay,
			int span) {
		return scheduleWithFixedDelay(command, delay, span,
				TimeUnit.MILLISECONDS);
	}

	/**
	 * 增加延迟执行任务，执行一次
	 * 
	 * @param command，任务
	 * @param delay，延迟多少毫秒，以及每隔多少秒执行
	 */
	private ScheduledFuture<?> addTaskDly(Runnable command, int delay) {
		return schedule(command, delay, TimeUnit.MILLISECONDS);
	}

	/**
	 * 增加立即执行任务，执行一次
	 * 
	 * @param command，任务
	 */
	// private void addTaskImmdtly(Runnable command) {
	// schedule(command, 0, TimeUnit.MILLISECONDS);
	// }
	/**
	 * 增加循环执行任务，一直执行
	 * 
	 * @param command，任务
	 * @param spanTime，间隔时间，单位毫秒
	 */
	private ScheduledFuture<?> addTaskCyc(Runnable command, int spanTime) {
		return scheduleWithFixedDelay(command, 0, spanTime,
				TimeUnit.MILLISECONDS);
	}

	/**
	 * 设置定时器状态
	 * 
	 * @param status，状态值
	 */
	public void setStatus(RuStatus status) {
		m_status = status;
		enable();
	}

	/**
	 * 设置通讯方式
	 */
	public void setCommType(CommType ty, String prms) {
		m_ct = ty;
		m_ct_prms = prms;
	}

	/**
	 * 设置直放站ID
	 * 
	 * @param repeaterID
	 */
	public void setRepeaterID(int repeaterID, String sRep, String sDevID) {
		// m_repeaterID = repeaterID;
		m_SationID = sRep;
		m_DevID = sDevID;
	}

	/**
	 * 设置远程升级参数
	 * 
	 * @param params，参数值
	 */
	public void setUpdateParams(RUpdateParams params) {
		m_RU_APC_LEN = params.rup_APC_LEN; // AP:C协议最大长度
		m_RU_SW = params.rup_MCPB_SW; // MCP:B采用的交互机制（0-每帧确认，1-多问一答）
		m_NC = params.rup_NC; // NC，连发系数
		m_TOT1 = params.rup_T0T1 * 1000; // TOT1，设备相应超时，单位S
		m_TG = params.rup_TG; // TG，发送间隔时间（此数据在NC＞1时才有意义）单位为mS
		m_TP = params.rup_TP * 1000; // 暂停传输等待时间（TP）单位为S
		m_SW_WAITTIME = params.rup_WAIT_TIME * 1000; // 转换到软件升级模式时，OMC需要等待的时间，单位为S，当该值为0时，表示无需等待。
	}

	/**
	 * 根据终端传回值，设置升级文件的当前文件索引
	 * 
	 * @param iFlIndx
	 */
	public void setFileIndx(int iFlIndx) {
		m_Brk_Indx = (iFlIndx > this.m_File_Str.length()) ? 0: iFlIndx; 
	}

	/**
	 * 设置终端返回的，文件块大小
	 * 
	 * @param iFlSize
	 */
	public void setFileSize(int iFlSize) {
		m_File_Block_size = iFlSize;
	}

	/**
	 * 启动延迟发送命令定时器
	 * 
	 * @param delay，延迟多少毫秒执行
	 */
	public void starSndTmr(int delay) {
		printLog("启动[延迟发送命令定时器]");
		if (delay <= 0)
			delay = m_TP;
		m_Snd_task = new DlyTimeSnd();
		this.addTaskDly(m_Snd_task, delay);
	}

	/**
	 * 停止延迟发送命令定时器
	 */
	public void stopSndTmr() {
		printLog("停止[延迟发送命令定时器]");
		this.remove(m_Snd_task);
	}

	/**
	 * 进行下一个文件块的传输
	 */
	public void transNextFileBlock() {
		if (m_RU_SW == 1) //如果是多问一答
			m_Brk_Indx = m_Brk_Indx + m_NC;
		else
			m_Brk_Indx++;
		printLog("transNextFileBlock fileIndex = " + Integer.toString(m_Brk_Indx));

	}

	/**
	 * 定时器继续执行
	 */
	public void enable() {
		m_exec = true;
	}

	/**
	 * 停止定时器执行
	 */
	public void disable() {
		m_exec = false;
	}

	/**
	 * 启动超时应答定时器
	 */
	public void starOverResp() {
		printLog("启动[超时应答定时器]");
		// 11秒执行一次，可以理解为11秒如果命令无返回就算超时，当进行发送文件指令时，间隔改为此
		int spn = (m_status != RuStatus.Status_Start_Trans) ? 1000 * 11
				: m_TOT1;
		if (spn <= 0)
			spn = 1000 * 60;
		if (m_Ovr_Rsp_task == null) {
			m_Ovr_Rsp_task = new OverTimeResp();
			m_f_Ovr_Rsp_task = addTaskDlyExeCyc(m_Ovr_Rsp_task, spn, spn);
		}
		// 当进行启动发送定时器时，表示已经发送一条命令
		addTms();
	}

	/**
	 * 停止超时应答定时器
	 */
	public void stopOverResp() {
		printLog("停止[超时应答定时器]");
		// 当停止发送定时器时，表示接受到一条命令
		if (m_f_Ovr_Rsp_task != null) {
			m_f_Ovr_Rsp_task.cancel(true);
			remove(m_Ovr_Rsp_task);
			m_Ovr_Rsp_task = null;
		}
		purge();
		resetTms();
	}

	/**
	 * 接收超时定时器
	 */
	class OverTimeResp implements Runnable {

		public void run() {
			int iTm = getTms();
			if (iTm >= 3) {
				// 如果重发了3都没有回应
				// stopOverResp();
				// 退出升级
				exitUpdate();
			} else {
				enable(); // 打开执行，开始重发
				printLog(String.format("发送次数 = %d", iTm));
			}
		}
	}

	// 延迟发送定时器
	class DlyTimeSnd implements Runnable {

		public void run() {
			// TODO Auto-generated method stub
			enable();
		}
	}

	// // 执行查询断点定时器，执行一次，就消失
	// class QryBrk implements Runnable {
	// private Map<monCode, String> s_cmdList = new TreeMap<monCode, String>();
	// // 命令发送列表
	//
	// private boolean brk = false;
	//		
	// private void brkEnable(){
	// brk = true;
	// }
	//		
	// private void brkDisable(){
	// brk = false;
	// }
	//		
	// private void disableMain(){
	// disable();
	// }
	//		
	// /**
	// * 补充CRC到16个字节，32个字符
	// * @param sCrc，原CRC校验
	// * @return
	// */
	// private String fillCrcMCPB(String sCrc){
	// StringBuilder str = new StringBuilder(sCrc);
	// for (int i = 1; i <= 14; i++)
	// str.append("00");
	// Log.printLog("CRC = " + str.toString());
	// return str.toString();
	// }
	//		
	// /**
	// * 查询断点信息（使用03设置命令下发）
	// */
	// private void queryBrkPnt() {
	// if (!brk) return;
	// disableMain();
	// brkDisable();
	//			
	// s_cmdList.clear();
	// s_cmdList.put(monCode.CON_MC_FILE_CRC, fillCrcMCPB(m_Crc));
	// s_cmdList.put(monCode.CON_MC_NEXT_IDX, "00000000");
	// s_cmdList.put(monCode.CON_MC_DATA_LEN, "0000");
	// Log.printLog("queryBrkPnt使用MCP：B协议下发[查询断点 0x0301,0x0202,0x0203命令]");
	// new AnazalysePack().sendCMD(m_SationID, m_DevID, CmdIdentify.CI_NORAML_S,
	// s_cmdList, Mcp.MCP_B, m_ct, m_ct_prms);
	// starOverResp();
	// }
	//
	// public void run() {
	// // TODO Auto-generated method stub
	// queryBrkPnt();
	// stopQryTsk();
	// }
	//
	// }

	// 计划任务运行类
	class UpdateTask implements Runnable {

		private Map<monCode, String> m_cmdList = new TreeMap<monCode, String>(); // 命令发送列表

		/**
		 * 查询设备使用的远程通讯方式,发送0x0010,0x0020
		 */
		private void queryCommType() {
			disable();
			m_cmdList.clear();
			m_cmdList.put(monCode.CON_MC_RUN_MODE, "00");
			m_cmdList.put(monCode.CON_MC_UPDATE_TY, "00");
			Log
					.printLog("queryCommType使用MCP：A协议下发[ 查询设备使用的远程通讯方式 0x0010,0x0020命令]");
			new AnazalysePack().sendCMD(m_SationID, m_DevID,
					CmdIdentify.CI_NORMAL_Q, m_cmdList, Mcp.MCP_A, m_ct,
					m_ct_prms);
			starOverResp();
		};

		/**
		 * 查询远程升级使用的参数，发送0x0011,0x0012,0x0013,0x0014,0x0015,0x0016,0x0017查询
		 */
		private void queryUpdateParams() {
			disable();
			m_cmdList.clear();
			m_cmdList.put(monCode.CON_MC_APC_LEN, "0000");
			m_cmdList.put(monCode.CON_MC_MCPB_BAGS, "00");
			m_cmdList.put(monCode.CON_MC_NC, "00");
			m_cmdList.put(monCode.CON_MC_TOT1, "00");
			m_cmdList.put(monCode.CON_MC_TG, "0000");
			m_cmdList.put(monCode.CON_MC_TP, "00");
			m_cmdList.put(monCode.CON_MC_WAIT_TIME, "0000");
			Log
					.printLog("queryUpdateParams使用MCP：A协议下发[ 远程升级参数 0x0011,0x0012,0x0013,0x0014,0x0015,0x0016,0x0017命令]");
			new AnazalysePack().sendCMD(m_SationID, m_DevID,
					CmdIdentify.CI_NORMAL_Q, m_cmdList, Mcp.MCP_A, m_ct,
					m_ct_prms);
			starOverResp();
		}

		/**
		 * 切换到软件升级模式
		 */
		private void switchSoftUpdateMode() {
			disable();
			m_cmdList.clear();
			Log.printLog("switchSoftUpdateMode使用MCP：A协议下发[ 切换到软件升级模式 命令]");
			new AnazalysePack().sendCMD(m_SationID, m_DevID,
					CmdIdentify.CI_NORMAL_SW_SOFT_MODE, m_cmdList, Mcp.MCP_A,
					m_ct, m_ct_prms);
			starOverResp();
		}

		/**
		 * 补充CRC到16个字节，32个字符
		 * 
		 * @param sCrc，原CRC校验
		 * @return
		 */
		private String fillCrcMCPB(String sCrc) {
			String s = BitUnit.highToLow(sCrc); 
			StringBuilder str = new StringBuilder(s);
			for (int i = 1; i <= 18; i++)
				str.append("00");
			Log.printLog("CRC = " + str.toString());
			return str.toString();
		}

		/**
		 * 查询断点信息（使用03设置命令下发）
		 */
		private void queryBrkPnt() {
			disable();
			m_cmdList.clear();
			m_cmdList.put(monCode.CON_MC_FILE_CRC, fillCrcMCPB(m_Crc));
			m_cmdList.put(monCode.CON_MC_NEXT_IDX, "00000000");
			m_cmdList.put(monCode.CON_MC_DATA_LEN, "0000");
			Log.printLog("queryBrkPnt使用MCP：B协议下发[查询断点 0x0301,0x0202,0x0203命令]");
			new AnazalysePack().sendCMD(m_SationID, m_DevID,
					CmdIdentify.CI_NORMAL_S, m_cmdList, Mcp.MCP_B, m_ct,
					m_ct_prms);
			starOverResp();
		}

		/**
		 * 传输控制命令
		 * 
		 * @param tc
		 *            1-文件传输开始，2-文件传输结束，3-OMC取消升级，4-升级正常结束
		 */
		private void transFileCntrl(TransControl tc) {
			disable();
			m_cmdList.clear();
			String sCmd = tc.getHexStr();
			m_cmdList.put(monCode.CON_MC_TRANS_CTRL, sCmd);
			Log.printLog("transFileCntrl使用MCP：B协议下发[ 传输控制 " + sCmd + " 命令]");
			new AnazalysePack().sendCMD(m_SationID, m_DevID,
					CmdIdentify.CI_NORMAL_S, m_cmdList, Mcp.MCP_B, m_ct,
					m_ct_prms);
			starOverResp();
		}

		/**
		 * 获得unit4的十六进制字符串
		 * 
		 * @param i
		 * @return
		 */
		private String getUnit4(int i) {
			String tmp = BitUnit.intToHex(i, 8);
			return tmp;
		}

		/**
		 * 获得文件string
		 * 
		 * @param idx，文件块索引号
		 * @param iFileSize，每块文件块长度
		 * @return
		 */
		private String getFileStr(int idx, int iFileBlockSize) {
			int iLen = m_File_Str.length();
			if (iLen < (idx * iFileBlockSize * 2))
				return "";
			if (iFileBlockSize > 1500) iFileBlockSize = 1024;
			String sRet;
			if (((iFileBlockSize + idx * iFileBlockSize) * 2  - 1) > iLen)
				sRet = m_File_Str.substring(idx * iFileBlockSize * 2);
			else
				sRet = m_File_Str.substring(idx * iFileBlockSize * 2, (iFileBlockSize + idx * iFileBlockSize) * 2);
			
			return sRet;
				//int iRet = m_File.read(buff, idx * iFileSize, iFileSize);
				
		}

		/**
		 * 发送文件命令
		 * 
		 * @param iFileIndx
		 * @param iFileSize
		 */
		private void sendFilePack(int iFileIndx, int iFileBlockSize) {
			disable();
			m_cmdList.clear();
			//String sFileIndx = BitUnit.highToLow(getUnit4(iFileIndx));
			String sFileIndx = getUnit4(iFileIndx);
			m_cmdList.put(monCode.CON_MC_PACK_RESP, "00");
			m_cmdList.put(monCode.CON_MC_FILE_INDX, sFileIndx);
			m_cmdList.put(monCode.CON_MC_FILE_PACK, getFileStr(iFileIndx,
					iFileBlockSize));
			Log.printLog("sendFilePack使用MCP：B协议下发[ 发送文件 " + sFileIndx + " 命令]");
			new AnazalysePack().sendCMD(m_SationID, m_DevID,
					CmdIdentify.CI_NORMAL_S, m_cmdList, Mcp.MCP_B, m_ct,
					m_ct_prms);
		}

		/**
		 * 获得文件的包数
		 * @return，如果不足1包（800个字节），就按照一包来计算
		 */
		private int getFileTotalIdx(){
			int iLen =  m_File_Str.length() / 2;
			int idx = iLen / m_File_Block_size;
			if (iLen % m_File_Block_size != 0) idx++; 
			return idx;
		}
		
		/**
		 * 使用NC发送文件，
		 */
		private void sndFile() {
			int iTotal = getFileTotalIdx();
			if (m_Brk_Indx >= iTotal){
				m_status = RuStatus.Status_END_Trans;  //结束传输
				printLog("结束文件传输");
				return;
			}
			
			for (int i = 1; i <= m_NC; i++) {
				int idx = i - 1 + m_Brk_Indx;
				sendFilePack(idx, m_File_Block_size);
				printLog(String.format("文件开始传输序号：index=%d,总包数=[%d]", idx, iTotal));
				if (m_NC > 1) {
					printLog(String.format("暂停文件发送：TG[%d]个时间", m_TG));
					sleep(m_TG);
				}
			}
			starOverResp();
		}

		private void sleep(int slpTm) {
			try {
				Thread.sleep(slpTm);
			} catch (Exception ex) {
			}
		}

		/**
		 * 循环检测目前升级状态
		 */
		private void checkStatus() {
			if (!m_exec)
				return;
			switch (m_status) {
			case Status_Running: // 空闲状态
				break;
			case Status_Start:// 开始升级状态
				queryCommType();
				break;
			case Status_Q_UpdateParams:// 查询远程升级的通信参数状态
				queryUpdateParams();
				break;
			case Status_Switch_Update:// 切换到软件升级模式
				switchSoftUpdateMode();
				break;
			case Status_Get_BreakPoint: // 查询升级断点信息
				printLog(String.format("开始 [查询升级断点信息]，需要等待时间[%d]毫秒",
						m_SW_WAITTIME));
				sleep(m_SW_WAITTIME); // OMC等待m_SW_WAITTIME秒钟后，进入升级模式，使用MCP:B协议。
				queryBrkPnt();
				break;
			case Status_Start_TransFlg: // 发送开始传输命令
				transFileCntrl(TransControl.TC_STAR);
				break;
			case Status_Start_Trans: // 开始发送文件
				printLog("开始发送文件");
				sndFile();
				break;
			case Status_END_Trans: //文件传输结束
				transFileCntrl(TransControl.TC_END);
				break;
			case Status_END_NORMAL: // 文件传输正常结束
				transFileCntrl(TransControl.TC_UPDATE_END);
				break;
			case Status_Stop:  //停止升级
				transFileCntrl(TransControl.TC_OMC_CANCEL);
				break;
			default:
				break;
			}
		}

		/**
		 * 运行函数，循环检测目前的升级状态
		 */
		public void run() {
			// TODO Auto-generated method stub
			// Log.printLog("运行函数，循环检测目前的升级状态");
			checkStatus();
		}

	}

	public static void main(String[] args) {

	}
}
