package com.sunnada.nms.remoteUpdate;

import java.io.BufferedInputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.ArrayList;

import com.sunnada.nms.dao.BtnConnectClickService;
import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.event.BaseEvent;
import com.sunnada.nms.event.Listener;
import com.sunnada.nms.remoteUpdate.protocol.*;
import com.sunnada.nms.remoteUpdate.timer.Schedule;
import com.sunnada.nms.remoteUpdate.defineConst.*;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import com.sunnada.nms.util.ConstDefine;
import com.sunnada.nms.util.MapKeyDefine;

public class UpdateObject {

	DeviceMagService deviceMagService = (DeviceMagService) SpringBeanLoader
			.getSpringBean("deviceMagService");

	private BtnConnectClickService btnConnectClickService = (BtnConnectClickService) SpringBeanLoader
			.getSpringBean("btnConnectClickService");

	private int m_repeaterID = 0; // 直放站ID
	private Schedule updateTmr = null; // 状态触发器
	private RuStatus status; // 当前设备的升级状态
	private String sStation = "", sSub = "";
	
	
	private Listener listener;

	/**
	 * 构造函数
	 */
	public UpdateObject(String sStationID, String sSubID) {
		// 查询到repeaterid
		m_repeaterID = this.getReapterID(sStationID, sSubID);
		sStation = sStationID;
		sSub = sSubID;

		Dto dto = new BaseDto();
		dto.put("repeaterid", m_repeaterID);
		Dto result = btnConnectClickService.queryStationInfo(dto);
		String chanelcode = result.getAsString("channelcode");
		String sPrms = ""; // 参数
		CommType ct = CommType.CT_TCP; // 通讯方式
		if ("13".equals(chanelcode)) {// TCP
			sPrms = result.getAsString("report");// 地址
		} else if ("03".equals(chanelcode)) {// modem
			sPrms = result.getAsString("stattel");// 号码
			ct = CommType.CT_MODEOM;
		}
		status = RuStatus.Status_Start;
		// 创建升级状态监视器
		updateTmr = new Schedule(1);
		updateTmr.setRepeaterID(m_repeaterID, sStationID, sSubID);
		updateTmr.setCommType(ct, sPrms);
		updateTmr.setStatus(status);
	}

	/**
	 * 删除此UpdateObject所有的定时器
	 */
	public void removeTsk() {
		if (updateTmr != null) {
			// updateTmr.stopQryTsk();
			updateTmr.stopOverResp();
			updateTmr.shutdownNow();
			updateTmr = null;
		}

	}

	public void stopUpdate() {
		if (updateTmr != null) {
			status = RuStatus.Status_Stop;
			updateTmr.setStatus(status);
		}
	}

	/**
	 * 传入从页面得到的文件路径，名称以及CRC等属性
	 * 
	 * @param sCrc，CRC字符
	 * @param sPath，文件的绝对路径
	 * @param sName，文件名
	 */
	public void updateFlPrms(String sCrc, BufferedInputStream fs) {
		updateTmr.updateFlPrms(sCrc, fs);
	}

	private Mcp m_useMCP = Mcp.MCP_A; // 使用MCP:B/A方式进行升级

	private int m_RU_EXEC_RESULT = 0; // 设备执行远程升级的结果(0：表示已经成功完成升级，1：表示设备终止软件升级，（比如硬件故障）

	// 2：表示监控管理中心取消软件升级，3：表示文件检查失败，4：表示保存文件失败，
	// 5：表示远程通信链路异常，6：表示远程通信超时，7：表示文件FTP下载超时，
	// 8：表示文件登录FTP服务器失败，9：表示正在通过FTP方式升级，17：表示其它异常中断软件升级)
	// private int m_DEV_RU_TYPE = 1;
	// //设备远程升级方式，0：表示设备无法进行远程升级。1：表示采用MCP：B方式。2：表示采用FTP方式。
	/**
	 * 根据直放站编号和设备编号，获得直放站ID
	 * 
	 * @param sStationID
	 * @param sSubID
	 * @return 直放站ID
	 */
	private int getReapterID(String sStationID, String sSubID) {
		Dto dto = new BaseDto();
		dto.put("stationid", sStationID);
		dto.put("statsubid", sSubID);
		dto = deviceMagService.queryProtype(dto);
		return dto.getAsInteger("repeaterid");
	}

