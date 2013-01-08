package com.sunnada.nms.util.schedule;

import java.util.List;

import org.apache.log4j.Logger;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;

/**
 * @author linxingyu
 * @version 创建时间：2011-9-21 下午03:12:30 执行轮询
 */
public class JobForPoll implements Job {
   private static Logger logger = Logger.getLogger(JobForPoll.class);
   String aString = null;
   public JobForPoll() {
   }
   
   /**
    * 根据轮询策略发送查询命令
    */
   public void execute(JobExecutionContext context) throws JobExecutionException {
      
      JobKey jobKey = context.getJobDetail().getKey();
      // aString = "JobForPoll says: " + jobKey + " executing at " + new Date();
      // logger.info(aString);
      // System.out.println("JobForPoll says: " + jobKey + " executing at " +
      // new Date());
      
      IReader g4Reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");
      Dto inDto = new BaseDto();
      inDto.put("flag", "1");
      // 注释时间 -by huangwei 加上时间会导致启动轮询记录为空，后续报错，因为手动启动，不需要按时间过滤。
      // inDto.put("pollbegintime", DateTimeUtils.getDateSecondFormat());
      Dto dto = (Dto) g4Reader.queryForObject("reqpollcfg.queryPollployForList", inDto);
      String pollid = dto.getAsString("pollployid");
      inDto = new BaseDto();
      inDto.put("pollployid", pollid);
      String moncodes = (String) g4Reader
            .queryForObject("reqpollcfg.queryForCode", inDto);
      String[] temp = moncodes.split(",");
      moncodes = "";
      for (int i = 0; i < temp.length; i++) {
         moncodes = moncodes + "'" + temp[i] + "',";
      }
      moncodes = moncodes.substring(0, moncodes.length() - 1);
      List list = g4Reader.queryForList("reqpollcfg.queryForRepeater", inDto);
//      PooledConnectHandler.set(list.size());
//      Iterator it = list.iterator();
//      while (it.hasNext()) {
//         Map map = (Map) it.next();
//         String repeaterid = map.get("repeaterid").toString();
//         String channelcode = map.get("channelcode").toString();
//         List sendList = BitUnit.sendCommandData(repeaterid, moncodes, "02", "1", "");
//         String stationid=map.get("stationid").toString();
//         if ("13".equals(channelcode)) {
//            if (PooledConnectHandler.isOnline(stationid)) {
//                  for (int i = 0; i < sendList.size(); i++) {
//                     PooledConnectHandler.setSend(stationid
//                                                  + ":"
//                                                  + sendList.get(i).toString());
//                  }
//            }
//         }
//         else if ("03".equals(channelcode)) {
//            Object obj = map.get("stattel");
//            if (obj != null) {
//               if (!"".equals(obj.toString())) {// 短信连接
//                  ModemService.sendSms(obj.toString(), sendList.get(sendList.size() - 1)
//                        .toString());
//               }
//            }
//         }
//      }
      
   }
}
