package com.sunnada.nms.parse;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.StringTokenizer;
import java.util.zip.CRC32;
import java.util.zip.CheckedInputStream;

import com.sunnada.nms.remoteUpdate.Global;
import com.sunnada.nms.util.StringUtils;

/**
 * @author zhangys created Dec 16, 2011 all copyright reserved by sunnada
 *         通讯解析的辅助类
 */
public class AidParser {
   
   private StringBuilder     FileBin_Str   = new StringBuilder();

   //压缩字符串 ,把二字节拆分合并成一字节    pStr= !01010B0F01FF!
   
 //转义  用0x5E来代替0x5E,0x5D  ^；用来代替 0x5E,0x7D ~
   public byte[] dePressStr(String src) {
      int srclen = src.length();
      // 直接设置跟原串一样的长度,可能存在转义
      byte[] res = new byte[srclen];
      byte[] result;
      // 去第一个字节
      int k = 0;
      res[k++] = (byte) src.charAt(0);
      String tmp = "";
      // 要去掉头尾标志
      for (int i = 0; i < srclen / 2-1; i++) {
         tmp = "";
         tmp += src.charAt(i*2+1);
         tmp += src.charAt(i*2+2);
         if (tmp.equals("5E")) {
            res[k++] = (byte) strToInt("5E", 16);
            res[k++] = (byte) strToInt("5D", 16);
         }
         else if (tmp.equals("7E")) {
            res[k++] = (byte) strToInt("5E", 16);
            res[k++] = (byte) strToInt("7D", 16);
          }
         else {
            res[k++] = (byte) strToInt(tmp, 16);
          }
      }
      // 取最后一个字节
      res[k++] = (byte) src.charAt(srclen - 1);
      //res.append(src.charAt(lLen - 1));//
      result = new byte[k];
      System.arraycopy(res, 0, result, 0, k);
      return result;
   }
 //解压字符串,把一字节的拆分成二字节       pStr= ~99198~
 //转义  用0x5E,0x5D来代替0x5E ^；用0x5E,0x7D来代替0x7E  ~
   public byte[] enPressStr(byte[] src) {
      int srclen = src.length;
      // 直接设置跟原串的2倍,可能存在转义
      byte[] res, tmpres = new byte[srclen*2];
      // 去第一个字节
      int k = 0;
      tmpres[k++] = src[0];//res.append(src.charAt(0));
      // 要去掉头尾标志
      for (int i = 1; i < srclen-1; i++) {
         // 如果不是转义5E5D 5E7D,则直接转化
         if ((int)src[i] != strToInt("5E", 16) ) {
            // 如果是这两种情况,则直接进行下一轮循环
            if ((int) src[i] == strToInt("5D", 16) 
                  && (int) src[i-1] == strToInt("5E", 16))
               continue;
            else if ((int) src[i] == strToInt("7D", 16) 
                  && (int) src[i-1] == strToInt("5E", 16))
               continue;
            tmpres[k++] = src[i];

         } // 需要转义,则要处理
         else {
            // 5E5D ^
            if ((int) src[i] == strToInt("5D", 16)) { 
               tmpres[k++] = (byte) strToInt("5E", 16);
            }
            // 5E7D ~
            else if ((int) src[i+1] == strToInt("7D", 16)) { 
               tmpres[k++] = (byte) strToInt("7E", 16);
            }
            // 5EXX 目前一般来说是不可能的
            else {
               tmpres[k++] = (byte) strToInt("5E", 16);//res.append((char) strToInt("5E", 10));
            }
         }         
      }
      //取最后一个字节
      tmpres[k++] = src[srclen-1];
      res = new byte[k];
      System.arraycopy(tmpres, 0, res, 0, k);
      return res;
   }  
   // 转义
   /*
   public String enPressStr(String pStr) {
      int k, i, lLen, voneInt, vPreOneInt;
      char lCh;
      lLen = pStr.length();
      if (lLen == 0) {
         return "输入参数不能为空！";
      }
      String vones;// "7E"
      // 直接设置跟原串的2倍,可能存在转义
      char[] pVal = new char[lLen * 2];
      // 去第一个字节
      pVal[1] = pStr.substring(0, 1).charAt(0);
      k = 2;
      // begin
      // 要去掉头尾标志
      for (i = 1; i < (lLen - 1); i++) {
         try {
            // 如果不是转义5E5D 5E7D,则直接转化
            lCh = pStr.substring(i, i + 1).charAt(0);// pStr[i]
            voneInt = (int) lCh;
            lCh = pStr.substring(i - 1, i).charAt(0);
            vPreOneInt = (int) lCh;
            if (voneInt != 94) {
               // 如果是这两种情况,则直接进行下一轮循环
               if ((voneInt == 93) && (vPreOneInt == 94)) {
                  continue;
               }
               else {
                  if ((voneInt == 125) && (vPreOneInt == 94)) {// #$7D=125
                     continue;
                  }
               }
               vones = intToHex(voneInt, 2);
               pVal[k] = vones.charAt(0);
               k++;
               pVal[k] = vones.charAt(1);
               k++;
            }
            // 需要转义,则要处理
            else {// //转义 用0x5E来代替0x5E,0x5D；用0x7E来代替0x5E,0x7D
               // 5E5D ^
               lCh = pStr.substring(i + 1, i + 2).charAt(0);// pStr[i+1]
               if (lCh == 93) {// move('5E',pVal[k],2);
                  pVal[k] = "5".charAt(0);
                  k++;
                  pVal[k] = "E".charAt(0);
                  k++;
               }
               // 5E7D ~
               else if (lCh == 125) {
                  vones = "7E";
                  pVal[k] = vones.charAt(0);
                  k++;
                  pVal[k] = vones.charAt(1);
                  k++;
               }
               // 5EXX 目前一般来说是不可能的
               else {
                  vones = "5E";
                  pVal[k] = vones.charAt(0);
                  k++;
                  pVal[k] = vones.charAt(1);
                  k++;
               }
            }
         }
         catch (Exception e) {
            return e.getMessage();
         }
      }
      // 取最后一个字节
      pVal[k] = pStr.charAt(lLen - 1);
      String oVal = "";
      char curVal;
      for (i = 1; i < (pVal.length - 1); i++) {
         curVal = (char) (pVal[i]);
         oVal = oVal + curVal;
         if ((curVal == pVal[k]) && (i != 1)) {
            break;
         }
      }
      return oVal;
   } 
   */
   
