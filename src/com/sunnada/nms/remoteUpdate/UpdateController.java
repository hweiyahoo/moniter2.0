package com.sunnada.nms.remoteUpdate;

import java.util.HashMap;
import java.util.Map;

public class UpdateController {

	/**
	 * @param args
	 */
/*	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}*/
	private static UpdateController controller = null;
	
	/**
	 * 构造函数
	 */
	public UpdateController(){}
	
	/**
	 * 静态工厂方法，返回此类的唯一实例
	 * @return
	 */
	synchronized public static UpdateController getInstance(){
		if (controller == null){
			controller = new UpdateController();
		}
		return controller;
	}
	
	
	private Map<String, Object> repeaterList;  //正在升级的直放站列表
		
	
	/**
	 * 增加正在升级的直放站
	 * @param sStationID 直放站ID
	 * @param sSubID 设备名称
	 */
	synchronized public void add(String sStationID, String sSubID){
		if (repeaterList == null){
			repeaterList = new HashMap<String, Object>();
		}
		repeaterList.put(this.format(sStationID, sSubID), new UpdateObject(sStationID, sSubID));
		Log.printToGUILog(String.format("map加入站点[%s]", format(sStationID, sSubID)), sStationID, sSubID);
	}
	
	/**
	 * 删除正在升级的直放站
	 * @param sStationID 直放站ID
	 * @param sSubID 设备名称
	 */
	synchronized public void del(String sStationID, String sSubID){
		if (repeaterList != null){
			UpdateObject obj = get(sStationID, sSubID);
			if (obj != null) {
				obj.removeTsk();
				obj = null;
			}
			repeaterList.remove(format(sStationID, sSubID));
			Log.printToGUILog(String.format("map删除站点[%s]", format(sStationID, sSubID)), sStationID, sSubID);
		}
	}
	
	/**
	 * 返回正在升级的直放站Object
	 * @param sStationID 直放站ID
	 * @param sSubID 设备名称
	 */
	synchronized public UpdateObject get(String sStationID, String sSubID){
		if (repeaterList != null){
			return (UpdateObject)repeaterList.get(this.format(sStationID, sSubID));
		}
		return null;
	}
	
	/**
	 * @param sStationID 直放站ID
	 * @param sSubID 设备名称
	 * @return 
	 */
	private String format(String sStationID, String sSubID){
		return String.format("%s/%s", sStationID, sSubID);
	}
	
	/**
	 * @param sStationID 直放站ID
	 * @param sSubID 设备名称
	 * @return 如果在升级列表中，则返回true，反之，false
	 */
	private boolean isExsits(String sStationID, String sSubID){
		if (repeaterList == null) return false;
		if (repeaterList.get(this.format(sStationID, sSubID)) == null)
			return false;
		else
			return true;
	}
	
	/**
	 * 设置某个站点的接收数据
	 * @param sStationID
	 * @param sSubID
	 * @param resultMp
	 * @return，如果存在此直放站处于升级状态，返回true，否则返回false
	 */
	synchronized public boolean addBags(String sStationID, String sSubID, Map resultMp){
		boolean b = isExsits(sStationID, sSubID);
		if (b){
			UpdateObject obj = get(sStationID, sSubID);
			try{
				if (obj != null){
					obj.parseBag(resultMp);
				}
				else{
					Log.printLog("= addBags obj is null");
					return false;
					}
			}
			catch(Exception ex){
				ex.printStackTrace();
				Log.printLog("addBags 错误");
			}
		}
		return b;
	}
	
}
