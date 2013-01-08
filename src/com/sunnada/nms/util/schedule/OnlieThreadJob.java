/*
 * Copyright 2005 - 2009 Terracotta, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 */

package com.sunnada.nms.util.schedule;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;

public class OnlieThreadJob implements Job {
   private static Logger logger = Logger.getLogger(OnlieThreadJob.class);
   
   public OnlieThreadJob() {
   }
   
   public void execute(JobExecutionContext context) throws JobExecutionException {
      JobKey jobKey = context.getJobDetail().getKey();
      logger.info("OnlieThreadJob says: " + jobKey + " executing at " + new Date());
      ExecutorService service = Executors.newCachedThreadPool(new DemonThreadFactory());
//      for (Map.Entry<String, SocketBean> entry : PooledConnectHandler.pool.entryS et()) {
//         service.execute(new OnlieThread(entry.getValue(), entry.getKey()));
//      }
      service.shutdown();
   }
   
   class DemonThreadFactory implements ThreadFactory {
      
      public Thread newThread(Runnable r) {
         Thread t = new Thread(r);
         t.setDaemon(true);
         return t;
      }
      
   }
}
