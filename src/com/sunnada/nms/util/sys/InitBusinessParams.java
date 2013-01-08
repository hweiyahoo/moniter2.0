package com.sunnada.nms.util.sys;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.sunnada.nms.comm.serial.SerialParameters;
import com.sunnada.nms.util.Constant;

/**
 * @author huangwei
 * @version 创建时间：Aug 11, 2011 9:15:40 AM
 * 
 * 初始化业务系统的一些系统级参数
 */
public class InitBusinessParams {
   
   private static Logger logger = Logger.getLogger(InitBusinessParams.class);
   
   public static void loadCommSerialParsms(ServletContext servletContext) {
      // 检查是否设置了通讯参数
      logger.info("-----------------------------");
      IReader g4Reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
      Dto inDto = new BaseDto();
      Dto dto = (Dto) g4Reader.queryForObject("businessparams.queryCommInfo", inDto);
      if (dto != null) {
         logger.info("加载通讯参数...");
         setBusinessParams(servletContext, dto);
      }
      else {
         logger.info("通讯参数未配置，加载失败...");
      }
   }
   
   private static SerialParameters setSerialParameters(Dto dto) {
      // String portName, int baudRate, int flowcontrolin,int flowcontrolout,
      // int databits, int stopbits, int parity
      SerialParameters sp = new SerialParameters(dto.getAsString("comport"), dto.getAsInteger("baudrate"), dto.getAsInteger("flowcontrolin"), dto.getAsInteger("flowcontrolout"), dto.getAsInteger("databits"), dto.getAsInteger("stopbits"), dto.getAsInteger("parity"));
      return sp;
   }
   
   private static void setBusinessParams(ServletContext servletContext, Dto dto) {
      BusinessParams bp = new BusinessParams();
      SerialParameters sp = setSerialParameters(dto);
      bp.setSp(sp);
      servletContext.removeAttribute(Constant.BUSINESS_PARAMS);
      servletContext.setAttribute(Constant.BUSINESS_PARAMS, bp);
   }
   
   public static void updateBusinessParamsForSp(ServletContext servletContext, Dto dto) {
      BusinessParams bp = (BusinessParams) servletContext.getAttribute(Constant.BUSINESS_PARAMS);
      SerialParameters sp = setSerialParameters(dto);
      if (bp == null) {
         bp = new BusinessParams();
      }
      bp.setSp(sp);
      servletContext.setAttribute(Constant.BUSINESS_PARAMS, bp);
   }
   
   public static void initBusinessDataFromDB() {
      logger.info("-----------------------------");
      logger.info("开始初始化业务系统相关依赖表...");
      IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
      // init Repeaterinfo
      logger.info("初始化 Repeaterinfo...");
      g4Dao.update("businessparams.updateBusinessDataForRepeaterinfo", null);
      // init Sharflag
      logger.info("初始化 Sharflag...");
      g4Dao.update("businessparams.updateBusinessDataForSharflag", null);
   }
}