	/**
	 * Record中是否包括了moncode key。
	 * 
	 * @param moncode，监控参量，string的int
	 * @param record，数据集
	 * @return 当包括时，返回true，反之，false
	 */
	private boolean includeMonCode(monCode moncode, Map<String, String> record) {
		Set sets = record.keySet();
		String sMonCode = Global.intToHex(moncode.getValue(), 4);
		return sets.contains(sMonCode);
	}

	/**
	 * 批量查询是否存在了moncode key
	 * 
	 * @param moncode，监控参量，string的int
	 * @param record，数据集
	 * @return 当包括了所有的moncode时，返回true，反之，false
	 */
	private boolean includeMonCode(ArrayList<monCode> moncodeLst,
			Map<String, String> record) {
		for (monCode val : moncodeLst) {
			if (!includeMonCode(val, record))
				return false;
		}
		return true;
	}

	/**
	 * 获得远程升级参数所需要的监控参量列表
	 * 
	 * @return ArrayList监控参量列表
	 */
	private ArrayList<monCode> getCommParams() {
		ArrayList<monCode> arr = new ArrayList<monCode>();
		arr.add(monCode.CON_MC_APC_LEN);
		arr.add(monCode.CON_MC_MCPB_BAGS);
		arr.add(monCode.CON_MC_NC);
		arr.add(monCode.CON_MC_TOT1);
		arr.add(monCode.CON_MC_TG);
		arr.add(monCode.CON_MC_TP);
		arr.add(monCode.CON_MC_WAIT_TIME);
		return arr;
	}

	/**
	 * 获得升级文件的参数，所需要的监控列表
	 * 
	 * @return 监控参数列表
	 */
	private ArrayList<monCode> getFlPrms() {
		ArrayList<monCode> arr = new ArrayList<monCode>();
		arr.add(monCode.CON_MC_FILE_CRC);
		arr.add(monCode.CON_MC_NEXT_IDX);
		arr.add(monCode.CON_MC_DATA_LEN);
		return arr;
	}

	/**
	 * 获得文件传输的参数
	 * 
	 * @return
	 */
	private ArrayList<monCode> getFlTranPrms() {
		ArrayList<monCode> arr = new ArrayList<monCode>();
		arr.add(monCode.CON_MC_PACK_RESP);
		arr.add(monCode.CON_MC_FILE_INDX);
		// arr.add(monCode.CON_MC_FILE_PACK); //返回的包中可能没有0x0305的数据。
		return arr;
	}

	private ArrayList<monCode> getUpdateRet() {
		ArrayList<monCode> arr = new ArrayList<monCode>();
		arr.add(monCode.CON_MC_RU_RPT); // 软件升级结果
		return arr;
	}