   // 高低字节转换
   public String highToLow(String pValue) {
      // 高低字节对换 xujinmei验证ok
      String vResult = pValue;
      
      int vlen = pValue.length();
      if (vlen == 2) {
         vResult = pValue;
      }
      if (vlen == 4) {
         vResult = "" + pValue.charAt(2)
                   + pValue.charAt(3)
                   + pValue.charAt(0)
                   + pValue.charAt(1);
      }
      if (vlen == 6) {
         vResult = "" + pValue.charAt(4)
                   + pValue.charAt(5)
                   + pValue.charAt(2)
                   + pValue.charAt(3)
                   + pValue.charAt(0)
                   + pValue.charAt(1);
      }
      if (vlen == 8) {
         vResult = "" + pValue.charAt(6)
                   + pValue.charAt(7)
                   + pValue.charAt(4)
                   + pValue.charAt(5)
                   + pValue.charAt(2)
                   + pValue.charAt(3)
                   + pValue.charAt(0)
                   + pValue.charAt(1);
      }
      return vResult;
   }
   
   // CRC校验
   public String crc(String pStr, Boolean pTwo) {
      String Result = "-1";
      if (pStr == "") {
         return "";
      }
      // 1.CRC赋初值
      int lCrc, lIndex, i, vlen, lChar;
      
      String lHex;
      lCrc = 0;
      lIndex = 1;
      // 2.判断是否二字节 ,并进行CRC
      
      if (pTwo) {
         vlen = pStr.length() / 2 + 1;
         for (i = 1; i < vlen; i++) {
            lCrc = getUnsignedByte((lCrc >> 8) | (lCrc << 8));
            lHex = "" + pStr.charAt(lIndex - 1) + pStr.charAt(lIndex);// 0x
            try {
               lChar = Integer.parseInt(lHex, 16);
            }
            catch (Exception e) {
               return "HaveException is:" + e.getMessage();
            }
            lIndex = lIndex + 2;// Inc(lIndex,2);
            lCrc = getUnsignedByte(lCrc ^ lChar);// lCrc := lCrc xor
            lCrc = getUnsignedByte(lCrc ^ ((lCrc & 0xff) >> 4));// lCrc ^
            lCrc = getUnsignedByte(lCrc ^ ((lCrc << 8) << 4));// lCrc := lCrc
            lCrc = getUnsignedByte(lCrc ^ (((lCrc & 0xff) << 4) << 1));// lCrc
            
         }
      }
      else {
         vlen = pStr.length();
         for (i = 1; i < vlen; i++) {// for i:=1 to Length(pStr) do
            lCrc = getUnsignedByte((lCrc >> 8) | (lCrc << 8));// (byte)( (lCrc
            lChar = (int) (pStr.charAt(lIndex - 1)); // lChar:=
            lIndex++;// Inc(lIndex);
            lCrc = getUnsignedByte(lCrc ^ lChar); // lCrc := lCrc xor
            lCrc = getUnsignedByte(lCrc ^ ((lCrc & 0xff) >> 4));// lCrc ^
            lCrc = getUnsignedByte(lCrc ^ ((lCrc << 8) << 4));// lCrc := lCrc
            lCrc = getUnsignedByte(lCrc ^ (((lCrc & 0xff) << 4) << 1)); // lCrc
         }
      }
      // 3.返回结果
      Result = highToLow(intToHex(getUnsignedByte(lCrc), 4)); // HighToLow(IntToHex(lCrc,4));
      Result = Result.toUpperCase();
      return Result;
   }
   
