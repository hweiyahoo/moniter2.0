package com.sunnada.nms.util;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

/**
 * String Utility Class This is used to encode passwords programmatically
 * 
 * 
 * @author <a href="mailto:wuyi@139sc.com">wangcj</a>
 */
public class StringUtils {
   // ~ Static fields/initializers =============================================
   
   private final static Log log = LogFactory.getLog(StringUtils.class);
   
   // ~ Methods ================================================================
   
   /**
    * Encode a string using algorithm specified in web.xml and return the
    * resulting encrypted password. If exception, the plain credentials string
    * is returned
    * 
    * @param password
    *           Password or other credentials to use in authenticating this
    *           username
    * @param algorithm
    *           Algorithm used to do the digest
    * 
    * @return encypted password based on the algorithm.
    */
   public static String encodePassword(String password, String algorithm) {
      byte[] unencodedPassword = password.getBytes();
      
      MessageDigest md = null;
      
      try {
         // first create an instance, given the provider
         md = MessageDigest.getInstance(algorithm);
      }
      catch (Exception e) {
         log.error("Exception: " + e);
         
         return password;
      }
      
      md.reset();
      
      // call the update method one or more times
      // (useful when you don't know the size of your data, eg. stream)
      md.update(unencodedPassword);
      
      // now calculate the hash
      byte[] encodedPassword = md.digest();
      
      StringBuffer buf = new StringBuffer();
      
      for (int i = 0; i < encodedPassword.length; i++) {
         if ((encodedPassword[i] & 0xff) < 0x10) {
            buf.append("0");
         }
         
         buf.append(Long.toString(encodedPassword[i] & 0xff, 16));
      }
      
      return buf.toString();
   }
   
   /**
    * Encode a string using Base64 encoding. Used when storing passwords as
    * cookies.
    * 
    * This is weak encoding in that anyone can use the decodeString routine to
    * reverse the encoding.
    * 
    * @param str
    * @return String
    */
   public static String encodeString(String str) {
      sun.misc.BASE64Encoder encoder = new sun.misc.BASE64Encoder();
      return encoder.encodeBuffer(str.getBytes()).trim();
   }
   
   /**
    * Decode a string using Base64 encoding.
    * 
    * @param str
    * @return String
    */
   public static String decodeString(String str) {
      sun.misc.BASE64Decoder dec = new sun.misc.BASE64Decoder();
      try {
         return new String(dec.decodeBuffer(str));
      }
      catch (IOException io) {
         throw new RuntimeException(io.getMessage(), io.getCause());
      }
   }
   
   /**
    * Replaces the occurences of a certain pattern in a string with a
    * replacement String. This is the fastest replace function known to author.
    * 
    * @param s -
    *           the string to be inspected
    * @param sub -
    *           the string pattern to be replaced
    * @param with-
    *           the string that should go where the pattern was
    * @return the string with the replacements done
    */
   public static String replace(String s, String sub, String with) {
      if ((s == null) || (sub == null) || (with == null)) {
         return s;
      }
      int c = 0;
      int i = s.indexOf(sub, c);
      if (i == -1) {
         return s;
      }
      StringBuffer buf = new StringBuffer(s.length() + with.length());
      do {
         buf.append(s.substring(c, i));
         buf.append(with);
         c = i + sub.length();
      } while ((i = s.indexOf(sub, c)) != -1);
      if (c < s.length()) {
         buf.append(s.substring(c, s.length()));
      }
      return buf.toString();
   }
   
   /**
    * 转换sql{}中的字符串到list中
    * 
    * @param sql
    * @return
    */
   public static List getAllPropertyName(String sql) {
      StringTokenizer st = new StringTokenizer(sql, "{");
      List list = new ArrayList();
      while (st.hasMoreTokens()) {
         StringTokenizer sq = new StringTokenizer(st.nextToken(), "}");
         if (sq.hasMoreTokens())
            list.add(sq.nextToken());
      }
      return list;
   }
   
