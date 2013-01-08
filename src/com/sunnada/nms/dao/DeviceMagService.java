package com.sunnada.nms.dao;

import java.sql.SQLException;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.sunnada.nms.util.action.GeneralService;

/**
 * @author linxingyu
 * @version 创建时间：2011-7-22 上午10:19:40 主页面服务接口
 */
public interface DeviceMagService extends BaseService, GeneralService {
   /**
    * 获取repeaterinfo表里的所有省份
    * 
    * @return
    */
   public Dto getAllProvinces();
   
   /**
    * 根据省取下属所有地市
    * 
    * @param pDto
    *           省份id
    * @return
    */
   public Dto getCitysByPro(Dto pDto);
   
   /**
    * 根据市和parent取下位机
    * 
    * @param dto
    * @return
    */
   public Dto getRepeater(Dto dto);
   
   /**
    * 获取下位机参数
    * 
    * @param dto
    *           下位机ID,flag。flag表示查询第几类参数
    * @return
    * @throws SQLException
    */
   public Dto getParamenter(Dto dto) throws SQLException;
   
   /**
    * 获取下位机参数总数
    * 
    * @param dto
    * @return
    */
   public Dto getParamenterCount(Dto dto);
   
   /**
    * 根据协议取设备
    * 
    * @param dto
    * @return
    */
   public Dto getDeviceByProtocol(Dto dto);
   
   /**
    * 根据id取下位机信息
    */
   public Dto getInformationById(Dto dto);
   
   /**
    * 获取下位机所有信息
    */
   public Dto getAllInforamtion(Dto dto);
   
   /**
    * 获取当前省市下的主机数
    */
   public Dto getRepeaterCount(Dto dto);
   
   /**
    * 获取最后一次插入的ID
    */
   public Dto getLastID();
   
   /**
    * 获取从机个数
    */
   public Dto getSubCount(Dto dto);
   
   /**
    * 根据主机获取从机设备
    */
   public Dto getSubDevice(Dto dto);
   
   /**
    * 获取最大子机信息
    */
   public Dto getSubInfo(Dto dto);
   
   /**
    * 复制下位机
    */
   public Dto copyRepea(Dto dto);
   
   /**
    * 复制下位机参数
    */
   public Dto copyParam(Dto dto);
   
   /**
    * 删除下位机参数
    */
   public Dto deleParam(Dto dto);
   
   /**
    * 获取t_reflag
    */
   public Dto queryReflag(Dto dto);
   
   /**
    * yzz 获取连接标识
    * 
    * @param dto
    * @return
    */
   public Dto queryConnFlag(Dto dto);
   
   /**
    * yzz 实时设置与查询保存数据
    */
   public Dto updateVal1Item(Dto pDto);
   
   /**
    * yzz 实时设置之后，将返回值更新到远程值中
    */
   public Dto updateRVal1Item(Dto pDto);
   
   /**
    * 更新下位机report
    */
   public Dto updateReport(Dto pDto);
   
   /**
    * 判断是否可读监控列表
    */
   public Dto judge(Dto dto);
   
   /**
    * 更新标志位
    */
   public Dto updateFlag(Dto dto);
   
   /**
    * 获取存在的监控量
    * 
    * @throws SQLException
    */
   public Dto exit(Dto dto) throws SQLException;
   
   /**
    * 获取不存在的监控量
    * 
    * @throws SQLException
    */
   public Dto noExit(Dto dto) throws SQLException;
   
   /**
    * 获取repeaterid
    */
   public Dto queryRepeaterid(Dto dto);
   
   /**
    * 获取protype
    */
   public Dto queryProtype(Dto dto);
   
   /**
    * 获取paramclass
    */
   public Dto queryClass(Dto dto);
   
   /**
    * 刷新站点树
    */
   public Dto refreshTree(Dto dto);
   
   /**
    * 判断下位机是否可操作
    */
   public Dto isOK(Dto dto);
   
   /**
    * 更新标志位
    */
   public void updateRepFlag(Dto dto);
   
   /**
    * 新增标志位
    */
   public void addFlag(Dto dto);
   
   /**
    * 更新repeaterparam中的站点编号
    */
   public void updateStationid(Dto dto);
   
   /**
    * 更新repeaterparam中的设备编号
    */
   public void updateStatsubid(Dto dto);
   
   /**
    * 更新repeaterinfo中的站点编号,设备编号
    */
   public void updateStationAndStatsub(Dto dto);
   
   /**
    * 判断是否有重复的站点编号，设备编号
    */
   public boolean repeate(Dto dto);
   
   public void updaterepeaterinfo(Dto dto);
   
   /**
    * 更新repeaterparam中的站点电话
    */
   public void updateStatTel(Dto dto);
   
   /**
    * 导入Excel站点信息到数据库
    */
   public Dto importExcel(List fileData);
   
   /**
    * 判断是否是主机,true为主机
    */
   public boolean isHost(Dto dto);
   
   /**
    * 修改从机的站点编号
    */
   public Dto updateSub(Dto dto);
   
   /**
    * 获取错误信息
    */
   public Dto error(Dto dto);
   
   /**
    * 获取repeaterparam的信息
    */
   public Dto queryParam(Dto dto);

   
   /**
    * 重新加载设备监控量
    * 
    * @param dto
    * @return
    */
   public Dto reloadParam(Dto dto);
   
   /**
    * 删除监控量临时表
    * 
    * @param dto
    * @return
    */
   public Dto delRepeaterParamTemp(Dto dto);
   
   /**
    * 插入监控量临时表数据
    * 
    * @param dto
    * @return
    */
   public Dto insertItemTemp(Dto dto);
   
   /**
    * 获取paramcode的长度
    */
   public Dto queryDataLen(Dto dto);

}