	/**
	 * 解析返回的报文
	 * 
	 * @param aBag
	 */
	public int parseBag(Map respList) throws Exception {
		if (respList == null)
			return -1;
		ConstDefine result = (ConstDefine) respList
				.get(MapKeyDefine.Map_Key_Result);
		if (!result.equals(ConstDefine.CON_RESULT_OK)) {
			printToGUI("应答错误,代码=" + Integer.toHexString((result.getVal())));
			return -1;
		}
		Object obj = respList.get(MapKeyDefine.Map_Key_DDU);
		if (obj != null) {
			Map<String, String> dduMap = (HashMap<String, String>) obj;
			int isHaveUpdateCondition = 0; // 是否具备了远程升级的条件
			int iVal = 0;
			if (!dduMap.isEmpty()) {
				// 监控软件运行模式:0x0010
				iVal = this.getMonVal(monCode.CON_MC_RUN_MODE, dduMap);
				if (iVal != -2) {
					if (iVal == -1)
						return ResultRemoteUpdate.Result_RU_ING.getValue(); // 1-监控模式
					isHaveUpdateCondition++;
				}
				// 设备使用的远程升级模式：0x0020
				iVal = this.getMonVal(monCode.CON_MC_UPDATE_TY, dduMap);
				if (iVal != -2) {
					if (iVal == -1)
						return ResultRemoteUpdate.Result_RU_NOT_UPDATE
								.getValue(); // 1-使用MCP:B方式升级
					isHaveUpdateCondition++;
				}

				// 如果isHaveUpdateCondition=2时，是满足了可以继续升级的条件，紧接着查询远程升级参数
				if (isHaveUpdateCondition == 2) {
					updateTmr.stopOverResp();
					updateTmr.setStatus(RuStatus.Status_Q_UpdateParams);
					return 0;
				}

				// 数据包括了0x0011，0x0012，0x0013，0x0014，0x0015，接收这些命令，并同时发送切换软件升级模式命令
				if (includeMonCode(getCommParams(), dduMap)) {
					updateTmr.stopOverResp();
					updateTmr.setUpdateParams(new RUpdateParams(dduMap));
					updateTmr.setStatus(RuStatus.Status_Switch_Update);
					return 0;
				}

				// 返回的数据“命令标识号”=
				// 0x03，数据包括了0x0301,0x0202,0x0203，并且执行结果为0，则，设置传输标识
				if (includeMonCode(getFlPrms(), dduMap)) {
					updateTmr.stopOverResp();
					int iFlIndx = getMonVal(monCode.CON_MC_NEXT_IDX, dduMap);
					int iFlSize = getMonVal(monCode.CON_MC_DATA_LEN, dduMap);

					if ((iFlIndx == -2) || (iFlSize == -2))
						return ResultRemoteUpdate.Result_RU_Prms_Err.getValue();
					if ((iFlIndx == -1) || (iFlSize == -1))
						return ResultRemoteUpdate.Result_RU_Prms_Err.getValue(); // 					

					updateTmr.setFileIndx(iFlIndx);
					updateTmr.setFileSize(iFlSize);
					// printToGUI(String.format("获得设备传输的文件所需要的索引[%d]文件包大小[%d]",
					// 0, iFlSize));
					printToGUI(String.format("==获得设备传输的文件所需要的索引[%d]文件包大小[%d]",
							iFlIndx, iFlSize));
					updateTmr.setStatus(RuStatus.Status_Start_TransFlg); // 设置开始传输标志
					return 0;
				}
				// 升级文件时获得文件传输的结果CON_MC_PACK_RESP=0x0303,0x0304,0x0305
				if (includeMonCode(getFlTranPrms(), dduMap)) {
					updateTmr.stopOverResp(); // 停止超时应答定时器
					iVal = getMonVal(monCode.CON_MC_PACK_RESP, dduMap);
					switch (iVal) {
					case 0: // 表示成功接收，可以继续接收后续数据包
						printToGUI("设备请求OMC发送下一个文件包");
						updateTmr.transNextFileBlock();
						// updateTmr.enable();
						break;
					case 1: // 表示请求监控管理中心重发数据包（前提，之前的包成功接收），
						// 获得0x0304的值，从此值开始作为brkindx发送
						int brkIndx = getMonVal(monCode.CON_MC_FILE_INDX,
								dduMap);
						printToGUI("设备请求OMC重发index="
								+ Integer.toString(brkIndx));
						updateTmr.setFileIndx(brkIndx);
						break;
					case 2: // 表示请求监控管理中心延时Tp后继续发送数据包（前提，此包成功接收），
						// 需要schedule那边发送文件停止TP个时间
						updateTmr.stopSndTmr();
						updateTmr.starSndTmr(-1);
						updateTmr.transNextFileBlock();
						printToGUI("设备请求OMC延时Tp后继续发送数据包");
						break;
					case 3: // 表示请求监控管理中心取消软件升级，
						printToGUI("设备请求OMC取消软件升级");
						delSattion(respList);
						return 0;
					case 4: // 表示由于文件中的厂家标识错误，设备终止软件升级，
						printToGUI("由于文件中的厂家标识错误，设备终止软件升级");
						delSattion(respList);
						return 0;
					case 5: // 表示由于文件中的设备标识错误，设备终止软件升级，
						printToGUI("由于文件中的设备标识错误，设备终止软件升级");
						delSattion(respList);
						return 0;
					case 6: // 表示由于文件中的其它错误，设备终止软件升级，
						printToGUI("由于文件中的其它错误，设备终止软件升级");
						delSattion(respList);
						return 0;
					default:
						return 0;
					}

					updateTmr.setStatus(RuStatus.Status_Start_Trans); // 设置开始传输标志
					return 0;
				}

				// 返回数据“命令标识号”=0x03，数据包括了0x0302，并且执行结果为0，详细操作，
				// 查看tc 1-文件传输开始，2-文件传输结束，3-OMC取消升级，4-升级正常结束
				iVal = getMonVal(monCode.CON_MC_TRANS_CTRL, dduMap);
				if (iVal != -2) {
					updateTmr.stopOverResp();
					if (iVal == -1)
						return ResultRemoteUpdate.Result_RU_Conrol_Err
								.getValue();
					switch (iVal) {
					case 1:
						updateTmr.setStatus(RuStatus.Status_Start_Trans); // 开始传输
						break;
					case 2:
						// 文件传输结束
						printToGUI("文件传输结束");
						updateTmr.setStatus(RuStatus.Status_END_NORMAL);
						break;
					case 3:// OMC取消升级 //3,4执行同一段代码
						printToGUI("OMC取消升级");
					case 4:// 升级正常结束
						delSattion(respList);
						if (iVal == 4) {
							printToGUI("升级正常结束");
						}
						break;
					}// end switch
					return 0;
				}

			} // end while
		}
		// 返回的数据“命令标识号”=0x10，并且执行结果为0，则进行下一步的查询设备断点命令，使用MCP:B协议
		if ((Global.getCmdWord(respList) == CmdIdentify.CI_NORMAL_SW_SOFT_MODE
				.getVal())
				&& (Global.getCmdExcRslt(respList) == 0)) {
			updateTmr.stopOverResp();
			m_useMCP = Mcp.MCP_B;
			updateTmr.setStatus(RuStatus.Status_Get_BreakPoint);
			// updateTmr.starQryTsk();
		}
		// 如果获得了0x0018(软件升级结果)，0x000A（软件版本），0x0141（软件更新上报）
		if (Global.getCmdWord(respList) == CmdIdentify.CI_NORMAL_U.getVal()) {
			printToGUI("软件更新上报");
			return 0;
		}

		// if (includeMonCode(getUpdateRet(), dduMap)) {
		// iVal = getMonVal(monCode.CON_MC_TRANS_CTRL, dduMap);
		// if (iVal != -2) {
		// if (iVal == -1)
		// return ResultRemoteUpdate.Result_RU_Conrol_Err
		// .getValue();
		// //
		// }
		// }

		return ResultRemoteUpdate.Result_RU_SUCCESS.getValue();
	}

