/**
 * 公共阅读
 * 
 * @param {}
 *           receive_id 接受主键
 */
function readNotice(receive_id) {
   var noticeShowWindow = new Ext.Window({
      layout      : 'fit',
      width       : 650,
      height      : 450,
      maximizable : true,
      resizable   : true,
      border      : false,
      bodyBorder  : false,
      autoScroll  : true,
      closeAction : 'close',
      modal       : true,
      title       : '查看通告',
      iconCls     : 'group_linkIcon',
      buttonAlign : 'right',
      constrain   : true,
      // frame : false,
      autoLoad    : {
         url        : './receive.ered?reqCode=showNotice&datetime=' + new Date().getTime(),
         text       : '引擎正在驱动页面,请等待...',
         discardUrl : false,
         nocache    : false,
         scripts    : true,
         params     : {
            receive_id : receive_id
         }
      }
   });
   noticeShowWindow.show();
};