   /**
    * Replaces the very first occurance of a substring with suplied string.
    * 
    * @param s
    *           source string
    * @param sub
    *           substring to replace
    * @param with
    *           substring to replace with
    * 
    * @return modified source string
    */
   public static String replaceFirst(String s, String sub, String with) {
      if ((s == null) || (sub == null) || (with == null)) {
         return s;
      }
      int i = s.indexOf(sub);
      if (i == -1) {
         return s;
      }
      return s.substring(0, i) + with + s.substring(i + sub.length());
   }
   
   /**
    * convert string
    * 
    * @param source
    * @param encodingName
    * @return
    */
   public static String convertEncoding(String source, String encodingName) {
      try {
         return new String(source.getBytes(), encodingName);
      }
      catch (UnsupportedEncodingException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
         return null;
      }
   }
   
   /**
    * 首字母大写
    * 
    * @param source
    * @return
    */
   public static String toUpperCaseFirstCharacter(String source) {
      String temp = source.substring(0, 1);
      return temp.toUpperCase() + source.substring(1);
   }
   
   /**
    * 首字母笑写
    * 
    * @param source
    * @return
    */
   public static String toLowerCaseFirstCharacter(String source) {
      String temp = source.substring(0, 1);
      return temp.toLowerCase() + source.substring(1);
   }
   
   /**
    * 使用with替换repl字符串
    * 
    * @param buffer
    * @param repl
    * @param with
    * @return
    */
   public static StringBuffer replace(StringBuffer buffer, String repl, String with) {
      int start = buffer.indexOf(repl);
      if (start < 0)
         return buffer;
      int end = start + repl.length();
      buffer = buffer.replace(start, end, with);
      return replace(buffer, repl, with);
   }
   
   /**
    * 将文件名中的汉字转为UTF8编码的串,以便下载时能正确显示另存的文件名. 周吉祥
    * 
    * @param s
    *           原文件名
    * @return 重新编码后的文件名
    * 
    */
   
   public static String toUtf8String(String s) {
      StringBuffer sb = new StringBuffer();
      for (int i = 0; i < s.length(); i++) {
         char c = s.charAt(i);
         if (c >= 0 && c <= 255) {
            sb.append(c);
         }
         else {
            byte[] b;
            try {
               b = Character.toString(c).getBytes("utf-8");
            }
            catch (Exception ex) {
               
               // System.out.println(ex);
               log.info(ex.getStackTrace());
               b = new byte[0];
            }
            for (int j = 0; j < b.length; j++) {
               int k = b[j];
               if (k < 0) {
                  k += 256;
               }
               sb.append("%" + Integer.toHexString(k).toUpperCase());
            }
         }
      }
      return sb.toString();
   }
   
   public static boolean isEmpty(String str) {
      if (str == null || str.length() == 0) {
         return true;
      }
      else {
         return false;
      }
   }
   
   /**
    * 左补齐长度
    * 
    * @param str
    *           需要补齐的字符串
    * @param str1
    *           用什么来补齐
    * @param length
    *           补齐到的长度
    * @return
    */
   public static String complete(String str, String str1, int length) {
      if (str.length() == length) {
         return str;
      }
      else if (str.length() > length) {
         return str;
      }
      else {
         int diff = length - str.length();
         // String temp=str;
         for (int i = 0; i < diff; i++) {
            str = str1 + str;
         }
         return str;
      }
   }
   
   /**
    * 右补齐长度
    */
   public static String rComplete(String str, String str1, int length) {
      if (str.length() == length) {
         return str;
      }
      else if (str.length() > length) {
         return str;
      }
      else {
         int diff = length - str.length();
         // String temp=str;
         for (int i = 0; i < diff; i++) {
            str = str + str1;
         }
         return str;
      }
   }
   
