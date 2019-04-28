/* jshint esversion: 6 */
/*!
 * grid 自定义拖拽模块模块  v0.0.1
 *
 * Copyright wzs
 * Released under the MIT license
 * https://github.com/wzs28150/cool-static-cli
 * Date: 2019-04-4
 */

// import debug from '../components/debug/debug'; // 控制台调试

export default class Grid {
  constructor(data, type) {
    let options = {

    };
    $('.grid-stack').gridstack(options);
    this.serialized_data = data;
    this.type = type;
    if (this.type == 1) {
      $('body').addClass('diy');
    }
    this.grid = $('.grid-stack').data('gridstack');
  }

  index() {
    let that = this;
    // 加载板块
    this.load_grid();
    // 点击保存
    $('body').off('click','#save-grid').on('click','#save-grid',function () {
      that.save_grid();
    })
    // 重做
    $('body').off('click','#load-grid').on('click','#load-grid',function () {
      that.load_grid();
    })
    // 清空
    $('body').off('click','#clear-grid').on('click','#clear-grid',function () {
      that.clear_grid();
    })
  }
  load_grid() {
    this.grid.remove_all();
    var items = GridStackUI.Utils.sort(this.serialized_data);
    _.each(items, function (node) {
      var str = '';
      if (this.type == 1) {
        str = '<div><div class="grid-stack-item-content"  /><div class="ui-resizable-w"><div class="fa fa-edit"></div><div class="fa fa-trash"></div></div><div/>'
      } else {
        str = '<div data-gs-no-move="1" data-gs-no-resize="1"><div class="grid-stack-item-content"  /><div/>'
      }

      this.grid.add_widget($(str),
        node.x, node.y, node.width, node.height);
    }, this);
  }

  save_grid() {
    this.serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      return {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height
      };
    }, this);
    console.log(JSON.stringify(this.serialized_data));
  }

  clear_grid() {
    this.grid.remove_all();
  }

  add_new_widget() {
    this.widgets.push({
      x: 0,
      y: 0,
      width: Math.floor(1 + 3 * Math.random()),
      height: Math.floor(1 + 3 * Math.random()),
      auto_position: true
    });
  }

  delete_widget(){
    
  }
}
