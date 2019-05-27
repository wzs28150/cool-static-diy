/* jshint esversion: 6 */
import 'object-fit-images';
import 'picturefill';
import Cool from './components/cool';
import alertinfo from './components/debug/alertinfo';
import Pajax from 'pajax';
$(document).ready(() => {
  if (token) {
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
  var param = {
      type: 0,
      key: ""
    },
    changeUrl;
  $('body').off('click', '.search_bar .search span').on('click', '.search_bar .search span', function () {
    $('.search_bar .search ul').toggleClass('on');
  })
  $('body').off('click', '.search_bar .search ul a').on('click', '.search_bar .search ul a', function () {
    var id = $(this).data('id'),
      text = $(this).html();
    $('.search_bar .search ul').removeClass('on');
    $('.search_bar .search span').html(text + '<i class="fa fa-caret-down"></i>');
    $('.search_bar .search span').data('id', id);
    param.type = id;
    changeUrl()
  })
  $('body').off('input propertychange', '.search_bar .search input').on('input propertychange', '.search_bar .search input', function () {
    var e = $(this).val();
    param.key = e;
    changeUrl()
  })
  changeUrl = function () {
    var url = $('.search_bar .search>a').data('url');
    $('.search_bar .search>a').attr('href', url + '?type=' + param.type + '&key=' + param.key);
  }
  const cool = new Cool();
});
