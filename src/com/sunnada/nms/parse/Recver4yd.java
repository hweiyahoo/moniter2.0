package com.sunnada.nms.parse;


/**
 * @author zhangys
 * created Dec 9, 2011 all copyright reserved by sunnada 
 * desc:处理移动通讯协议发送解析逻辑的封装 
 */
public class Recver4yd extends AbsRecver {
   
   public Recver4yd(String recvStr) {
      this.recvStr = recvStr;
      dealRecvStr();
      init();
      setHeadLen(28);
   }
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#buildRecvBody()
    */
   protected void buildRecvBody() throws Exception{
      AidParser parser=new AidParser();
      int nStrLen = recvStr.length();
      int nPos = headLen;
      String sLenHex, sCode, sVal;
      while (nPos < nStrLen-6) {
         if(nPos+2>nStrLen-6)
            throw new Exception();
           sLenHex = recvStr.substring(nPos,nPos+2);
           int nOneLen = Integer.parseInt(sLenHex,16);
           if(nPos+nOneLen*2>nStrLen-6)
              throw new Exception();
           sCode = parser.highToLow(recvStr.substring(nPos+2,nPos+6));
           sVal = parser.highToLow(recvStr.substring(nPos+6,nPos+nOneLen*2));
           recvBodyMap.put(sCode,sVal);
           nPos += nOneLen * 2;
      }
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getCntPkg()
    */
   public int getCntPkg() {
      // TODO Auto-generated method stub
      return 0;
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getCurrPkg()
    */
   public int getCurrPkg() {
      // TODO Auto-generated method stub
      return 0;
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getProVer()
    */
   public String getProVer() {
      // TODO Auto-generated method stub
      return null;
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getStatSubId()
    */
   public String getStatSubId() {
      AidParser parser=new AidParser();
      String sTemp = parser.highToLow(recvStr.substring(14,16));
      setStationId( sTemp);
      return sTemp;
   }
   
   /* (non-Javadoc)
    * @see com.sunnada.nms.parse.AbsRecver#getStationId()
    */
   public String getStationId() {
      AidParser parser=new AidParser();
      String sTemp = parser.highToLow(recvStr.substring(6,14));
      setStationId( sTemp);
      return sTemp;
   }
   protected String trMeaning() {
      // TODO Auto-generated method stub
      return null;
   }
   protected String uniteCmd() {
      // TODO Auto-generated method stub
      return null;
   }
   @Override
   protected void judge() throws Exception{
      AidParser parser=new AidParser();
      if(!recvStr.startsWith("7E")&&!recvStr.endsWith("7E"))
         throw new Exception();
      if(recvStr.length()==2||recvStr.equals("7E7E"))
         throw new Exception();
      if(recvStr.length()<=16)      //16个字节以下的包不完整
         throw new Exception();
      String body=recvStr.substring(2,recvStr.length()-6);     //CRC 校验
      String crc=recvStr.substring(recvStr.length()-6,recvStr.length()-2);
      String temp=parser.crc(body, true);
      if(!temp.equals(crc))
         throw new Exception();
      
   }
   
}
