package com.sunnada.nms.message.exception;

import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;


/**
 * @author huangwei
 * @version 创建时间：Nov 25, 2011 11:21:27 AM
 * 
 * 类说明
 */
public class AcceptorException extends IOException {
   
   Throwable nested;
   
   public AcceptorException() {
      nested = null;
   }
   
   public AcceptorException(String msg) {
      super(msg);
      nested = null;
   }
   
   public AcceptorException(String msg, Throwable nested) {
      super(msg);
      this.nested = null;
      this.nested = nested;
   }
   
   public AcceptorException(Throwable nested) {
      
      this.nested = null;
      this.nested = nested;
   }
   
   public String getMessage() {
      if (nested != null)
         return super.getMessage() + " (" + nested.getMessage() + ")";
      else
         return super.getMessage();
   }
   
   public String getNonNestedMessage() {
      return super.getMessage();
   }
   
   public Throwable getNested() {
      if (nested == null)
         return this;
      else
         return nested;
   }
   
   public void printStackTrace() {
      super.printStackTrace();
      if (nested != null)
         nested.printStackTrace();
   }
   
   public void printStackTrace(PrintStream ps) {
      super.printStackTrace(ps);
      if (nested != null)
         nested.printStackTrace(ps);
   }
   
   public void printStackTrace(PrintWriter pw) {
      super.printStackTrace(pw);
      if (nested != null)
         nested.printStackTrace(pw);
   }
}