   public int getUnsignedByte(int data) {
      return data & 0x0FFFF;
   }
   
   // 文件CRC32 校验
   public String doChecksum(String fileName) {
      
      try {
         
         CheckedInputStream cis = null;
         long fileSize = 0;
         try {
            // Computer CRC32 checksum
            cis = new CheckedInputStream(new FileInputStream(fileName), new CRC32());
            
            fileSize = new File(fileName).length();
            
         }
         catch (FileNotFoundException e) {
            System.err.println("File not found.");
            System.exit(1);
         }
         
         byte[] buf = new byte[64];
         while (cis.read(buf) >= 0) {
         }
         
         long checksum = cis.getChecksum().getValue();
         return Long.toHexString(checksum).toUpperCase();
         
      }
      catch (IOException e) {
         e.printStackTrace();
         return "-1";
      }
   }
   
   //求文件CRC16
   public String getFileCrc16(String fileName) throws Exception {
      String vcrc = "-1";
      FileBin_Str.delete(0, FileBin_Str.length());
      File file = new File(fileName);
      FileInputStream in = new FileInputStream(file);
      BufferedInputStream fs = new BufferedInputStream(in);
      int iLen = 0;
      iLen = fs.available();
      byte[] buff = new byte[iLen];
      int iRet = fs.read(buff);
      String s, vdetail;
      int lCrc, i, lChar, slen, ilen, m, n, vca;
      lCrc = 0;
      if (iRet > -1) {
         FileBin_Str.append(Global.byteArrToHexStr(buff, iRet));
         slen = FileBin_Str.length();
         m = 0;
         if (slen > 2) {
            n = 2;
         }
         else {
            n = slen;
         }
         vdetail = FileBin_Str.substring(m, n);
         while (vdetail.length() != 0) {
            ilen = vdetail.length();
            lCrc = getUnsignedByte((lCrc >> 8) | (lCrc << 8));
            lChar = Integer.parseInt(vdetail, 16);
            lCrc = getUnsignedByte(lCrc ^ lChar);
            lCrc = getUnsignedByte(lCrc ^ (lCrc & 0xff) >> 4);
            lCrc = getUnsignedByte(lCrc ^ ((lCrc << 8) << 4));
            lCrc = getUnsignedByte(lCrc ^ (((lCrc & 0xff) << 4) << 1));
            m = m + 2;
            n = n + 2;
            if (n > slen) {
               m = m - 2;
               n = n - 2;
               vca = slen - n;
               if (vca > 0) {
                  m = m + vca;
                  n = n + vca;
               }
               else {
                  break;
               }
            }
            vdetail = FileBin_Str.substring(m, n);
         }
         vcrc = intToHex(getUnsignedByte(lCrc), 4);
         vcrc = vcrc.toUpperCase();
      }
      return vcrc;
   }
   
   public int strToInt(String sHex, int Itype) {
      int buf = 0;      
      buf = Integer.parseInt(sHex, Itype);      
      return buf;
   }
   
   public String copy(String I_Src, int I_Index, int I_Count) {
      String vs = "";
      int vi = I_Count + I_Index;
      vs = I_Src.substring(I_Index - 1, vi - 1);
      return vs;
   }
   
