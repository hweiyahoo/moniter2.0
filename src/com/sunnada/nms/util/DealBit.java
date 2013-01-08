package com.sunnada.nms.util;

/**
 * @author zhangys created 2011/Jul 19, 2011 all copyright reserved by sunnada
 *         功能说明：用于对进制格式的处理
 */
public class DealBit {
   
   // 压缩字符串 ,把二字节拆分合并成一字节 pStr= !01010B0F01FF!
   // 转义 用0x5E,0x5D来代替0x5E ^；用0x5E,0x7D来代替0x7E ~
   // public static String dePressStr(String iStr) {
   // StringBuffer sbRes = new StringBuffer();
   // String sTmp = "";
   // int cnt = iStr.length() / 2 - 1;
   // int idx = 1;
   // sbRes.append(iStr.charAt(0));
   // for (; idx <= cnt; idx++) {
   // sTmp = "";
   // sTmp += iStr.charAt(idx * 2 - 1);
   // sTmp += iStr.charAt(idx * 2);
   // if (sTmp.toUpperCase().equals("5E")) {
   // sbRes.append((char)Integer.parseInt("5E", 16));
   // sbRes.append((char)Integer.parseInt("5D", 16));
   // }
   // else if (sTmp.toUpperCase().equals("7E")) {
   // sbRes.append((char)Integer.parseInt("5E", 16));
   // sbRes.append((char)Integer.parseInt("7D", 16));
   // }
   // else {
   // sbRes.append((char)Integer.parseInt(sTmp, 16));
   // }
   // }
   // sbRes.append(iStr.charAt(iStr.length() - 1));
   // return sbRes.toString().toUpperCase();
   // }
   
   public static byte[] dePressStr(String srcStr) {
      String sTmp = "";
      int cnt = srcStr.length() / 2 - 1;
      int idx = 1;
      int k = 1;
      byte[] tempRes = new byte[cnt * 2];
      int temp1;
      tempRes[0] = (byte) srcStr.charAt(0);
      for (; idx <= cnt; idx++) {
         sTmp = "";
         sTmp += srcStr.charAt(idx * 2 - 1);
         sTmp += srcStr.charAt(idx * 2);
         if (sTmp.toUpperCase().equals("5E")) {
            tempRes[k++] = (byte) Integer.parseInt("5E", 16);
            tempRes[k++] = (byte) Integer.parseInt("5D", 16);
         }
         else if (sTmp.toUpperCase().equals("7E")) {
            tempRes[k++] = (byte) Integer.parseInt("5E", 16);
            tempRes[k++] = (byte) Integer.parseInt("7D", 16);
         }
         else {
            temp1 = Integer.parseInt(sTmp, 16);
            tempRes[k++] = (byte) temp1;
         }
      }
      tempRes[k] = (byte) srcStr.charAt(srcStr.length() - 1);
      byte[] result = new byte[k];
      System.arraycopy(tempRes, 0, result, 0, k);
      return result;
   }
   
   // 解压字符串,把一字节的拆分成二字节 pStr= ~99198~
   // 转义 用0x5E,0x5D来代替0x5E ^；用0x5E,0x7D来代替0x7E ~
   public static String enPressStr(String iStr) {
      StringBuffer sbRes = new StringBuffer();
      String sTmp = "";
      sbRes.append(iStr.charAt(0));
      int cnt = iStr.length();
      int idx = 1;
      for (; idx < cnt; idx++) {
         sTmp = "";
         sTmp += iStr.charAt(idx);
         sTmp += iStr.charAt(idx + 1);
         if (!sTmp.equals("5E")) {
            if ((sTmp.equals("5D") || sTmp.equals("7D")) && (iStr.substring(idx - 2, idx)
                      .equals("5E"))) {
               continue;
            }
            sbRes.append(sTmp);
         }
         else {
            if (iStr.substring(idx + 2, idx + 4).equals("7D")) {
               sbRes.append("7E");
            }
            else if (iStr.substring(idx + 2, idx + 4).equals("5D")) {
               sbRes.append("5E");
            }
         }
      }
      sbRes.append(iStr.charAt(cnt - 1));
      return sbRes.toString();
   }
   
