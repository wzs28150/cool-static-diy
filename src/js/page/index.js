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
  constructor(setNavActive, setData) {
    // 设置导航第几个选中
    setNavActive(0);
    // 控制台输出信息 方便调试页面是否加载
    debug('index controller is load');
    let that = this;
    pajax.get(promiseHost + '/index', {
      headers: {
        token: token
      }
    }).then(res => res.auto()).then(res => {
      if (res.code == 200) {
        let data = res.data;
        that.serialized_data = data.serialized_data;
        setData(data.serialized_data, data.diy);
      }
    });
  }

  index() {

  }

}