	/**
	 * 删除某个站点updateobject对象
	 * 
	 * @param list，需要获得的站点信息列表
	 */
	private void delSattion(Map<MapKeyDefine, Object> list) {
		m_useMCP = Mcp.MCP_A;
		ArrayList<String> arr = Global.getCmdStation(list);
		String sStationID = arr.get(0);
		String sSubID = arr.get(1);
		UpdateController.getInstance().del(sStationID, sSubID);
	}

	/**
	 * 获得某个monCode值
	 * 
	 * @param mc，monCode，监控参量
	 * @param dduRecord，DDU数据集
	 * @return，-1，数据错误，-2，DDU中不存在此monCode
	 */
	private int getMonVal(monCode mc, Map<String, String> dduRecord) {
		String moncode = Global.mcToHexStr(mc);
		int iRet = -1; // 数据错误
		if (includeMonCode(mc, dduRecord)) {
			String sVal = (String) dduRecord.get(moncode);
			iRet = Global.hexToIntDef(sVal, -1);
		} else
			iRet = -2;// 此监控参量不存在
		return iRet;
	}

	/**
	 * 将日志传给界面层
	 * 
	 * @param sLog
	 */
	private void printToGUI(String sLog) {
		Log.printToGUILog(sLog, sStation, sSub);
	}

   public void setListener(Listener listener) {
      this.listener = listener;
   }
   
   public void fireEvent(BaseEvent evt){
      listener.perform(evt);
   }

}
