package com.sunnada.nms.repeaterManager.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.sunnada.nms.comm.serial.SerialConnection;
import com.sunnada.nms.dao.BtnConnectClickService;
import com.sunnada.nms.dao.ComDataService;
import com.sunnada.nms.dao.DeviceMagService;
import com.sunnada.nms.message.analysisbag.AbstractAnaly;
import com.sunnada.nms.modem2.ModemService;
import com.sunnada.nms.parse.AbsSender;
import com.sunnada.nms.parse.AidParser;
import com.sunnada.nms.parse.Sender4yd;
import com.sunnada.nms.rclick.web.BtnConnectClickAction;
import com.sunnada.nms.socket2.MinaServer;
import com.sunnada.nms.util.Constant;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.InstructionBean;
import com.sunnada.nms.util.RepeaterTree;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.action.GeneralAction;
import com.sunnada.nms.util.sys.DMParamPush;

/**
 * @author linxingyu
 * @version 创建时间：2011-7-21 下午03:19:31 类说明 主页面
 */

public class DeviceMagAction extends BaseAction implements GeneralAction {
   
   private static Logger           logger                 = Logger.getLogger(DeviceMagAction.class);
   
   private static DeviceMagService        deviceMagService       = (DeviceMagService) SpringBeanLoader.getSpringBean("deviceMagService");
   private BtnConnectClickService  btnConnectClickService = (BtnConnectClickService) super.getService("btnConnectClickService");
   private static ComDataService   cdService              = (ComDataService) SpringBeanLoader.getSpringBean("ComDataService");
   private static SerialConnection connection             = null;
   
