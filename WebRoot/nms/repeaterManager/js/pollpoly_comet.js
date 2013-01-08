function updatePloyGrid(msg) {
   var ploy_store = Ext.StoreMgr.lookup('ploy_store');
   if (ploy_store != null) {
      ploy_store.reload({
         callback : function(r, options, success) {
            if (success == false) {
               Ext.Msg.alert("ERROR", "There was an error parsing the Country Combo.");
            }
            else {
               if (msg == null) {
                  msg = "轮询完毕！"
               }
               Ext.Msg.alert("提示", msg);
            }
         }
      })
   }
};

/**
 * 推送握手
 */
function init() {
   dwr.engine.setActiveReverseAjax(true);
   PollployPush.handshake();
};
window.onload = init;
