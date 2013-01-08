package com.sunnada.nms.dao.impl;

import java.sql.SQLException;
import java.util.Date;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.quartz.SchedulerException;

import com.sunnada.nms.dao.RepeaterPollCfgService;
import com.sunnada.nms.util.DateTimeUtils;
import com.sunnada.nms.util.StringUtils;
import com.sunnada.nms.util.schedule.QuartzUtils;

/**
 * @author huangwei
 * @version 创建时间：Jul 30, 2011 6:03:04 PM
 * 
 * 轮询设置 服务接口实现类
 */
public class RepeaterPollCfgServiceImpl extends BaseServiceImpl implements RepeaterPollCfgService {
   
   public Dto deleteItem(Dto pDto) {
      Dto outDto = new BaseDto();
      try {
         g4Dao.delete("reqpollcfg.deleteChoisedRepeater", pDto);
         g4Dao.delete("reqpollcfg.deletePollploy", pDto);
         g4Dao.delete("reqpollcfg.deletePollploy_moncode", pDto);
      }
      catch (Exception e) {
         e.printStackTrace();
         outDto.put("success", new Boolean(false));
         outDto.put("msg", "轮询策略删除失败！");
         return outDto;
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "轮询策略删除成功！");
      return outDto;
   }
   
   public Dto insertItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("reqpollcfg.checkPloyName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("轮询策略名称为:" + pDto.getAsString("pollployname"));
         sbmsg.append("  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      pDto.put("flag", "0");// 新增的轮询策略，启用标识都设置成0；
      g4Dao.insert("reqpollcfg.insertPollploy", pDto);
      outDto.put("msg", "轮询策略添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto queryItems(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("reqpollcfg.queryPollployForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("reqpollcfg.queryPollployForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto updateItem(Dto pDto) {
      Dto outDto = new BaseDto();
      int count = (Integer) g4Dao.queryForObject("reqpollcfg.checkPloyName", pDto);
      if (count > 0) {
         StringBuffer sbmsg = new StringBuffer();
         sbmsg.append("轮询策略名称为:" + pDto.getAsString("pollployname"));
         sbmsg.append("  已经存在，请重新输入！");
         outDto.put("msg", sbmsg.toString());
         outDto.put("success", new Boolean(false));
         return outDto;
      }
      g4Dao.update("reqpollcfg.updatePollploy", pDto);
      outDto.put("msg", "轮询策略修改成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto queryRepeaterForList(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("reqpollcfg.queryRepeaterForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("reqpollcfg.queryRepeaterForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto queryChoisedRepeaterForList(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      List codeList = g4Dao.queryForPage("reqpollcfg.queryChoisedRepeaterForList", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("reqpollcfg.queryChoisedRepeaterForCount", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   public Dto deleteChoisedRepeater(Dto pDto) {
      Dto outDto = new BaseDto();
      String[] arrChecked = pDto.getAsString("strChecked").split(",");
      for (int i = 0; i < arrChecked.length; i++) {
         pDto.put("repeaterid", arrChecked[i]);
         try {
            g4Dao.delete("reqpollcfg.deleteChoisedRepeater", pDto);
         }
         catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "轮询站点删除失败！");
            return outDto;
         }
      }
      outDto.put("success", new Boolean(true));
      outDto.put("msg", "轮询站点删除成功！");
      return outDto;
   }
   
   public Dto validatForBatchInsertChoisedRepeater(Dto pDto) {
      Dto dto = new BaseDto();
      List<Dto> dtoList = g4Dao.queryForList("reqpollcfg.validateMoniterParams", pDto);
      StringBuffer sb = new StringBuffer();
      for (Dto temp : dtoList) {
         sb.append("; [").append(temp.getAsString("paramcode")).append("]").append(temp.getAsString("paramname"));
      }
      if (sb.length() > 0) {
         dto.put("success", "false");
         dto.put("msg", sb.substring(1));
         return dto;
      }
      dto.put("success", "true");
      return dto;
   }
   
   public String queryMoniterParamsByPollployid(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = (Dto) g4Dao.queryForObject("reqpollcfg.queryMoniterParamsByPollployid", pDto);
      String paramcodes = dto == null ? null : dto.getAsString("moncodeids");
      if (!StringUtils.isEmpty(paramcodes)) {
         paramcodes = StringUtils.StringFormatSqlUseInParam(paramcodes);
      }
      else {
         paramcodes = "''";
      }
      return paramcodes;
   }
   
   public Dto insertChoisedRepeater(Dto pDto) {
      Dto outDto = new BaseDto();
      StringBuffer sb = new StringBuffer();
      StringBuffer msg = new StringBuffer();
      int failCount = 0;
      int sucCount = 0;
      String[] repeaterids = pDto.getAsString("strChecked").split(",");
      String[] channelcodes = pDto.getAsString("channelcode").split(",");
      String[] channelnames = pDto.getAsString("channelname").split(",");
      String[] stationnames = pDto.getAsString("stationnames").split(",");
      String paramcodes = null;
      for (int i = 0; i < repeaterids.length; i++) {
         pDto.put("repeaterid", repeaterids[i]);
         pDto.put("channelcode", channelcodes[i]);
         pDto.put("channelname", channelnames[i]);
         if (StringUtils.isEmpty(paramcodes)) {
            paramcodes = this.queryMoniterParamsByPollployid(pDto);
            pDto.put("paramcodes", paramcodes);
         }
         // 插入前进行有效性验证
         Dto dto = validatForBatchInsertChoisedRepeater(pDto);
         if ("true".equals(dto.getAsString("success"))) {
            g4Dao.insert("reqpollcfg.insertChoisedRepeater", pDto);
            sucCount++;
         }
         else {
            sb.append("; " + stationnames[i]);
            failCount++;
         }
      }
      msg.append("本次添加轮询的站点，成功：" + sucCount + "个," + "失败" + failCount + "个！");
      if (failCount > 0) {
         msg.append("<br><br>-------------添加失败的站点名称-------------：<br>");
         msg.append(sb.substring(1));
         msg.append("<br><br><font color=red>友情提示：</font>您可以单独点击站点，进行具体参数对比");
      }
      outDto.put("msg", msg.toString());
      outDto.put("success", new Boolean(true));
      
      return outDto;
   }
   
   public Dto updateItemForployEnabled(Dto pDto) {
      
      Dto outDto = new BaseDto();
      String flag = pDto.getAsString("flag");
      if ("0".equals(flag)) {
         g4Dao.update("reqpollcfg.updatePollploy", pDto);
         outDto.put("msg", "轮询策略停用成功！");
         outDto.put("success", new Boolean(true));
         return outDto;
      }
      else if ("1".equals(flag)) {
         
         /*
          * // comm接口是否有效 String comnunicaname =
          * pDto.getAsString("comnunicaname"); boolean success = true; success =
          * QuartzUtils.validationOfPort(pDto.getAsString("comnunicaname")); if
          * (!success) { success = false; outDto.put("msg", "轮询策略中的串口名称 " +
          * comnunicaname + " 与设备不一致，请重新设置！"); outDto.put("success", success); }
          */
         boolean success = true;
         if (success) {
            // 检查配置的监控量参数
            Dto dto = (Dto) g4Dao.queryForObject("reqpollcfg.checkPollMoncode", pDto);
            if (dto == null || StringUtils.isEmpty(dto.getAsString("moncodeids"))) {
               success = false;
               outDto.put("msg", "启用失败！<font color=red>系统检查到，您还给轮询策略配置“轮询监控量”！</font>");
               outDto.put("success", success);
            }
         }
         if (success) {
            // 统计轮询站点数量
            int count = (Integer) g4Dao.queryForObject("reqpollcfg.checkPollStationNum", pDto);
            if (count <= 0) {
               success = false;
               outDto.put("msg", "启用失败！<font color=red>系统检查到，您还未给该轮询策略添加“轮询站点”！</font>");
               outDto.put("success", success);
            }
         }
         if (success) {
            // 轮询时间
            Date pollbegintime = DateTimeUtils.parseDateSecondFormat(pDto.getAsString("pollbegintime"));
            long compareValue = DateTimeUtils.comparesDate(pollbegintime, new Date());
            if (compareValue < 0) {
               success = false;
               outDto.put("msg", "启用失败！<font color=red>开始轮询时间小于当前时间，</font>请重新设置！");
               outDto.put("success", success);
            }
         }
         if (success) {
            // 清除已经在任务队列中的轮询策略
            Dto inDto = new BaseDto();
            inDto.put("flag", "1");
            Dto dto = (Dto) g4Dao.queryForObject("reqpollcfg.queryPollployForList", inDto);
            if(dto!=null){
               String pollployid = dto.getAsString("pollployid");
               try {
                  QuartzUtils.stopJobForPoll(pollployid);
               }
               catch (SchedulerException e) {
                  e.printStackTrace();
               }
            }
            inDto.put("flag", "0");
            // 先还原pollplay中的flag=0，在进行启用设置 保证只有一个策略进行轮询操作
            g4Dao.update("reqpollcfg.updatePollploy", inDto);
            g4Dao.update("reqpollcfg.updatePollploy", pDto);
            outDto.put("msg", "轮询策略启用成功！");
            outDto.put("success", new Boolean(true));
         }
         return outDto;
      }
      return null;
   }
   
   /**
    * 查询监控量允许设置的参数
    * 
    * @throws SQLException
    */
   public Dto queryMoncodeListForSel(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      // 读取监控量参数
      Dto dto = (Dto) g4Dao.queryForObject("reqpollcfg.queryMoniterParamsByPollployid", pDto);
      String paramcodes = dto == null ? null : dto.getAsString("moncodeids");
      if (!StringUtils.isEmpty(paramcodes)) {
         paramcodes = StringUtils.StringFormatSqlUseInParam(paramcodes);
      }
      else {
         paramcodes = "''";
      }
      pDto.put("paramcodes", paramcodes);
      List codeList = g4Dao.queryForPage("reqpollcfg.queryMoncodeListForSel", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("reqpollcfg.queryMoncodeCountForSel", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /**
    * 查询已经设置好的监控量参数
    * 
    * @throws SQLException
    */
   public Dto queryMoncodeListForSet(Dto pDto) throws SQLException {
      Dto outDto = new BaseDto();
      // 读取监控量参数
      Dto dto = (Dto) g4Dao.queryForObject("reqpollcfg.queryMoniterParamsByPollployid", pDto);
      String paramcodes = dto == null ? null : dto.getAsString("moncodeids");
      if (!StringUtils.isEmpty(paramcodes)) {
         paramcodes = StringUtils.StringFormatSqlUseInParam(paramcodes);
      }
      else {
         paramcodes = "''";
      }
      pDto.put("paramcodes", paramcodes);
      List codeList = g4Dao.queryForPage("reqpollcfg.queryMoncodeListForSet", pDto);
      Integer totalCount = (Integer) g4Dao.queryForObject("reqpollcfg.queryMoncodeCountForSet", pDto);
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(codeList, totalCount, null));
      return outDto;
   }
   
   /**
    * 新增、修改轮询监控量参数
    */
   public Dto updateMoniterParams(Dto pDto) {
      Dto outDto = new BaseDto();
      Dto dto = (Dto) g4Dao.queryForObject("reqpollcfg.queryMoniterParamsByPollployid", pDto);
      String paramcodes = dto == null ? null : dto.getAsString("moncodeids");
      String oper_paramcodes = pDto.getAsString("paramcodes");
      if (dto != null && !StringUtils.isEmpty(dto.getAsString("pmid"))) {// 说明已经有监控参数记录了。
         String oper = pDto.getAsString("oper");
         if ("add".equals(oper)) {
            paramcodes = StringUtils.appendAssignStr(paramcodes, oper_paramcodes);
         }
         else if ("del".equals(oper)) {
            List<String> strList = StringUtils.StringArry2List(paramcodes.split(","));
            List<String> assignStrList = StringUtils.StringArry2List(oper_paramcodes.split(","));
            paramcodes = StringUtils.removeAssignStr(strList, assignStrList);
         }
         pDto.put("paramcodes", paramcodes);
         g4Dao.update("reqpollcfg.updateMoniterParams", pDto);
      }
      else {
         g4Dao.insert("reqpollcfg.insertMoniterParams", pDto);
      }
      outDto.put("msg", "轮询策略监控量参数添加成功！");
      outDto.put("success", new Boolean(true));
      return outDto;
   }
   
   public Dto validateMoniterParams(Dto pDto) {
      String paramcodes = this.queryMoniterParamsByPollployid(pDto);
      pDto.put("paramcodes", paramcodes);
      Dto dto = this.validatForBatchInsertChoisedRepeater(pDto);
      return dto;
   }
   
   public boolean updateItemForployStatus(Dto pDto) {
      int count = g4Dao.update("reqpollcfg.updateStatus", pDto);
      return count > 0 ? new Boolean(true) : new Boolean(false);
   }
}
