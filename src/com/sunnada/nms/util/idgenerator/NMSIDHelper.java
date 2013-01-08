package com.sunnada.nms.util.idgenerator;

import org.eredlab.g4.arm.util.idgenerator.IdGenerator;
import org.eredlab.g4.ccl.id.generator.DefaultIDGenerator;

/**
 * @author 作者姓名 HuangWei
 * @version 创建时间：Jan 6, 2011 10:26:16 AM 
 * 
 * ID生成器 静态类解决多线程并发访问生成ID的问题
 * 此类第一次实例化会执行所有的static代码块，如果想按需加载这些ID生成器，则应该一个ID写一个静态类就可以
 */ 

public class NMSIDHelper {

	/**
	 * 命令策略主表ID
	 */
	private static DefaultIDGenerator defaultIDGenerator_cmdmainid = null;
	static {
		IdGenerator idGenerator_cmdmainid = new IdGenerator();
		idGenerator_cmdmainid.setFieldname("CMDMAINID");
		defaultIDGenerator_cmdmainid = idGenerator_cmdmainid.getDefaultIDGenerator();
	}
	public static String getCmdMainID() {
		return defaultIDGenerator_cmdmainid.create();
	}
	
	/**
    * 命令策略从表ID
    */
   private static DefaultIDGenerator defaultIDGenerator_cmdsubid = null;
   static {
      IdGenerator idGenerator_cmdsubid = new IdGenerator();
      idGenerator_cmdsubid.setFieldname("CMDSUBID");
      defaultIDGenerator_cmdsubid = idGenerator_cmdsubid.getDefaultIDGenerator();
   }
   public static String getCmdSubId() {
      return defaultIDGenerator_cmdsubid.create();
   }
	
	/**
	 * 工厂管理主表ID
	 */
	  private static DefaultIDGenerator defaultIDGenerator_factId = null;
	   static {
	      IdGenerator idGenerator_factId = new IdGenerator();
	      idGenerator_factId.setFieldname("FACTID");
	      defaultIDGenerator_factId = idGenerator_factId.getDefaultIDGenerator();
	   }
	   public static String getFactId() {
	      return defaultIDGenerator_factId.create();
	   }
	   
	   /**
	    * 协议类型ID
	    */
	   private static DefaultIDGenerator defaultIDGenerator_proId = null;
      static {
         IdGenerator idGenerator_proId = new IdGenerator();
         idGenerator_proId.setFieldname("PROID");
         defaultIDGenerator_proId = idGenerator_proId.getDefaultIDGenerator();
      }
      public static String getProId() {
         return defaultIDGenerator_proId.create();
      }
      
      /**
       * 地区ID
       */
      private static DefaultIDGenerator defaultIDGenerator_siteId = null;
      static {
         IdGenerator idGenerator_siteId = new IdGenerator();
         idGenerator_siteId.setFieldname("SITEID");
         defaultIDGenerator_siteId = idGenerator_siteId.getDefaultIDGenerator();
      }
      public static String getSiteId() {
         return defaultIDGenerator_siteId.create();
      }
      
      /**
       * 公告ID
       */
      private static DefaultIDGenerator defaultIDGenerator_noticeId = null;
      static {
         IdGenerator idGenerator_noticeId = new IdGenerator();
         idGenerator_noticeId.setFieldname("NOTICEID");
         defaultIDGenerator_noticeId = idGenerator_noticeId.getDefaultIDGenerator();
      }
      public static String getNoticeId() {
         return defaultIDGenerator_noticeId.create();
      }
}
