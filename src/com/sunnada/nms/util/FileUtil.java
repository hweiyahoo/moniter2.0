package com.sunnada.nms.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.CRC32;
import java.util.zip.CheckedInputStream;

import org.apache.log4j.Logger;

/**
 * @author 作者姓名 HuangWei E-mail: huangw@fortunetone.com
 * @version 创建时间：Jan 9, 2011 1:43:29 PM
 * 
 * 文件操作
 */
public class FileUtil {
   private static Logger   logger = Logger.getLogger(FileUtil.class);
   public static final int BUFFER = 1024;
   
   /**
    * 读取文件里的内容
    * 
    * @param path
    *           文件路径
    * @return 内容
    * @throws IOException
    *            文件找不到时， 抛出异常
    */
   public static StringBuffer readFile(String path) throws IOException {
      StringBuffer content = null;
      InputStream in = new FileInputStream(new File(path));
      byte[] by = new byte[in.available()];
      int i = in.read(by, 0, in.available());
      if (i > 0)
         content = new StringBuffer(new String(by, "UTF-8"));
      else
         content = new StringBuffer("");
      in.close();
      return content;
   }
   
   /**
    * 读取文件里的内容
    * 
    * @param path
    *           文件路径
    * @return 内容
    * @throws IOException
    *            文件找不到时， 抛出异常
    */
   public static StringBuffer readFile(File file) throws IOException {
      StringBuffer content = null;
      InputStream in = new FileInputStream(file);
      byte[] by = new byte[in.available()];
      int i = in.read(by, 0, in.available());
      if (i > 0)
         content = new StringBuffer(new String(by, "UTF-8"));
      else
         content = new StringBuffer("");
      in.close();
      return content;
   }
   
   /**
    * 读取文件里的内容
    * 
    * @param path
    *           文件路径
    * @return 内容
    * @throws IOException
    *            文件找不到时， 抛出异常
    */
   public static String readFiletoString(String path) throws IOException {
      StringBuffer content = null;
      InputStream in = new FileInputStream(new File(path));
      byte[] by = new byte[in.available()];
      int i = in.read(by, 0, in.available());
      if (i > 0)
         content = new StringBuffer(new String(by));
      else
         content = new StringBuffer("");
      in.close();
      return content.toString();
   }
   
   /**
    * 读取文件里的内容
    * 
    * @param path
    *           文件路径
    * @return 内容
    * @throws IOException
    *            文件找不到时， 抛出异常
    */
   public static String readFiletoString(File file) throws IOException {
      StringBuffer content = null;
      InputStream in = new FileInputStream(file);
      byte[] by = new byte[in.available()];
      int i = in.read(by, 0, in.available());
      if (i > 0)
         content = new StringBuffer(new String(by, "UTF-8"));
      else
         content = new StringBuffer("");
      in.close();
      return content.toString();
   }
   
   /**
    * 读取文件里的内容
    * 
    * @param path
    *           文件路径
    * @return 内容
    * @throws IOException
    *            文件找不到时， 抛出异常
    */
   public static String readFiletoString(InputStream is) throws IOException {
      StringBuffer content = null;
      InputStream in = is;
      byte[] by = new byte[in.available()];
      int i = in.read(by, 0, in.available());
      if (i > 0)
         content = new StringBuffer(new String(by, "UTF-8"));
      else
         content = new StringBuffer("");
      in.close();
      return content.toString();
   }
   
   /**
    * 创建文件
    * 
    * @param path
    *           文件路径
    * @return
    */
   public static boolean createFile(String path) {
      try {
         File file = new File(path);
         if (file.exists()) {
            return false;
         }
         else
            file.createNewFile();
         return true;
      }
      catch (Exception e) {
         return false;
      }
   }
   
   /**
    * 创建文件夹
    * 
    * @param path
    *           文件夹路径
    * @return
    */
   public static boolean createFolder(String path) {
      try {
         File file = new File(path);
         if (file.exists()) {
            return false;
         }
         else
            file.mkdirs();
         return true;
      }
      catch (Exception e) {
         return false;
      }
   }
   