   public String f10(String pResult, String pVar) {
      if (pVar.equals("")) {
         pResult = "";
         return pResult;
      }
      String vStrOne = "" + pVar.charAt(0);
      if (vStrOne.equals("东")) {
         pResult = "E" + copy(pVar, 3, pVar.length() - 3);
      }
      else if (vStrOne.equals("西")) {
         
         pResult = "W" + copy(pVar, 3, pVar.length() - 3);
      }
      else
         pResult = pVar;
      return pResult;
   }
   
   public String f11(String pResult, String pVar) {
      if (pVar.equals("")) {
         pResult = "";
         return pResult;
      }
      String vStrOne = "" + pVar.charAt(0);
      if (vStrOne.equals("北")) {
         pResult = "N" + copy(pVar, 3, pVar.length() - 3);
      }
      else if (vStrOne.equals("南")) {
         pResult = "S" + copy(pVar, 3, pVar.length() - 3);
      }
      else
         pResult = pVar;
      return pResult;
   }
   
   public String f12(String pVar) {
      String pResult = "";
      if (pVar.equals("") || pVar == null) {
         return pResult;
      }
      try {
         String date = pVar.split(" ")[0];
         String time = pVar.split(" ")[1];
         StringTokenizer tokenizer = new StringTokenizer(date, "-");
         while (tokenizer.hasMoreTokens()) {
            pResult = pResult + tokenizer.nextToken();
         }
         tokenizer = new StringTokenizer(time, ":");
         while (tokenizer.hasMoreTokens()) {
            pResult = pResult + tokenizer.nextToken();
         }
         return pResult;
      }
      catch (Exception e) {
         return pResult;
      }
   }
   
   public String X10(String pVar, String len) {
      String pResult = "";
      int temp = Integer.parseInt(pVar);
      temp = temp * 10;
      if (temp < 0) {
         temp = temp & getFF(Integer.parseInt(len));
      }
      pResult = Integer.toHexString(temp).toUpperCase();
      pResult = StringUtils.complete(pResult, "0", Integer.parseInt(len) * 2);
      return pResult;
   }
   
   public int getFF(int len) {// 用于生成FF
      String temp = "";
      for (int i = 0; i < len; i++) {
         temp = temp + "FF";
      }
      int result = Integer.parseInt(temp, 16);
      return result;
   }
   
   public String f13(String pVar) {
      String pResult = "";
      String[] ip;
      if (pVar.equals("") || pVar == null) {
         return pResult;
      }
      try {
         StringTokenizer token = new StringTokenizer(pVar, ".");
         while (token.hasMoreTokens()) {
            pResult = pResult + StringUtils.complete(Integer.toHexString(
                            Integer.parseInt(token.nextToken())).toUpperCase(), "0", 2);
         }
         return pResult;
      }
      catch (Exception e) {
         pResult = "";
      }
      return pResult;
   }
   
   public String getAsciis(String I_str, int Itype) {
      String v_result = "";
      int buf = strToInt(I_str, Itype);
      v_result = "" + (char) (buf);// chr
      if (v_result.equals("")) {
         v_result = "00";
      }
      return v_result;
   }
   
   public String f14(String pResult, String pVar) {
      if (pVar.equals("")) {
         pResult = "";
         return pResult;
      }
      try {
         pResult = getAsciis(copy(pVar, 1, 2), 16) + getAsciis(copy(pVar, 4, 2), 16);
      }
      catch (Exception e) {
         pResult = "";
      }
      return pResult;
   }
   
   public String f15(String pResult, String pVar) {
      if (pVar.equals("")) {
         pResult = "";
         return pResult;
      }
      try {
         pResult = (getAsciis(copy(pVar, 1, 2), 16)) + (getAsciis(copy(pVar, 3, 2), 16))
                   + (getAsciis(copy(pVar, 6, 2), 16))
                   + (getAsciis(copy(pVar, 9, 2), 16));
      }
      catch (Exception e) {
         pResult = "";
      }
      return pResult;
   }
   
   public String charToStr(String integer){
      String result="";
      while(!integer.matches("(20)+")){
         if(integer.length()==0)
            break;
         String temp=integer.substring(0,2);
         integer=integer.substring(2);
         int x=Integer.parseInt(temp,16);
         result=result+(char)x;
      }
      return result;
   }
   
   public String f20(String pVar) {
      String pResult="";
      if("".equals(pVar)||pVar.matches("F+")){
         return pResult;
      }
      pVar=pVar.substring(2);
      pResult=pResult+charToStr(pVar);
      return pResult;
   }

   public String f21( String pVar) {
      return f20( pVar);
   }
   
