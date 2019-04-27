/* jshint esversion: 6 */
/*!
 * Index 首页模块  v0.0.1
 *
 * Copyright wzs
 * Released under the MIT license
 * https://github.com/wzs28150/cool-static-cli
 * Date: 2019-04-4
 */

import debug from '../components/debug/debug'; // 控制台调试

export default class Index {
  constructor(setNavActive) {
    // 设置导航第几个选中
    setNavActive(0);
    // 控制台输出信息 方便调试页面是否加载
    debug('index controller is load');
    pajax.get(promiseHost + '/index').then(res => res.auto()).then(body => {
      console.log(body);
    });
  }

  index() {

  }

}