   /**
    * 把内容写入文件
    * 
    * @param path
    *           写入路径
    * @param content
    *           内容
    * @param create
    *           文件不存在时， 是否创建
    * @return Boolean
    */
   public static boolean writeFile(String path, String content, boolean create) {
      boolean bl = false;
      File file = new File(path);
      OutputStream os = null;
      try {
         if (file.exists()) {
            os = new FileOutputStream(file);
         }
         else {
            if (create) {
               bl = file.createNewFile();
               os = new FileOutputStream(file);
            }
            else
               bl = false;
         }
         os.write(content.getBytes("UTF-8"));
         os.close();
      }
      catch (IOException e) {
         bl = false;
      }
      finally {
         try {
            if (os != null) {
               os.close();
            }
         }
         catch (IOException e) {
            bl = false;
         }
      }
      return bl;
   }
   
   /**
    * 把流写出文件
    * 
    * @param fileName
    *           文件名
    * @param savePath
    *           保存路径
    * @param fis
    *           输入流
    * @return 返回写入后的文件名
    * @throws IOException
    */
   public static String writeFile(String fileName, String savePath, InputStream fis) throws IOException {
      String path = savePath + "/" + fileName;
      FileOutputStream fos = null;
      try {
         fos = new FileOutputStream(path);
         byte[] buffer = new byte[1024];
         int len = 0;
         while ((len = fis.read(buffer)) > 0) {
            fos.write(buffer, 0, len);
         }
      }
      finally {
         try {
            if (fos != null) {
               fos.close();
            }
            if (fis != null) {
               fis.close();
            }
         }
         catch (IOException e) {
            throw e;
         }
      }
      return path;
   }
   
   /**
    * 上传文件并返回上传后的文件名
    * 
    * @param uploadFileName
    *           被上传的文件名称
    * @param savePath
    *           文件的保存路径
    * @param uploadFile
    *           被上传的文件
    * @return 返回上传后的文件名
    * @throws IOException
    */
   public static String writeFile(String uploadFileName, String savePath, File uploadFile) throws IOException {
      String path = savePath + "//" + uploadFileName;
      FileOutputStream fos = null;
      FileInputStream fis = null;
      try {
         fos = new FileOutputStream(path);
         fis = new FileInputStream(uploadFile);
         byte[] buffer = new byte[1024];
         int len = 0;
         while ((len = fis.read(buffer)) > 0) {
            fos.write(buffer, 0, len);
         }
      }
      finally {
         try {
            if (fos != null) {
               fos.close();
            }
            if (fis != null) {
               fis.close();
            }
         }
         catch (IOException e) {
            throw e;
         }
      }
      return path;
   }
   
   /**
    * 上传文件并返回上传后的文件名
    * 
    * @param uploadFileName
    *           被上传的文件名称
    * @param savePath
    *           文件的保存路径
    * @param uploadFilePath
    *           被上传的文件
    * @return 返回上传后的文件名
    * @throws IOException
    */
   public static String writeFile(String uploadFileName, String savePath, String uploadFilePath) throws IOException {
      File uploadFile = new File(uploadFilePath);
      String path = savePath + "//" + uploadFileName;
      FileOutputStream fos = null;
      FileInputStream fis = null;
      try {
         fos = new FileOutputStream(path);
         fis = new FileInputStream(uploadFile);
         byte[] buffer = new byte[1024];
         int len = 0;
         while ((len = fis.read(buffer)) > 0) {
            fos.write(buffer, 0, len);
         }
         
      }
      finally {
         try {
            if (fos != null) {
               fos.close();
            }
            if (fis != null) {
               fis.close();
            }
         }
         catch (IOException e) {
            throw e;
         }
      }
      return path;
   }
   
   /**
    * 给文件重命名
    * 
    * @param path
    *           源文件
    * @param name
    *           重命名为name
    */
   public static boolean renameFile(String path, String name) {
      try {
         File file = new File(path);
         if (file.exists()) {
            file.renameTo(new File(path.substring(0, path.indexOf(file.getName())) + name));
         }
         return true;
      }
      catch (Exception e) {
         return false;
      }
   }
   
   /**
    * 获得文件的扩展名
    * 
    * @param path
    *           文件路径
    * @return 扩展名
    */
   public static String getFileExtension(String path) {
      File file = new File(path);
      return file.getName().substring(file.getName().lastIndexOf('.') + 1);
   }
   
   /**
    * 删除文件，可以是单个文件或文件夹
    * 
    * @param fileName
    *           待删除的文件名
    * @return 文件删除成功返回true,否则返回false
    */
   public static boolean delete(String fileName) {
      File file = new File(fileName);
      if (!file.exists()) {
         logger.info("删除文件失败：" + fileName + "文件不存在");
         return false;
      }
      else {
         if (file.isFile()) {
            return deleteFile(fileName);
         }
         else {
            return deleteDirectory(fileName);
         }
      }
   }
   