   public String f22(String pVar) {
      String pResult = "";
      if ("FFFFFF".equals(pVar)) {
         pResult = "";
      }
      else {
         String year = pVar.substring(0, 4);
         String month = pVar.substring(4, 6);
         String day = pVar.substring(6, 8);
         String hour = pVar.substring(8, 10);
         String min = pVar.substring(10, 12);
         String second = pVar.substring(12);
         pResult = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + second;
      }
      return pResult;
   }
   
   public String f23(String pVar) {
      String pResult = "";
      if ("FFFFFF".equals(pVar)) {
         pResult = "";
      }
      else {
         for (int i = 0; i < 4; i++) {
            pResult = pResult + Integer.parseInt(pVar.substring(i * 2, i * 2 + 2), 16)
                      + ".";
         }
         pResult = pResult.substring(0, pResult.length() - 1);
      }
      return pResult;
   }
   
   public String D10(String pVar, String len) {
      String pResult = "";
      if("".equals(pVar))
         return pResult;
      int value = Integer.parseInt(pVar, 16);
      String bit = StringUtils.complete(Integer.toBinaryString(value), "0", Integer
            .parseInt(len) * 8);
      if (bit.startsWith("1")) {// 负数
         int temp = getFF(Integer.parseInt(len));
         value = value - 1;
         value = value ^ temp;
         value = -value;
      }
      value = value / 10;
      pResult = String.valueOf(value);
      return pResult;
   }
   
   public String HexToStr(String pVar) {
      String pResutl = "";
      for (int i = 0; i < 20; i++) {
         String temp = pVar.substring(i * 2, i * 2 + 2);
         if ("00".equals(temp))
            break;
         int value = Integer.parseInt(temp, 16);
         pResutl = pResutl + (char) value;
      }
      return pResutl;
   }
   
   //added by zhangys 2011/12/23
   public String hex2Str(String pVar) {
      StringBuffer pResutl = new StringBuffer();
      int len = pVar.length()/2;
      for (int i = 0; i < len; i++) {
         String temp = pVar.substring(i * 2, i * 2 + 2);
         int value = Integer.parseInt(temp, 16);
         pResutl.append((char) value);
      }
      return pResutl.toString();
   }
   public int UnitToStr(String pVar) {
      return Integer.parseInt(pVar, 16);
   }
   
   public int SintToStr(String pVar, String len) {
      int value = Integer.parseInt(pVar, 16);
      String bit = StringUtils.complete(Integer.toBinaryString(value), "0", Integer
            .parseInt(len) * 8);
      if (bit.startsWith("1")) {// 负数
         int temp = getFF(Integer.parseInt(len));
         value = value - 1;
         value = value ^ temp;
         value = -value;
      }
      return value;
      // return pResult;
   }
   
   public String f24(String pResult, String pVar) {
      String lstr1, lstr2, lstr3;
      if (pVar.equals("")) {
         pResult = "";
         return pResult;
      }
      lstr1 = "" + pVar.charAt(0);
      lstr2 = "" + pVar.charAt(1);
      try {
         pResult = intToHex((int) (pVar.charAt(0)), 2) + ":"
                   + intToHex((int) (pVar.charAt(1)), 2);
      }
      catch (Exception e) {
         pResult = "";
      }
      return pResult;
   }
   
   public String f25(String pResult, String pVar) {
      if (pVar.equals("")) {
         pResult = "";
         return pResult;
      }
      try {
         pResult = intToHex((int) (pVar.charAt(0)), 2) + intToHex((int) (pVar.charAt(1)),
                         2)
                   + '-'
                   + intToHex((int) (pVar.charAt(2)), 2)
                   + '-'
                   + intToHex((int) (pVar.charAt(3)), 2);
      }
      catch (Exception e) {
         pResult = "";
      }
      return pResult;
   }
   
   public String intToHex(int Value, int Digits) {
      String vresult = "";
      vresult = Integer.toHexString(Value);
      int vlen = 0;
      vlen = vresult.length();
      while (vlen < Digits) {
         vresult = "0" + vresult;
         vlen = vresult.length();
      }
      return vresult.toUpperCase();
      
   }
   
   
   public String wordToFourAscii(int pByte) {
      int lLen;
      String vResult = "";
      vResult = intToHex(pByte, 4);
      lLen = vResult.length();
      if (lLen > 4) {
         lLen = vResult.length();
         vResult = vResult.substring(lLen - 3, lLen);// copy(vResult,lLen -
         // 3,4);
      }
      return vResult.toUpperCase();
   }
}
