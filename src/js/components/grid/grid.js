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
      $.pageRuler({
            v: ["360px", "960px", "1560px"]			
        });
    }
    this.grid = $('.grid-stack').data('gridstack');
  }

  index() {
    let that = this;
    // 加载板块
    this.load_grid();
    // 点击保存
    $('body').off('click', '#save-grid').on('click', '#save-grid', function () {
      that.save_grid();
    })
    // 重做
    $('body').off('click', '#load-grid').on('click', '#load-grid', function () {
      that.load_grid();
    })
    // 清空
    $('body').off('click', '#clear-grid').on('click', '#clear-grid', function () {
      that.clear_grid();
    })

    $('body').off('click', '#add-grid').on('click', '#add-grid', function () {
      that.add_new_widget();
    })

    that.delete_widget();
  }

  grid_list() {
    var swiper = new Swiper('.grid-list .swiper-container', {
      pagination: '.grid-list .swiper-pagination',
      slidesPerView: 3,
      paginationClickable: true,
      spaceBetween: 30
    });
  }


  load_grid() {
    var that = this;
    this.grid.remove_all();
    var items = GridStackUI.Utils.sort(this.serialized_data);
    _.each(items, function (node) {
      var str = '';
      $.get("./tpl/" + node.template + ".html", function (e) {
        var t = $.templates(e);
        $.get(promiseHost + "/get_widget_datalist?catid=" + node.catid, function (res) {
          if (res.code == 200) {
            if (that.type == 1) {
              str = '<div>' + t.render(res) + '<div class="ui-resizable-w"><div class="fa fa-edit"></div><div class="fa fa-trash"></div></div><div/>'
            } else {
              str = '<div data-gs-no-move="1" data-gs-no-resize="1">' + t.render(res) + '</div>'
            }
            that.grid.add_widget($(str), node.x, node.y, node.width, node.height, false, node.template, node.template_id, node.catid);
          }
        }, 'json')

      });

    }, that);
  }

  save_grid() {
    this.serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
      el = $(el);
      var node = el.data('_gridstack_node');
      console.log(node);
      return {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        template: node.template,
        template_id: node.template_id,
        catid: node.catid
      };
    }, this);
    console.log(JSON.stringify(this.serialized_data));
  }

  clear_grid() {
    this.grid.remove_all();
  }

  add_new_widget() {
    $('.grid-list').fadeToggle();
    $('#add-grid i').toggleClass('fa-angle-down').toggleClass('fa-angle-up')

    this.grid_list()
    // this.grid.add_widget(
    //
    // )
  }

  delete_widget() {
    var that = this;
    $('body').off('click', '.grid-stack-item  .fa-trash').on('click', '.grid-stack-item  .fa-trash', function () {
      that.grid.remove_widget($(this).parent().parent())
    })
  }
}
