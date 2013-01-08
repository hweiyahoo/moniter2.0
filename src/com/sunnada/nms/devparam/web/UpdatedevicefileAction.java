package com.sunnada.nms.devparam.web;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.dao.UpdatedevicefileService;
import com.sunnada.nms.remoteUpdate.UpdateController;
import com.sunnada.nms.remoteUpdate.UpdateObject;
import com.sunnada.nms.util.BitUnit;

/**
 * @author xujinmei
 * @version ����ʱ�䣺Jul 26, 2011 5:27:13 PM
 * 
 * 远程升级 控制器���
 */
public class UpdatedevicefileAction extends BaseAction {// implements
   // GeneralAction
   // xujmclosebreak
   private static Logger           logger                  = Logger.getLogger(UpdatedevicefileAction.class);
   
   private UpdatedevicefileService updatedevicefileService = (UpdatedevicefileService) super.getService("UpdatedevicefileService");
   
   /**
    * 页面初始化���ʼ��
    */
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      
      return mapping.findForward("updatedevicefileInit");
   }
   
   /**
    * 获得某个站点的远程升级对象
    * 
    * @param sStationID，站点编号
    * @param sDevid，设备编号
    * @return，返回该站点升级实例
    */
   private UpdateObject getUpdateObj(String sStationID, String sDevid) {
      Object outObj = UpdateController.getInstance().get(sStationID, sDevid);
      if (outObj != null)
         return (UpdateObject) outObj;
      else
         return null;
      
   }
   
   // 如果正在升级，返回true；反之，false
   private boolean setUpdating(String sStationID, String sDevid) {
      if (UpdateController.getInstance().get(sStationID, sDevid) == null) {// 表示没有处于升级状态，则，加入升级状态值
         UpdateController.getInstance().add(sStationID, sDevid);
         return false;
      }
      else {
         return true; // 如果处于升级状态
      }
   }
   
   /**
    * 读取文件流
    * 
    * @param sPath，文件路径
    * @param sName，文件名
    * @return，文件流，如果未读到则，返回null
    */
   private BufferedInputStream getFile(String sPath) {
      try {
         FileInputStream in = new FileInputStream(sPath);
         return new BufferedInputStream(in);
      }
      catch (FileNotFoundException e) {
         // TODO Auto-generated catch block
         e.printStackTrace();
         return null;
      }
   }
   
   // mlb add 2011.9.14，开始升级功能
   public ActionForward doUpdate(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aFrm = (CommonActionForm) form;
      Dto inParam = aFrm.getParamAsDto(request);
      String returnString = "";
      String sStationID = inParam.getAsString("stationId");
      String sSubID = inParam.getAsString("statsubid");
      String sCrc = inParam.getAsString("crcStr");
      String sFilePath = inParam.getAsString("filePathStr");
      String sFileName = inParam.getAsString("fileNameStr");
      if (!("".equals(sStationID)) && !("".equals(sSubID))) {
         if (!setUpdating(sStationID, sSubID)) {
            // 如果该站点没有进行升级，则开始发送命令到后台
            returnString = String.format("%s %s站点开始进行升级,查询软件运行模式等参数", sStationID, sSubID);
            // 设置到远程升级对象的文件信息
            getUpdateObj(sStationID, sSubID).updateFlPrms(sCrc, getFile(sFilePath));
         }
         else {
            // 如果正在升级当中
            returnString = String.format("%s %s站点正在升级中", sStationID, sSubID);
         }
      }
      else {
         returnString = "请选择一个站点进行升级操作";
      }
      Dto outDto = new BaseDto();
      outDto.put("success", new Boolean(true));
      outDto.put("msg", returnString);
      String jsonStrList = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonStrList);
      
      return mapping.findForward(null);
   }
   
   private String timeRenameFile(String sFileName) {
      
      SimpleDateFormat dm = new SimpleDateFormat("yyMMddHHmmssSSS");
      int i = sFileName.lastIndexOf(".");
      String sNow = "";
      if (i > 0)
         sNow = sFileName.substring(0, i) + dm.format(new Date()) + sFileName.substring(i);
      else
         sNow = sFileName + dm.format(new Date());
      return sNow;
   }
   
   public ActionForward doUploadFile(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm cForm = (CommonActionForm) form;
      // 单个文件,如果是多个就cForm.getFile2()....支持最多5个文件
      FormFile myFile = cForm.getFile1();
      
      // 获取web应用根路径,也可以直接指定服务器任意盘符路径
      String savePath = getServlet().getServletContext().getRealPath("/") + "updateDeviceFile/";
      // String savePath = "d:/upload/";
      // 检查路径是否存在,如果不存在则创建之
      File file = new File(savePath);
      if (!file.exists()) {
         file.mkdir();
      }
      // 文件按天归档
      savePath = savePath + G4Utils.getCurDate() + "/";
      File file1 = new File(savePath);
      if (!file1.exists()) {
         file1.mkdir();
      }
      // 文件真实文件名
      String fileName = timeRenameFile(myFile.getFileName());
      // 我们一般会根据某种命名规则对其进行重命名
      
      File fileToCreate = new File(savePath, fileName);
      // 检查同名文件是否存在,不存在则将文件流写入文件磁盘系统
      if (!fileToCreate.exists()) {
         FileOutputStream os = new FileOutputStream(fileToCreate);
         os.write(myFile.getFileData());
         os.flush();
         os.close();
      }
      else {
         // 此路径下已存在同名文件,是否要覆盖或给客户端提示信息由你自己决定
         FileOutputStream os = new FileOutputStream(fileToCreate);
         os.write(myFile.getFileData());
         os.flush();
         os.close();
      }
      String vpath = savePath + fileName;
      // 求文件crc 测试...
      String vCRC = BitUnit.getFileCrc16(vpath);
      // 我们通常还会把这个文件的相关信息持久化到数据库
      Dto inDto = cForm.getParamAsDto(request);
      // System.out.println("xujmfilename:"+fileName);
      logger.info(fileName);
      inDto.put("filename", fileName);
      inDto.put("path", vpath);
      inDto.put("filecrc", vCRC);
      Dto outDto = updatedevicefileService.doUpload(inDto);
      outDto.put("success", new Boolean(true));
      outDto.put("filename", fileName);
      outDto.put("path", vpath);
      outDto.put("filecrc", vCRC);
      outDto.put("msg", "文件上传成功");
      String jsonStrList = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   public ActionForward cancle(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aFrm = (CommonActionForm) form;
      Dto inParam = aFrm.getParamAsDto(request);
      
      String sStationID = inParam.getAsString("stationId");
      String sSubID = inParam.getAsString("statsubid");
      String returnString = "";
      if (!("".equals(sStationID)) && !("".equals(sSubID))) {
         if (!setUpdating(sStationID, sSubID))
            // 如果该站点没有进行升级
            returnString = String.format("%s %s站点发送停止升级命令", sStationID, sSubID);
         else
            // 如果正在升级当中
            returnString = String.format("%s %s站点正在升级中，发送停止升级命令", sStationID, sSubID);
         getUpdateObj(sStationID, sSubID).stopUpdate();
      }
      else {
         returnString = "请选择一个站点进行升级操作";
      }
      
      Dto outDto = new BaseDto();
      outDto.put("success", new Boolean(true));
      outDto.put("msg", returnString);
      String jsonStrList = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
   
   /**
    * 查询文件列表
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto inDto = aForm.getParamAsDto(request);
      // SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
      // String uploaddatetile = df.format(new Date());
      // inDto.put("uploaddatetile", uploaddatetile);
      Dto outDto = this.updatedevicefileService.queryItems(inDto);
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
   }
}