   /**
    * @param hexStr
    *           16进制格式的字符串
    * @return Ascii码字符串
    */
   public static String hex2Asciis(String hexStr) {
      StringBuffer sbRes = new StringBuffer();
      int cnt = hexStr.length() / 2 - 1;
      int idx = 1;
      String sTmp = "";
      for (; idx <= cnt; idx++) {
         sTmp = "";
         sTmp += hexStr.charAt(idx * 2 - 1);
         sTmp += hexStr.charAt(idx * 2);
         sbRes.append((char) Integer.parseInt(sTmp, 16));
      }
      return sbRes.toString();
   }
   
   /**
    * 功能说明：把字符串的ASCII值转换成16进制数的串
    * 
    * @param ascStr
    * @return 16进制数的串
    */
   public static String ascii2Hex(String ascStr) {
      StringBuffer sbRes = new StringBuffer();
      int cnt = ascStr.length() - 1;
      int idx = 0;
      for (; idx <= cnt; idx++) {
         if (ascStr.charAt(idx) == '*') {
            sbRes.append("00");
         }
         else {
            sbRes.append(Integer.toString((int) ascStr.charAt(idx), 16));
         }
      }
      return sbRes.toString();
   }
   
   /**
    * 功能说明：num中的nSet位是否为1
    * 
    * @param num
    * @param nSet
    * @return 如果为1返回真，否则假
    */
   public static boolean isBitSet(int num, int nSet) {
      int nSetRes = (num & (1 << nSet));
      return nSetRes != 0;
   }
   
   /**
    * 功能说明:把num中的nSet位设置为1
    * 
    * @param numk
   }
   
   /**
    * 功能说明:把num中的nSet位设置为0
    * 
    * @param num
    * @param nSet
    * @return 设置后的结果
    */
   public static int bitToOff(int num, int nSet) {
      int res = num;
      if (isBitSet(num, nSet))
         res = num | ((1 << nSet) ^ Integer.parseInt("FFFFFF", 16));
      return res;
   }
   
   /**
    * 功能说明:把num中的nSet位设置为相反的值
    * 
    * @param num
    * @param nSet
    * @return 设置后的结果
    */
   public static int bitSwitch(int num, int nSet) {
      int res = num ^ (1 << nSet);
      return res;
   }
   
   /**
    * 功能说明:取len位的num的补码
    * 
    * @param num
    * @param len
    *           num的位数
    * @return
    */
   public static int plusBits(int num, int len) {
      int res = 0;
      if (num > 0) {
         switch (len) {
            case 1:
               if (num <= 127)
                  res = num;
               else
                  res = num - 256;
               break;
            case 2:
               if (num <= 32767)
                  res = num;
               else
                  res = num - 65536;
               break;
            case 3:
               if (num <= 8388607)
                  res = num;
               else
                  res = num - 16777216;
               break;
            default:
               res = num;
               break;
         }
      }
      else {
         switch (len) {
            case 1:
               res = num + 256;
               break;
            case 2:
               res = num + 65536;
               break;
            case 3:
               res = num + 16777216;
               break;
            default:
               res = num;
               break;
         }
      }
      return res;
   }
   
   /**
    * @param args
    */
   public static void main(String[] args) {
      // TODO Auto-generated method stub
      int a = 13;
      
      String s = Integer.toString(a, 2);
      String str = "123456";
      // System.out.println(s);
      // System.out.println((char)65);
      // System.out.println((int)'a');
      // System.out.println(Integer.toHexString(27).toUpperCase());
      // System.out.println(Integer.valueOf("1B", 16));
      // System.out.println(str.charAt(0));
      // System.out.println(Integer.valueOf("111", 2));
      // System.out.println(ascii2Hex("abcd"));
      // System.out.println(Integer.parseInt("FFFFFF",16));
      // System.out.println(str.substring(1, 3));
   }
   
}
