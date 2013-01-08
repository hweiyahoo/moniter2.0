var $j = jQuery.noConflict();

jQuery.fn.countDown = function(settings, to) {
   if (!to && to != settings.endNumber) {
      to = settings.startNumber;
   }
   this.data("CR_currentTime", to);
   $j(this).text(to).animate({
      "none" : "none"
   }, settings.duration, '', function() {
      if (to > settings.endNumber + 1) {
         $j(this).countDown(settings, to - 1);
      }
      else {
         settings.callBack(this);
      }
   });
   return this;
};
// ��ʱ&&���¼�ʱ
jQuery.fn.CRcountDown = function(settings) {
   settings = jQuery.extend({
      startNumber : 10,
      endNumber   : 0,
      duration    : 1000,
      callBack    : function() {
      }
   }, settings);
   this.data("CR_duration", settings.duration);
   this.data("CR_endNumber", settings.endNumber);
   this.data("CR_callBack", settings.callBack);
   return this.stop().countDown(settings);
};
// ��ʱ��ͣ
jQuery.fn.pause = function(settings) {
   return this.stop();
};
// ��ͣ�����¿�ʼ
jQuery.fn.reStart = function() {
   return this.pause().CRcountDown({
      startNumber : this.data("CR_currentTime"),
      duration    : this.data("CR_duration"),
      endNumber   : this.data("CR_endNumber"),
      callBack    : this.data("CR_callBack")
   });
};
