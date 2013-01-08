Ext.namespace("Ext.ux");

Ext.ux.LogPanel = Ext.extend(Ext.Panel, {
   autoScroll : true,
   border     : false,
   style      : 'border-width:0 1px 0 0',
   log        : function() {
      var iconStyle = "nmsInfoIcon";
      var content;
      var oper;
      if (arguments.length > 1) {
         content = arguments[1];
         if (arguments[0] == "alarm") {
            iconStyle = "nmsAlarmIcon";
         }
         else if (arguments[0] == "error") {
            iconStyle = "nmsErrorIcon";
         }
         else if (arguments[0] == "debug") {
            iconStyle = "nmsDebugIcon";
         }
         else if (arguments[0] == "heart") {
            iconStyle = "nmsHeartIcon";
         }
      }
      else {
         content = arguments[0];
      }

      if (content.indexOf('发送') != -1) {
         oper = '[ <font color=blue> 发送 </font> ]';
      }
      else if (content.indexOf('接受') != -1) {
         oper = '[ <font color=green> 接受 </font> ]';
      }else{
      	oper = '.';
      }
      var markup =
                   [
                    '<div style="padding:5px !important;border-bottom:1px solid #ccc;"><span class="'
                       + iconStyle + '" style="font-weight:bold;">'+oper+'</span>',
                    Ext.util.Format.htmlEncode(content).replace(/\n/g, '<br/>').replace(/\s/g,
                                                                                        '&#160;'),
                    '</div>'].join(''), bd = this.body.dom;

      this.body.insertHtml('beforeend', markup);
      bd.scrollTop = bd.scrollHeight;
   },
   clear      : function() {
      this.body.update('');
      this.body.dom.scrollTop = 0;
   }
});