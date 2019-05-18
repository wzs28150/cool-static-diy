/* jshint esversion: 6 */
import 'object-fit-images';
import 'picturefill';
import Cool from './components/cool';
import alertinfo from './components/debug/alertinfo';
import Pajax from 'pajax';
$(document).ready(() => {
  if(token){
    // document.body.onbeforeunload = function(event) {
    //   var c = event || window.event;
    //   if (/webkit/.test(navigator.userAgent.toLowerCase())) {
    //     return "离开页面将导致数据丢失！";
    //   } else {
    //     c.returnValue = "离开页面将导致数据丢失！";
    //   }
    // }
  }

  window.promiseHost = "http://47.95.228.57:9091/mock/24";
  window.pajax = new Pajax();
  window.alertinfo = alertinfo;
  $.fn.serializeJson = function () {
    var serializeObj = {};
    $(this.serializeArray()).each(function () {
      serializeObj[this.name] = this.value;
    });
    return serializeObj;
  };
  const cool = new Cool();
});
