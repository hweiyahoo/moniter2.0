package com.sunnada.nms.message.bean;

import java.util.Map;

/**
 * @author huangwei
 * @version 创建时间：Nov 25, 2011 10:41:15 AM
 * 
 * 报文实体类
 */
public class Message extends AbstractMessage {
   /**
    * 序列化
    */
   private static final long serialVersionUID = 7962199991227756515L;
   private String            result;                                 // 返回值
   private String            ap_flag;                                // AP层标志
   private String            tp_flag;                                // TP层标志
   private String            repater_code;                           // 站点编号
   private String            device_code;                            // 设备编号
   private String            comm_seq;                               // 通讯层序列号
   private String            mutual_flag;                            // 交互标志
   private String            mcp_flag;                               // MCP层协议标识
   private String            cmd_flag;                               // 命令标识
   private String            resp_flag;                              // 命令应答标识
   
   private String            crc;                                    // CRC校验值
                                                                      
   public String getResult() {
      return result;
   }
   
   public void setResult(String result) {
      this.result = result;
   }
   
   public String getAp_flag() {
      return ap_flag;
   }
   
   public void setAp_flag(String ap_flag) {
      this.ap_flag = ap_flag;
   }
   
   public String getTp_flag() {
      return tp_flag;
   }
   
   public void setTp_flag(String tp_flag) {
      this.tp_flag = tp_flag;
   }
   
   public String getRepater_code() {
      return repater_code;
   }
   
   public void setRepater_code(String repater_code) {
      this.repater_code = repater_code;
   }
   
   public String getDevice_code() {
      return device_code;
   }
   
   public void setDevice_code(String device_code) {
      this.device_code = device_code;
   }
   
   public String getComm_seq() {
      return comm_seq;
   }
   
   public void setComm_seq(String comm_seq) {
      this.comm_seq = comm_seq;
   }
   
   public String getMutual_flag() {
      return mutual_flag;
   }
   
   public void setMutual_flag(String mutual_flag) {
      this.mutual_flag = mutual_flag;
   }
   
   public String getMcp_flag() {
      return mcp_flag;
   }
   
   public void setMcp_flag(String mcp_flag) {
      this.mcp_flag = mcp_flag;
   }
   
   public String getCmd_flag() {
      return cmd_flag;
   }
   
   public void setCmd_flag(String cmd_flag) {
      this.cmd_flag = cmd_flag;
   }
   
   public String getResp_flag() {
      return resp_flag;
   }
   
   public void setResp_flag(String resp_flag) {
      this.resp_flag = resp_flag;
   }
   
   public String getCrc() {
      return crc;
   }
   
   public void setCrc(String crc) {
      this.crc = crc;
   }
   
}