   public static int[] charToInt(String sCmd) {
      int[] bCmd = new int[10000];
      int[] cmd;
      int length = 0;
      for (int i = 0; i <= sCmd.length() - 1; i = i + 2) {
         String temp = sCmd.substring(i, i + 2);
         bCmd[length] = Integer.parseInt(temp, 16);
         length++;
      }
      cmd = new int[length];
      for (int i = 0; i < length; i++) {
         cmd[i] = bCmd[i];
      }
      return cmd;
   }
   
   /**
    * byte[]转String
    * 
    * @param b
    * @return
    */
   public static String byteToStr(byte[] b) {
      StringBuffer sb = new StringBuffer();
      for (int i = 0; i < b.length; i++) {
         int temp = b[i];
         if (temp < 0)
            temp = temp & 0xFF;
         String str = Integer.toHexString(temp);
         str = StringUtils.complete(str, "0", 2);
         sb.append(str.toUpperCase());
      }
      return sb.toString();
   }
   
   public static String byteToStr(byte[] b, int num) {
      StringBuffer sb = new StringBuffer();
      for (int i = 0; i < num; i++) {
         int temp = b[i];
         if (temp < 0)
            temp = temp & 0xFF;
         String str = Integer.toHexString(temp);
         str = StringUtils.complete(str, "0", 2);
         sb.append(str.toUpperCase());
      }
      return sb.toString();
   }
   
   /**
    * String指令转byte[]
    * 
    * @param sCmd
    * @return
    */
   public static byte[] charTobyte(String sCmd) {
      byte[] bCmd = new byte[sCmd.length()];
      byte[] cmd;
      int length = 1;
      bCmd[0] = 126;
      for (int i = 1; i < sCmd.length() - 1; i = i + 2) {
         String temp = sCmd.substring(i, i + 2);
         int j = Integer.parseInt(temp, 16);
         bCmd[length] = (byte) j;
         length++;
      }
      bCmd[length] = 126;
      length++;
      cmd = new byte[length];
      for (int i = 0; i < length; i++) {
         cmd[i] = bCmd[i];
      }
      return cmd;
   }
   
   public static byte[] charTobyteModem(String sCmd) {
      byte[] bCmd = new byte[sCmd.length()];
      byte[] cmd;
      int length = 1;
      bCmd[0] = 33;
      for (int i = 1; i < sCmd.length() - 1; i = i + 2) {
         String temp = sCmd.substring(i, i + 2);
         int j = Integer.parseInt(temp, 16);
         bCmd[length] = (byte) j;
         length++;
      }
      bCmd[length] = 33;
      length++;
      cmd = new byte[length];
      for (int i = 0; i < length; i++) {
         cmd[i] = bCmd[i];
      }
      return cmd;
   }
   
   /**
    * "1,2,3,4" to "'1','2','3','4'"
    * 
    * @param str
    * @return
    */
   public static String StringFormatSqlUseInParam(String str) {
      if (isEmpty(str)) {
         return null;
      }
      str = str.replaceAll(",", "','");
      str = "'" + str + "'";
      return str;
   }
   
   /**
    * 替换掉指定的字符串 1,2,3,4,5,6,7,8 [1,2,4] --> 3,5,6,7,8
    * 
    * @param str
    *           原始字符串
    * @param assignStr
    *           需要替换掉的字符串
    * @return
    */
   public static String removeAssignStr(List<String> strList, List<String> assignStrList) {
      for (int i = 0; i < strList.size(); i++) {
         for (int j = 0; j < assignStrList.size(); j++) {
            if (strList.get(i).equals(assignStrList.get(j))) {
               strList.remove(i);
               assignStrList.remove(j);
               removeAssignStr(strList, assignStrList);
            }
         }
      }
      String temp = strList.toString();
      if (!StringUtils.isEmpty(temp)) {
         temp = temp.substring(1, temp.length() - 1);
         temp = temp.replaceAll(" ", "");
      }
      return temp;
   }
   
   public static String appendAssignStr(String str, String assignStr) {
      return str + "," + assignStr;
   }
   
   public static List StringArry2List(String[] strs) {
      List list = new ArrayList();
      for (int i = 0; i < strs.length; i++) {
         list.add(strs[i]);
      }
      return list;
   }
   