   public ActionForward deleteItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      // TODO Auto-generated method stub
      return null;
   }
   
   public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      return mapping.findForward("mainView");
   }
   
   public ActionForward insertItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      int count = (Integer) requestDto.getAsInteger("child");// 子机个数
      String statName = requestDto.get("proText").toString() + requestDto.get("cityText").toString();// 拼接基站名称
      requestDto.put("statsubid", "00");
      if (!deviceMagService.repeate(requestDto)) {
         write("{success:false,msg:'站点编号和设备编号不可重复'}", response);
         return mapping.findForward(null);
      }
      // 新增主机
      Dto infoDto = new BaseDto();
      infoDto.put("parentrepid", 0);
      infoDto.put("protype", requestDto.get("protype").toString());
      infoDto.put("devicetype", requestDto.get("mainDevice").toString());
      infoDto.put("stationid", requestDto.get("stationid").toString());
      infoDto.put("statsubid", "00");
      infoDto.put("stationname", statName + "主机");
      infoDto.put("province", requestDto.get("province").toString());
      infoDto.put("city", requestDto.get("city").toString());
      deviceMagService.insertItem(infoDto);
      Dto result = deviceMagService.getLastID();
      String id = result.getAsString("id"); // 获取主机id
      id = id.substring(id.indexOf("=") + 1, id.length() - 1);
      // 新增子机
      for (int i = 1; i <= count; i++) {
         infoDto = new BaseDto();
         infoDto.put("protype", requestDto.get("protype").toString());
         infoDto.put("devicetype", requestDto.get("sonDevice").toString());
         infoDto.put("stationid", requestDto.get("stationid").toString());
         infoDto.put("statsubid", StringUtils.complete((Integer.toHexString(i)).toUpperCase(), "0", 2));
         infoDto.put("stationname", statName + "从机" + i);
         infoDto.put("province", requestDto.get("province").toString());
         infoDto.put("city", requestDto.get("city").toString());
         infoDto.put("parentrepid", id);
         deviceMagService.insertItem(infoDto);
      }
      write("{success:true}", response);
      return mapping.findForward(null);
   }
   
   public ActionForward queryItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.queryItems(requestDto);
      String json = result.getAsString("page");
      write(json, response);
      return mapping.findForward(null);
   }
   
   public ActionForward updateItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      if (!deviceMagService.isHost(requestDto)) {// 如果是从机
         String statsubid = requestDto.getAsString("statsubid");
         if ("00".equals(statsubid)) {
            write("{success:false,msg:'从机设备编号不可为00'}", response);
            return mapping.findForward(null);
         }
         else if ("FF".equals(statsubid)) {
            write("{success:false,msg:'从机设备编号不可为FF'}", response);
            return mapping.findForward(null);
         }
      }
      else {
         String statsubid = requestDto.getAsString("statsubid");
         int num = requestDto.getAsInteger("num");
         if (!statsubid.equals("00") && !statsubid.equals("FF")) {
            write("{success:false,msg:'主机设备编号只可为00或FF'}", response);
            return mapping.findForward(null);
         }
         else if (num != 0 && statsubid.equals("FF")) {
            write("{success:false,msg:'该主机含有从机，不可设置为FF'}", response);
         }
      }
      if (deviceMagService.repeate(requestDto)) {
         String flag = requestDto.getAsString("flag");
         Dto result = deviceMagService.updateItem(requestDto);// 修改自身
         if ("1".equals(flag)) {
            // 修改子机
            deviceMagService.updateSub(requestDto);
         }
         // String old=requestDto.getAsString("oldStationid");
         // PooledConnectHandler.changeKey(old,
         // requestDto.getAsString("stationid"));
         StringBuffer msg = new StringBuffer();
         msg.append("{success:true,msg:'修改成功'}");
         write(msg.toString(), response);
         deviceMagService.updateStationid(requestDto);// 修改repeaterparam中的站点编号
         deviceMagService.updateStatsubid(requestDto);// 修改repeaterparam中的设备编号
      }
      else {
         write("{success:false,msg:'站点编号和设备编号不可重复'}", response);
      }
      return mapping.findForward(null);
   }
   
   /**
    * 
    * 下位机树形结构
    */
   public ActionForward createTree(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      RepeaterTree repeaterTree = new RepeaterTree();
      Dto dto = deviceMagService.getAllProvinces();
      StringBuffer tree = new StringBuffer("[");
      Dto pDto;
      Map map;
      List list = (List) dto.get("tree");
      Iterator it = list.iterator();
      while (it.hasNext()) {
         map = (Map) it.next();
         Map map1;
         String pid = map.get("pid").toString();
         String id = map.get("id").toString();
         String name = map.get("name").toString();
         tree.append("{id:'X" + id + "',text:'" + name + "',flag:'prov',children:["); // 省市节点ID前加X，区别于主机ID
         pDto = new BaseDto();
         pDto.put("id", id);
         Dto dto1 = deviceMagService.getCitysByPro(pDto);
         List list1 = dto1.getAsList("citys");
         Iterator it1 = list1.iterator();
         while (it1.hasNext()) {
            map1 = (Map) it1.next();
            tree.append("{id:'Y" + map1.get("parent").toString() + "_" + map1.get("id").toString() + "',text:'" + map1.get("name").toString() + "',flag:'city',children:[");
            repeaterTree.tree = tree;
            buildConnsTree("0", map1.get("id").toString(), map.get("id").toString(), deviceMagService, repeaterTree);
            tree = repeaterTree.tree;
            tree.deleteCharAt(tree.length() - 1);
            tree.append("]},");
         }
         tree.deleteCharAt(tree.length() - 1);
         tree.append("]},");
      }
      tree.deleteCharAt(tree.length() - 1);
      tree.append("]");
      write(tree.toString(), response);
      return mapping.findForward(null);
      
   }
   
   private void buildConnsTree(String parent, String city, String province, DeviceMagService deviceMagService, RepeaterTree tree) {
      StringBuffer temp = new StringBuffer();
      Dto pDto = new BaseDto();
      pDto.put("parentrepid", parent);
      pDto.put("city", city);
      pDto.put("province", province);
      Dto result = deviceMagService.getRepeater(pDto);
      List list = result.getAsList("repeater");
      if (list != null) {
         Iterator it = list.iterator();
         while (it.hasNext()) {
            Map map = (Map) it.next();
            pDto = new BaseDto();
            pDto.put("parentrepid", map.get("id").toString());
            pDto.put("city", city);
            Dto result1 = deviceMagService.getRepeater(pDto); // 判断当前下位机是否还有子机
            List list1 = result1.getAsList("repeater");
            if (list1.size() != 0) { // 存在子机
               tree.tree.append("{id:'" + map.get("id").toString() + "',text:'" + map.get("name").toString() + "',flag:'host',leaf:false,children:[");
               Iterator it1 = list1.iterator();
               while (it1.hasNext()) {
                  Map map1 = (Map) it1.next();
                  tree.tree.append("{id:'" + map1.get("id").toString() + "',text:'" + map1.get("name").toString() + "',flag:'sub',leaf:true},");
               }
               tree.tree.deleteCharAt(tree.tree.length() - 1);// 修正json格式
               tree.tree.append("]},");
            }
            else {// 不存在子机
               tree.tree.append("{id:'" + map.get("id").toString() + "',text:'" + map.get("name").toString() + "',leaf:true},");
            }
         }
      }
   }
   
   /**
    * 
    * 查询下位机status信息
    */
   public ActionForward status(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      StringBuffer parameter = new StringBuffer();
      // String id = requestDto.getAsString("id");
      // String flag = requestDto.getAsString("type");
      // Dto pDto = new BaseDto();
      // pDto.put("id", id);
      // pDto.put("flag", flag);
      Dto result = deviceMagService.getParamenterCount(requestDto);
      String temp = result.getAsString("count"); // 获取总数
      Integer count = Integer.parseInt(temp.substring(temp.indexOf(":") + 1, temp.length() - 1));
      result = deviceMagService.getParamenter(requestDto);
      parameter.append(JsonHelper.encodeList2PageJson(result.getAsList("parameter"), count, null));
      write(parameter.toString(), response);
      return mapping.findForward(null);
      
   }
   
   /**
    * 
    * 根据协议取设备类型
    */
   public ActionForward device(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      StringBuffer device = new StringBuffer("[");
      Dto result = deviceMagService.getDeviceByProtocol(requestDto);
      List list = result.getAsList("device");
      Iterator it = list.iterator();
      while (it.hasNext()) {
         Map map = (Map) it.next();
         device.append("['" + map.get("devicetype").toString() + "','" + map.get("hardname").toString() + "'],");
      }
      device.deleteCharAt(device.length() - 1);
      device.append("]");
      write(device.toString(), response);
      return mapping.findForward(null);
   }
   
   public ActionForward information(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      StringBuffer device = new StringBuffer();
      Dto result = deviceMagService.getInformationById(requestDto);
      String jsonString = result.getAsString("jsonStrList");
      response.getWriter().write(jsonString);
      // List list=result.getAsList("information");
      // Iterator it=list.iterator();
      // while(it.hasNext()){
      // Map map=(Map)it.next();
      // device.append("{success:true,id:'"+map.get("inforamtion")+"',tel:'"+map.get("StatTel").toString()+"'");
      // }
      // write(device.toString(), response);
      return mapping.findForward(null);
   }
   
   /**
    * 获取下位机全部信息
    */
   public ActionForward getAllFields(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      StringBuffer information = new StringBuffer();
      Dto result = deviceMagService.getAllInforamtion(requestDto);
      String jsonString = result.getAsString("jsonObject");
      // jsonString="{protype:'60',stationname:'福建省厦门从机2',devicetype:'34',province:'14',city:'02',stationid:'14020004',statsubid:'02',stattel:'null',ip:'null',setdate:'null',basestatcode:'null',site:'null',serID:'null',channelname:'null',x:'0',y:'0',note:'null'}";
      // jsonString="{success:true,rows:["+jsonString+"]}";
      write(jsonString, response);
      return mapping.findForward(null);
   }
   
   /**
    * 获取省市下的下位机总数
    */
   public ActionForward getCount(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.getRepeaterCount(requestDto);
      String json = result.getAsString("count");
      write(json, response);
      return mapping.findForward(null);
      
   }
   
   /**
    * 获取子机个数
    */
   public ActionForward getSubCount(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.getSubCount(requestDto);
      String count = result.getAsString("count");
      count = count.substring(count.indexOf(":") + 1, count.length() - 1);
      int num = Integer.parseInt(count);
      if (num == 0) {
         write("{success:true,nohint:false,msg:'该主机的类型是没有子机的,是否要确定添加子机？'}", response);
      }
      else if (num > 4 && num < 64) {
         write("{success:true,nohint:false,msg:'子机的个数已经大于4，是否确认？'}", response);
      }
      else if (num <= 4 && num > 0) {
         write("{success:true,nohint:true,msg:''}", response);
      }
      else if (num >= 64) {
         write("{success:false,msg:'子机的个数不能大于64'}", response);
      }
      return mapping.findForward(null);
   }
   
   public ActionForward subCount(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.getSubCount(requestDto);
      String count = result.getAsString("count");
      count = count.substring(count.indexOf(":") + 1, count.length() - 1);
      write(count, response);
      return mapping.findForward(null);
   }
   
   /**
    * 根据主机获取子机设备
    */
   public ActionForward getDevices(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.getSubDevice(requestDto);
      String json = result.getAsString("list");
      write(json, response);
      return mapping.findForward(null);
   }
   
   /**
    * 新增单个子机
    */
   public ActionForward addSub(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.getSubInfo(requestDto);
      List list = result.getAsList("list");
      if (list.size() == 0) {// 不存在子机时，特殊处理
         Dto pDto = new BaseDto();
         Dto info = new BaseDto();
         pDto.put("repeaterid", requestDto.get("parentrepid"));
         Dto result1 = deviceMagService.getAllInforamtion(pDto);// 根据主机信息生成从机信息
         Object obj = result1.get("list");// 获取主机信息,多余的信息不作处理
         List list1 = (List) obj;
         Map map = (Map) list1.get(0);
         Set keySet = map.entrySet();
         Iterator it1 = keySet.iterator();
         while (it1.hasNext()) {
            Map.Entry tempMap = (Map.Entry) it1.next();
            String key = (String) tempMap.getKey();
            Object value = tempMap.getValue();
            if (key.equals("stationname")) {// 处理stationname
               String name = (String) value;
               name = name.substring(0, name.length() - 2);
               name = name + "从机1";
               value = name;
            }
            info.put(key, value);
         }
         info.put("parentrepid", requestDto.get("parentrepid"));
         info.put("statsubid", StringUtils.complete((Integer.toHexString(1)).toUpperCase(), "0", 2));
         info.put("devicetype", requestDto.getAsString("devicetype"));
         deviceMagService.insertItem(info);
      }
      else {
         Iterator it = list.iterator();
         Dto info = new BaseDto();
         while (it.hasNext()) {// 遍历获取子机信息，直接复制到新子机中
            Map map = (Map) it.next();
            Set keySet = map.entrySet();
            Iterator it1 = keySet.iterator();
            int num = 0;
            while (it1.hasNext()) {
               Map.Entry tempMap = (Map.Entry) it1.next();
               String key = (String) tempMap.getKey();
               Object value = tempMap.getValue();
               if ("statsubid".equals(key)) {// 特别处理statsubid和stationname这两个字段
                  // num = Integer.parseInt((String) value);
                  // value = subId[num + 1];
                  num = Integer.parseInt((String) value, 16);
                  value = StringUtils.complete((Integer.toHexString(num + 1)).toUpperCase(), "0", 2);
               }
               else if ("stationname".equals(key)) {
                  String name = value.toString();
                  num = Integer.parseInt((String) map.get("statsubid"), 16);
                  int length = name.indexOf(String.valueOf(num));
                  name = name.substring(0, length);
                  name = name + String.valueOf(num + 1);
                  // value = value.substring(0,
                  // value.indexOf(String.valueOf(num)));
                  // value = value + String.valueOf(num + 1);
                  value = name;
               }
               info.put(key, value);
            }
         }
         info.remove("repeaterid");
         info.put("devicetype", requestDto.get("devicetype"));// devicetype从页面上获取
         deviceMagService.insertItem(info);
      }
      write("{success:true,msg:'新增成功'}", response);
      return mapping.findForward(null);
      
   }
   
   /**
    * 复制主机
    */
   public ActionForward copyHost(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      requestDto.put("channelcode", 13);
      deviceMagService.copyRepea(requestDto);// 复制主机
      Dto result = deviceMagService.getLastID();
      String id = result.getAsString("id"); // 获取主机id
      id = id.substring(id.indexOf("=") + 1, id.length() - 1);
      requestDto.put("newRepeaterid", id);
      deviceMagService.copyParam(requestDto);// 复制主机参数
      // 复制子机
      requestDto.put("parentrepid", requestDto.get("repeaterid"));
      result = deviceMagService.getRepeater(requestDto);
      List list = result.getAsList("repeater");// 获取子机list
      Iterator it = list.iterator();
      while (it.hasNext()) {
         Map map = (Map) it.next();
         Dto pDto = new BaseDto();
         pDto.put("parentrepid", id);
         pDto.put("repeaterid", map.get("id"));
         pDto.put("report", 1);
         deviceMagService.copyRepea(pDto);// 复制子机
         Dto temp = deviceMagService.getLastID();
         String id1 = temp.getAsString("id"); // 获取主机id
         id1 = id1.substring(id1.indexOf("=") + 1, id1.length() - 1);
         pDto = new BaseDto();
         pDto.put("repeaterid", map.get("id"));
         pDto.put("newRepeaterid", id1);
         deviceMagService.copyParam(pDto);// 复制参数
      }
      write("{success:true,msg:'复制成功'}", response);
      return mapping.findForward(null);
   }
   
   /**
    * 复制子机
    */
   public ActionForward copySub(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      deviceMagService.copyRepea(requestDto);// 复制子机
      Dto result = deviceMagService.getLastID();
      String id = result.getAsString("id"); // 获取子机id
      id = id.substring(id.indexOf("=") + 1, id.length() - 1);
      requestDto.put("newRepeaterid", id);
      deviceMagService.copyParam(requestDto);// 复制子机参数
      write("{success:true,msg:'复制成功'}", response);
      return mapping.findForward(null);
      
   }
   
   /**
    * 删除主机
    */
   public ActionForward deleHost(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      String flag = requestDto.getAsString("flag");
      // 删除主机
      deviceMagService.deleteItem(requestDto);// 删除下位机
      deviceMagService.deleParam(requestDto);// 删除下位机参数
      if (flag.equals("host")) {
         // 删除子机
         requestDto.put("parentrepid", requestDto.get("repeaterid"));
         Dto result = deviceMagService.getRepeater(requestDto);
         List list = result.getAsList("repeater");// 获取子机list
         Iterator it = list.iterator();
         while (it.hasNext()) {
            Map map = (Map) it.next();
            Dto pDto = new BaseDto();
            pDto.put("repeaterid", map.get("id"));
            deviceMagService.deleteItem(pDto);// 删除子机
            deviceMagService.deleParam(pDto);// 删除子机参数
         }
      }
      write("{success:true,msg:'删除成功'}", response);
      return mapping.findForward(null);
   }
   
   /**
    * 读取t_reflag中的数据
    */
   public ActionForward edit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto requestDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.queryReflag(requestDto);
      List list = result.getAsList("list");
      write(JsonHelper.encodeObject2Json(list), response);
      return mapping.findForward(null);
   }
   
   /**
    * yzz 获取连接标识
    * 
    * @param dto
    * @return
    */
   public ActionForward queryConnFlag(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto oDto = deviceMagService.queryConnFlag(pDto);
      Dto dto1 = deviceMagService.isOK(pDto);
      List list = oDto.getAsList("json");
      BaseDto dto = (BaseDto) list.get(0);
      String channelcode = dto.getAsString("channelcode");
      if ("13".equals(channelcode)) {
         String stationid = dto.getAsString("stationid");
         String statsubid = dto.getAsString("statsubid");
         if (!MinaServer.getMinaServer().isOnline(stationid)) {
            write("{connectflag:2}", response);// 不在线
         }
         else {
            if ("1".equals(dto1.getAsString("flag"))) {
               write("{connectflag:0}", response);// 当前有人正在操作该下位机
            }
            else {
               write("{connectflag:1}", response);// 连接正常
               // pDto.put("flag", "1");
               // deviceMagService.updateRepFlag(pDto);
            }
         }
      }
      else if ("01".equals(channelcode)) {
         write("{connectflag:1}", response);
      }
      else if ("03".equals(channelcode)) {
         if ("1".equals(dto1.getAsString("flag"))) {
            write("{connectflag:0}", response);// 当前有人正在操作该下位机
         }
         else {
            write("{connectflag:1}", response);
            // pDto.put("flag", "1");
            // deviceMagService.updateRepFlag(pDto);
         }
      }
      else {
         write("{connectflag:2}", response);// 不在线
      }
      return mapping.findForward(null);
   }
   
   /**
    * 实时设置与查询保存本地数据 告警页面专用
    */
   public void updateVal1Item(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto outDto = new BaseDto();
      String repeaterid = pDto.getAsString("repeaterid");
      List list1 = commonActionForm.getGridDirtyData(request);  
         for (int i = 0; i < list1.size(); i++) {
            BaseDto temp = (BaseDto) list1.get(i);
            temp.put("recid", temp.get("recid_able"));
            temp.put("uptime", DateTimeUtils.getDateSecondFormat());
            deviceMagService.updateVal1Item(temp);
         }
   }
   
   /**
    * 实时查询与设置返回值 告警页面专用
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward sendCommondReturn(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto outDto = new BaseDto();
      String repeaterid = pDto.getAsString("repeaterid");
      List list1 = commonActionForm.getGridDirtyData(request);
      String pcmd = pDto.getAsString("pcmd");
      String vResult = null;
      Map map=new HashMap();
      AidParser parser=new AidParser();
      
      List sendDataList =new ArrayList<byte[]>();
      if (pcmd.equals("03")) {
         updateVal1Item(mapping, form, request, response);
         for (int i = 0; i < list1.size(); i++) {
            BaseDto temp = (BaseDto) list1.get(i);
            String paramcode=temp.getAsString("paramcode_able");
            String value=temp.getAsString("val1");
            map.put(paramcode, defaultValue(repeaterid, paramcode, value));
         }
         AbsSender sender=new Sender4yd();
         sendDataList=sender.buildSendStr(repeaterid, pcmd, map);
        // sendDataList = sender.sendCommandData(repeaterid, buffer.toString(), pcmd, "", value.toString());
      }
      else {
         for (int i = 0; i < list1.size(); i++) {
            BaseDto temp = (BaseDto) list1.get(i);
            String paramcode=temp.getAsString("paramcode");
            String value= defaultValue(repeaterid, paramcode,"");
            value=parser.highToLow(value);
            map.put(paramcode, value);
            paramcode=temp.getAsString("paramcode_able");
            value=defaultValue(repeaterid, paramcode, "");
            value=parser.highToLow(value);
            map.put(paramcode, value);
         }
         AbsSender sender=new Sender4yd();
         sendDataList = sender.buildSendStr(repeaterid, pcmd, map);
      }
      // System.out.println(vResult);
      Dto info = btnConnectClickService.queryStationInfo(pDto);
      String chanelcode = info.getAsString("channelcode");
      String stationid = info.getAsString("stationid");
      String statsubid = info.getAsString("statsubid");
      if ("13".equals(chanelcode)) {
         sendCmdByTCP(stationid, sendDataList);
         push(sendDataList, stationid, statsubid, request.getSession().getId(), "tcp/ip或GPRS");
      }
      else if ("01".equals(chanelcode)) {
         sendCmdBySerial(sendDataList);
      }
      else if ("03".equals(chanelcode)) {
         String telephone = info.getAsString("stattel");
         sendCmdByModem(telephone, sendDataList);
         push(sendDataList, stationid, statsubid, request.getSession().getId(), "modem");
      }
      return mapping.findForward(null);
   }
   
   /**
    * 实时查询与设置保存数据库
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward updateVal1Item1(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      List<Dto> list = aForm.getGridDirtyData(request);
      Dto inDto = new BaseDto();
      inDto.put("uptime", DateTimeUtils.getDateSecondFormat());
      for (int i = 0; i < list.size(); i++) {
         inDto.put("recid", list.get(i).getAsString("recid"));
         inDto.put("val1", list.get(i).getAsString("val1"));
         this.deviceMagService.updateVal1Item(inDto);
      }
      Dto outDto = new BaseDto();
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "保存数据保存成功！");
      super.write(JsonHelper.encodeObject2Json(outDto), response);
      return mapping.findForward(null);
   }
   
   /**
    * yzz 实时查询与设置返回值
    * 
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
   public ActionForward sendCommondReturn1(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto outDto = new BaseDto();
      String repeaterid = pDto.getAsString("repeaterid");
      String paramcode = pDto.getAsString("paramcode");
      String pcmd = pDto.getAsString("pcmd");
      String value = pDto.getAsString("value");
      String vResult = null;
      boolean flag = false;
      Map map=new HashMap();  
      
      if ("03".equals(pcmd)) {
         //updateVal1Item1(mapping, form, request, response);
         String[] code = paramcode.split(",");
         String[] val = value.split(",");
         String stationid = null, statsubid = null;
         for (int i = 0; i < code.length; i++) {
            if ("0101".equals(code[i])) {
               stationid = val[i];
            }
            else if ("0102".equals(code[i])) {
               statsubid = val[i];
            }
         }
         if (!(stationid == null & statsubid == null)) {// 改动过 站点编号，设备编号 才进行判断
            flag = true;
            Dto result = deviceMagService.getAllInforamtion(pDto);
            result = (Dto) result.get("result");
            if (stationid == null)
               stationid = result.getAsString("stationid");
            if (statsubid == null)
               statsubid = result.getAsString("statsubid");
            Dto dto = new BaseDto();
            dto.put("stationid", stationid);
            dto.put("statsubid", statsubid);
            if (!deviceMagService.repeate(dto)) {
               write("{success:false,msg:'站点编号，设备编号不可重复！'}", response);
               return mapping.findForward(null);
            }
         }
         
      }
      
      List sendDataList =new ArrayList<byte[]>();
      if (pcmd.equals("03")) {
         //sendDataList = BitUnit.sendCommandData(repeaterid, paramcode, pcmd, "", value);
         StringTokenizer tokenizerCode=new StringTokenizer(paramcode,",");
         StringTokenizer tokenizerValue=new StringTokenizer(value,",");
         Dto dto=new BaseDto();
         dto.put("repeaterid", repeaterid);
         Dto result=deviceMagService.getInformationById(dto);
         result=(Dto)result.get("dto");
         while(tokenizerCode.hasMoreTokens()&&tokenizerValue.hasMoreTokens()){
            String code=tokenizerCode.nextToken();
            String val=tokenizerValue.nextToken();
            val=AbstractAnaly.getValue(result.getAsString("protype"), code, val, false);
            val=defaultValue(repeaterid, code, val);
            map.put(code, val);
         }
         AbsSender sender=new Sender4yd();
         sendDataList=sender.buildSendStr(repeaterid, pcmd, map);
      }
      else {
         StringTokenizer tokenizer = new StringTokenizer(paramcode, ",");
         while (tokenizer.hasMoreTokens()) {
             String code=tokenizer.nextToken();
             map.put(code, defaultValue(repeaterid, code, ""));
         }
         AbsSender sender=new Sender4yd();
         sendDataList = sender.buildSendStr(repeaterid, pcmd, map);
      }
      Dto info = btnConnectClickService.queryStationInfo(pDto);
      String chanelcode = info.getAsString("channelcode");
      String stationid = info.getAsString("stationid");
      String statsubid = info.getAsString("statsubid");
      if ("13".equals(chanelcode)) {
         sendCmdByTCP(stationid, sendDataList);
         push(sendDataList, stationid, statsubid, request.getSession().getId(), Constant.tcp);
      }
      else if ("01".equals(chanelcode)) {
         sendCmdBySerial(sendDataList);
      }
      else if ("03".equals(chanelcode)) {
         String telephone = info.getAsString("stattel");
         sendCmdByModem(telephone, sendDataList);
         push(sendDataList, stationid, statsubid, request.getSession().getId(), Constant.modem);
      }
      if (flag) {
         String[] code = paramcode.split(",");
         String[] val = value.split(",");
         String temp = "";
         Dto dto = new BaseDto();
         dto.put("repeaterid", repeaterid);
         for (int i = 0; i < code.length; i++) {
            if ("0101".equals(code[i])) {
               dto.put("stationid", val[i]);
            }
            else if ("0102".equals(code[i])) {
               dto.put("stationid", val[i]);
            }
         }
         deviceMagService.updateStationAndStatsub(dto);
      }
      return mapping.findForward(null);
   }
   
   /**
    * 设置站点编号
    */
   public ActionForward setStationid(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      String repeaterid = pDto.getAsString("repeaterid");
      String nStationid = pDto.getAsString("stationid");
      String nStatsubid = pDto.getAsString("statsubid");
      //ArrayList list = BitUnit.sendCommandData(repeaterid, "0101,0102", "03", "", nStationid + "," + nStatsubid);
      Dto info = btnConnectClickService.queryStationInfo(pDto);
      String chanelcode = info.getAsString("channelcode");
      if ("13".equals(chanelcode)) {
         String stationid = info.getAsString("stationid");
        // sendCmdByTCP(stationid, list);
      }
      return mapping.findForward(null);
   }
   
   public static boolean sendCmdByTCP(String stationID, List list) {
      return MinaServer.getMinaServer().sendMsg(stationID, list);
   }
   
   private void sendCmdBySerial(List list) {
      SerialConnection connection = BtnConnectClickAction.connection;
      for (int i = 0; i < list.size(); i++) {
         byte[] cmdByte = StringUtils.charTobyte((String) list.get(i));
         Dto dto = new BaseDto();
         dto.put("com", "COM");
         dto.put("cmddetail", (String) list.get(i));
         dto.put("insertdate", DateTimeUtils.getDateSecondFormat());
         dto.put("flag", "0");
         cdService.insertItem(dto);
         connection.SendCMD(cmdByte);
      }
   }
   
   public static void sendCmdByModem(String telephone, List list) {
      for (int i = 0; i < list.size(); i++) {
         String message=StringUtils.byteToStr((byte[])list.get(i));
         ModemService.getModemService().sendSms(telephone, message);
      }
   }
   
   /**
    * 判断是否可以读取监控列表
    */
   public ActionForward judge(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto dto = new BaseDto();
      dto.put("repeaterid", pDto.getAsString("repeaterid"));
      Dto result = deviceMagService.judge(dto);
      String flag = result.getAsString("flag");
      if ("".equals(flag)) {
         dto.put("flag", "0");
         deviceMagService.addFlag(dto);
         write("{flag:0}", response);
         return mapping.findForward(null);
      }
      flag = flag.substring(flag.indexOf("=") + 1, flag.length() - 1);
      if (flag.equals("0")) {
         dto.put("flag", "1");
         deviceMagService.updateFlag(dto);
         write("{flag:0}", response);
      }
      else if (flag.equals("1")) {
         write("{flag:1}", response);
      }
      else if (flag.equals("2")) {
         write("{flag:2}", response);
      }
      return mapping.findForward(null);
   }
   
   /**
    * 取消 查询操作
    */
   public ActionForward doCancelForQ(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      pDto.put("cancel", "0");
      pDto.put("flag", "0");
      deviceMagService.updateFlag(pDto);
      return mapping.findForward(null);
   }
   
   /**
    * 读取监控列表
    */
   public void readList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      String repeaterid = pDto.getAsString("repeaterid");
      // modify by huangwei
      boolean validatLoadParam = true;
      // 读取flag
      Dto resultDto = deviceMagService.judge(pDto);
      if ("1".equals(resultDto.getAsString("flag"))) {// 当前本站点查询操作已经被锁定
         String locktime = resultDto.getAsString("locktime");
         String currenttime = DateTimeUtils.getDateSecondFormat();
         PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.APP);
         int queryout = Integer.valueOf(pHelper.getValue("queryout", "8"));
         int missionValue = DateTimeUtils.getBetweenDayNumber(locktime, currenttime);
         if (missionValue > queryout) {// 之前锁定操作已经超时，现在正常执行当前查询，并清空临时表数据！
            deviceMagService.delRepeaterParamTemp(pDto);
            pDto.put("flag", "1");
            pDto.put("cancel", "0");
            pDto.put("locktime", DateTimeUtils.getDateSecondFormat());
            deviceMagService.updateFlag(pDto);
         }
         else {
            // 标识当前已经在查询了。页面提示查询等候，后台并不发送查询命令。带本地查询结束一并推到前台
            validatLoadParam = false;
         }
      }
      else {// 正常开始查询监控量
         deviceMagService.delRepeaterParamTemp(pDto);
         pDto.put("flag", "1");
         pDto.put("cancel", "0");
         pDto.put("locktime", DateTimeUtils.getDateSecondFormat());
         deviceMagService.updateFlag(pDto);
      }
      if (validatLoadParam) {
         Map map=new HashMap();
         map.put("0009", "0101");
         AbsSender sender=new Sender4yd();
         List list = sender.buildSendStr(repeaterid, "02", map);
         Dto info = btnConnectClickService.queryStationInfo(pDto);
         String chanelcode = info.getAsString("channelcode");
         String stationid = info.getAsString("stationid");
         String statsubid = info.getAsString("statsubid");
         if ("13".equals(chanelcode)) {
            sendCmdByTCP(stationid, list);
            push(list, stationid, statsubid, request.getSession().getId(), Constant.tcp);
         }
         else if ("01".equals(chanelcode)) {
            sendCmdBySerial(list);
         }
         else if (chanelcode.equals("03")) {
            String telephone = info.getAsString("stattel");
            sendCmdByModem(telephone, list);
            push(list, stationid, statsubid, request.getSession().getId(), Constant.modem);
         }
      }
   }
   
   /**
    * 获取存在的监控量
    */
   public ActionForward exit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.exit(pDto);
      String json = result.getAsString("params");
      write(json, response);
      return mapping.findForward(null);
   }
   
   /**
    * 获取不存在的监控量
    */
   public ActionForward noExit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto result = deviceMagService.noExit(pDto);
      String json = result.getAsString("params");
      write(json, response);
      return mapping.findForward(null);
   }
   
   /**
    * 判断当前连接是不是modem
    */
   public ActionForward isModem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws Exception {
      CommonActionForm commonActionForm = (CommonActionForm) form;
      Dto pDto = commonActionForm.getParamAsDto(request);
      Dto result = btnConnectClickService.queryStationInfo(pDto);
      if (result.getAsString("channelcode").equals("03")) {
         write("{flag:1}", response);// 表示当前modem连接中
      }
      else {
         write("{flag:2}", response);
      }
      return mapping.findForward(null);
   }
   
   /**
    * yzz 导入Excel站点信息到数据库
    * 
    * @throws IOException
    * 
    * @throws IOException
    */
   public ActionForward importExcel(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response) throws IOException {
      CommonActionForm aForm = (CommonActionForm) form;
      FormFile formFile = aForm.getTheFile();
      // 指定Excel字段名称
      String metaData = "protype,devicetype,temp,stationid,stationname,province,city,stattel";
      ExcelReader er;
      Dto outDto = null;
      try {
         er = new ExcelReader(metaData, formFile.getInputStream());
         List fileData = er.read(2);
         outDto = this.deviceMagService.importExcel(fileData);
      }
      catch (Exception e) {
         // e.printStackTrace();
         outDto = new BaseDto();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", "导入失败！请检查您选择的导入文件是否是我们提供的模版！");
      }
      String jsonString = JsonHelper.encodeObject2Json(outDto);
      response.getWriter().write(jsonString);
      return mapping.findForward(null);
   }
   
   // 推送
   public static void push(List list, String stationid, String statsubid, String sessionId, String type) {
      for (int i = 0; i < (list.size()); i++) {
         byte[] temp=(byte[])list.get(i);
         String vResult = StringUtils.byteToStr(temp);
         // logger.info("命令" + vResult);
         String packNum = vResult.substring(16, 20);
         AidParser parser=new AidParser();
         packNum = parser .highToLow(packNum);
         InstructionBean bean = new InstructionBean();
         bean.setSessionId(sessionId);
         bean.setStationid(stationid);
         bean.setStatsubid(statsubid);
         bean.setCmd(vResult);
         bean.setType(type);
         bean.setFlag("0");
         bean.setResult("00");
         Constant.map.put(packNum, bean);
         DMParamPush.getInstance().debugLogPanel(bean);
      }
   }
   
   public static String defaultValue(String repeatrid,String paramcode,String value){
      Dto dto=new BaseDto();
      dto.put("repeaterid", repeatrid);
      dto.put("paramcode", paramcode);
      Dto result=deviceMagService.queryDataLen(dto);
      int length=Integer.parseInt(result.getAsString("datalen"));
      String type=result.getAsString("datatype");
//      if(!"str".equals(type))
//         length=length*2;
      String temp="";
      temp=StringUtils.rComplete(value, "0", length*2);
      return temp;
   }
}
