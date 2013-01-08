package com.sunnada.nms.modem2;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.app.AppInit;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;

import com.sunnada.nms.util.Constant;

/**
 * @author  
 * @version 创建时间：2011-12-9 
 * desc 猫启动
 */
public class ModemStart {   
   private static Log log = LogFactory.getLog(AppInit.class);
   private static ModemService ms;
   
   public static void start() {
      PropertiesHelper pHelper = PropertiesFactory
            .getPropertiesHelper(PropertiesFile.APP);
      String serial = pHelper.getValue("serial", Constant.MINA_N);      
      log.info("启动猫服务...");
      ms = ModemService.getModemService();
      ms.startService(serial);    
      ms.flag=true;
   }
   
   public static void stop(){
      log.info("停止猫服务...");
      ms.stopService();
   }
}
