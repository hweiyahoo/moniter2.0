package com.sunnada.nms.modem2;

import com.sunnada.nms.message.Handler;
import com.sunnada.nms.message.analysisbag.AbstractAnaly;
import com.sunnada.nms.message.analysisbag.SCDMAAnaly;
import com.sunnada.nms.message.pack.AbstractPack;
import com.sunnada.nms.parse.AbsRecver;
import com.sunnada.nms.parse.Recver4yd;

/**
 * @author zhangys
 * created Dec 12, 2011 all copyright reserved by sunnada 
 * desc 对接收到的短信的多线程处理
 */
public class DealRecvSms extends Thread {
   private String smsText;
   private String telephone;
   public DealRecvSms(String smsText,String telephone) {
      this.smsText = smsText;
      this.telephone=telephone;
   }
   /* (non-Javadoc)
    * @see java.lang.Thread#run()
    */
   public void run() {
     Handler handler=new Handler();
     AbstractAnaly analy=new SCDMAAnaly();
     AbstractPack pack=analy.analy(smsText);
     handler.doHandler(pack, null, null,"2",telephone);
     
   }
   
}