   /**
    * 格式化 设备监控模块中自定义的deptid格式，解析出当前用户所属地市
    * 
    * @param deptid
    * @return
    */
   public static Dto formatDMDeptidForNms(String deptid) {
      Dto outDto = new BaseDto();
      String province = null, city = null;
      if (!StringUtils.isEmpty(deptid)) {
         if (deptid.length() >= 9) {
            province = deptid.substring(6, 9);
            int temp = Integer.valueOf(province);
            if ((temp + "").length() == 1) {
               province = "0" + temp;
            }
            else {
               province = temp + "";
            }
         }
         if (deptid.length() >= 12) {
            city = deptid.substring(9, 12);
            int temp = Integer.valueOf(city);
            if ((temp + "").length() == 1) {
               city = "0" + temp;
            }
            else {
               city = temp + "";
            }
         }
      }
      outDto.put("province", province);
      outDto.put("city", city);
      return outDto;
   }
   
   /**
    * 列索引映射excel具体的列标号。如1=A，27=AA，53=BA（索引从1开始）
    * 
    * @param index
    * @return
    * 
    * 该方法方便excel宏定义，序列等涉及到表达式计算的时候使用。
    */
   public static String ColumnNum2ColumnNameForExcel(int index) {
      StringBuffer sb = new StringBuffer();
      int columnBaseNum = 26;
      String[] columnBaseName = { "Z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "H", "Y", "Z" };
      if (index <= 0) {
         return null;
      }
      else if (index > 0 && index <= columnBaseNum) {
         sb.append(columnBaseName[index]);
      }
      else {
         int fcnum = index / columnBaseNum;
         int scnum = index % columnBaseNum;
         if (fcnum > 0) {
            if (scnum == 0) {
               fcnum--;
            }
            sb.append(columnBaseName[fcnum]);
         }
         if (scnum >= 0) {
            sb.append(columnBaseName[scnum]);
         }
      }
      
      return sb.toString();
   }
   
   public static String createCodeForNMSSite(String sitecode) {
      if (isEmpty(sitecode)) {
         sitecode = "01";
      }
      else {
         int intsitecode = Integer.valueOf(sitecode).intValue() + 1;
         String hexString = Integer.toHexString(intsitecode);
         if (hexString.length() < 2) {
            sitecode = "0" + hexString;
         }
         else {
            sitecode = hexString;
         }
      }
      return sitecode;
   }
   
   /**
    * 生成站点设备的设备编号
    * 
    * @param sitecode
    * @return
    */
   public static String createCodeForStatsubid(String statsubid) {
      if (isEmpty(statsubid)) {
         statsubid = "01";
      }
      else {
         int intsitecode = Integer.valueOf(statsubid).intValue() + 1;
         if (intsitecode < 10) {
            statsubid = "0" + intsitecode;
         }
         else {
            statsubid = "" + intsitecode;
         }
      }
      return statsubid;
   }
   
   public static boolean isHex(String input) {
      boolean flag = true;
      try {
         int result = Integer.parseInt(input, 16);
      }
      catch (Exception ex) {
         flag = false;
      }
      return flag;
   }
   
   public static void main(String[] args) {
      // String str = "1,2,3,4,5,6,7,8";
      // String assignStr = "5,7,8,1";
      // List<String> strList = StringUtils.StringArry2List(str.split(","));
      // List<String> assignStrList =
      // StringUtils.StringArry2List(assignStr.split(","));
      // String temp = StringUtils.removeAssignStr(strList, assignStrList);
      // System.out.println(temp);
      // int test = 0;
      // System.out.println("---" + test + ": " +
      // StringUtils.ColumnNum2ColumnNameForExcel(test));
      
      // System.out.println(createCodeForNMSSite(""));
      for (int i = 0; i < 50; i++) {
         System.out.println("10进制：" + i + " --- 16进制：" + Integer.toHexString(i));
      }
      
   }
   
}