   /**
    * 删除单个文件
    * 
    * @param fileName
    *           被删除文件的文件名
    * @return 单个文件删除成功返回true,否则返回false
    */
   public static boolean deleteFile(String fileName) {
      File file = new File(fileName);
      boolean f = false;
      try {
         file.delete();
         f = true;
      }
      catch (Exception e) {
         f = false;
         logger.info("删除文件失败：" + fileName + "文件不存在" + e);
      }
      finally {
         return f;
      }
   }
   
   /**
    * 删除目录（文件夹）以及目录下的文件
    * 
    * @param dir
    *           被删除目录的文件路径
    * @return 目录删除成功返回true,否则返回false
    */
   public static boolean deleteDirectory(String dir) {
      // 如果dir不以文件分隔符结尾，自动添加文件分隔符
      if (!dir.endsWith(File.separator)) {
         dir = dir + File.separator;
      }
      File dirFile = new File(dir);
      // 如果dir对应的文件不存在，或者不是一个目录，则退出
      if (!dirFile.exists() || !dirFile.isDirectory()) {
         logger.info("删除目录失败" + dir + "目录不存在！");
         return false;
      }
      boolean flag = true;
      // 删除文件夹下的所有文件(包括子目录)
      File[] files = dirFile.listFiles();
      for (int i = 0; i < files.length; i++) {
         // 删除子文件
         if (files[i].isFile()) {
            flag = deleteFile(files[i].getAbsolutePath());
            if (!flag) {
               break;
            }
         }
         // 删除子目录
         else {
            flag = deleteDirectory(files[i].getAbsolutePath());
            if (!flag) {
               break;
            }
         }
      }
      if (!flag) {
         logger.info("删除目录失败");
         return false;
      }
      
      // 删除当前目录
      if (dirFile.delete()) {
         logger.info("删除目录" + dir + "成功！");
         return true;
      }
      else {
         logger.info("删除目录" + dir + "失败！");
         return false;
      }
   }
   
   /**
    * 删除目录下的文件
    * 
    * @param dir
    *           被删除目录的文件路径
    * @return 目录删除成功返回true,否则返回false
    */
   public static boolean deleteDirectoryFiles(String dir) {
      // 如果dir不以文件分隔符结尾，自动添加文件分隔符
      if (!dir.endsWith(File.separator)) {
         dir = dir + File.separator;
      }
      File dirFile = new File(dir);
      // 如果dir对应的文件不存在，或者不是一个目录，则退出
      if (!dirFile.exists() || !dirFile.isDirectory()) {
         logger.info("删除目录失败" + dir + "目录不存在！");
         return false;
      }
      boolean flag = true;
      // 删除文件夹下的所有文件
      File[] files = dirFile.listFiles();
      for (int i = 0; i < files.length; i++) {
         // 删除子文件
         if (files[i].isFile()) {
            flag = deleteFile(files[i].getAbsolutePath());
            if (!flag) {
               break;
            }
         }
      }
      return flag;
   }
   
   /**
    * 复制文件
    * 
    * @param path
    *           源文件
    * @param newPath
    *           存放位置
    * @throws IOException
    *            有异常时，抛出异常
    */
   public static boolean copyFile(String path, String newPath) {
      try {
         File file = new File(path);
         if (file.exists() && file.isFile()) {
            writeFile(newPath, readFiletoString(path), true);
         }
         return true;
      }
      catch (Exception e) {
         e.printStackTrace();
         return false;
      }
   }
   
   /**
    * 剪切/移动 文件
    * 
    * @param path
    *           源文件
    * @param newPath
    *           要移动的位置
    * @throws IOException
    *            有异常时，抛出异常
    */
   public static boolean cutFile(String path, String newPath) {
      try {
         copyFile(path, newPath);
         deleteFile(path);
         return true;
      }
      catch (Exception e) {
         e.printStackTrace();
         return false;
      }
   }
   
   public static long doChecksum(InputStream is) {
      try {
         CheckedInputStream cis = null;
         // Computer CRC32 checksum
         cis = new CheckedInputStream(is, new CRC32());
         byte[] buf = new byte[128];
         while (cis.read(buf) >= 0) {
         }
         long checksum = cis.getChecksum().getValue();
         return checksum;
      }
      catch (IOException e) {
         e.printStackTrace();
         return 0l;
      }
   }
}
