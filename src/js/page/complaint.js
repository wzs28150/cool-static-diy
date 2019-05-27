/* jshint esversion: 6 */
/*!
 * Complaint 投诉模块  v0.0.1
 *
 * Copyright wzs
 * Released under the MIT license
 * https://github.com/wzs28150/cool-static-cli
 * Date: 2019-04-4
 */

import debug from '../components/debug/debug'; // 控制台调试
import '../components/form/jquery.cssforms';
export default class Complaint {
  constructor(setNavActive, setData) {
    // 设置导航第几个选中
    setNavActive(0);
    // 控制台输出信息 方便调试页面是否加载
    debug('Complaint controller is load');
  }

  index() {
    this.notice();
    this.ad_pic_scroll();
    this.name_list();
    $('.beautify_input').cssSelect();
  }
  notice() {
    var swiper = new Swiper('.notice .swiper-container', {
      slidesPerView: "auto",
      spaceBetween: 10,
      speed: 2000,
      autoplay: 2000,
      loop: true
    });
  }
  ad_pic_scroll(){
    var ad_pic_scrollswiper = new Swiper('.ad_pic_scroll .swiper-container', {
      speed: 2000,
      autoplay: 2000,
      loop: true,
      pagination: '.ad_pic_scroll .swiper-pagination',
      paginationClickable: true,
      paginationBulletRender: function(swiper, index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
      }
    });
  }
  news_pic(){
    if($('.news_pic').length>0){
      var swiper = new Swiper('.news_pic .swiper-container', {
        speed: 2000,
        // autoplay: 2000,
        // loop: false,
        pagination: '.news_pic .swiper-pagination',
        paginationClickable: true
      });
    }

  }
  name_list(){
    $('body').off('click','.name-list .tit .inner a:not(.more)').on('click','.name-list .tit .inner a:not(.more)',function () {
      var i = $(this).index();
      $('.name-list .tit .inner a:not(.more)').removeClass('on');
      $(this).addClass('on');
      $('.name-list ul').removeClass('on');
      $('.name-list ul').eq(i).addClass('on');
    })
  }
}
