/* jshint esversion: 6 */
import 'object-fit-images';
import 'picturefill';
import Cool from './components/cool';
import alertinfo from './components/debug/alertinfo';
import Pajax from 'pajax';
$(document).ready(() => {
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
