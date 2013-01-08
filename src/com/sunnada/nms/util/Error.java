
package com.sunnada.nms.util; 
/** 
 * @author linxingyu
 * @version 创建时间：2011-12-13 上午09:58:45 
 * 应答表示为01时，判断错误原因
 */
public class Error {
   public static String getReason(String paramcode){
      String result="";
      String flag=paramcode.substring(0,1);
      if(flag.equals("1")){
         result="监控数据标识无法识别";
      }
      else if(flag.equals("2")){
         result="监控数据的设置值超出范围";
      }
      else if(flag.equals("3")){
         result="监控数据标识与监控数据的值不符合要求";
      }
      else if(flag.equals("4")){
         result="监控数据标识与监控数据长度不匹配";
      }
      else if(flag.equals("5")){
         result="监控数据的检测值低于工作范围";
      }
      else if(flag.equals("6")){
         result="监控数据的检测值高于工作范围";
      }
      else if(flag.equals("6")){
         result="监控数据的检测值高于工作范围";
      }
      else if(flag.equals("7")){
         result="监控数据无法检测";
      }
      else if(flag.equals("9")){
         result="未列出的其它错误";
      }
      result=result+",监控标识号:0"+paramcode.substring(1)+"。";
      return result;
   }
}