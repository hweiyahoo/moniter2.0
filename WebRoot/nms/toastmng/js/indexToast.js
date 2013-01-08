/**
 * 页面初始化
 */
function init() {
   dwr.engine.setActiveReverseAjax(true); // 激活反转 重要
   toastManager.handshake();
};

function showToast(msg) {
   new Ext.ux.ToastWindow({
      title   : '提示窗口',
      iconCls : 'commentsIcon',
      html    : msg
   }).show(document);
};

function changeMessageIconsClass(iconClass) {
   var messageButton = Ext.getCmp('MessageButton');
   messageButton.setIconClass(iconClass);
}

window.onload = init;// 页面加载完毕后执行初始化方法init
