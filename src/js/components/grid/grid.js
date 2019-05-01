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
      vertical_margin: 0,
      cell_height: 1
    };
    $('.grid-stack').gridstack(options);
    this.serialized_data = data;
    this.type = type;
    if (this.type == 1) {
      // 开启编辑模式
      $('body').addClass('diy').addClass('hasRuler');
      $.pageRuler({
        v: ["360px", "960px", "1560px"],
        h: ["98px"]
      });
    }
    this.grid = $('.grid-stack').data('gridstack');
  }

  index() {
    let that = this;
    // 加载板块
    this.load_grid();

    // 显示隐藏标尺
    $('body').off('click', '#show-ruler').on('click', '#show-ruler', function() {
      $.pageRulerToggle();
      $('body').toggleClass('hasRuler');
    })
    // 显示隐藏辅助线
    $('body').off('click', '#show-line').on('click', '#show-line', function() {
      $.lineToggle();
    })
    // 点击保存
    $('body').off('click', '#save-grid').on('click', '#save-grid', function() {
      that.save_grid();
    })
    // 重做
    $('body').off('click', '#load-grid').on('click', '#load-grid', function() {
      that.load_grid();
    })
    // 清空
    $('body').off('click', '#clear-grid').on('click', '#clear-grid', function() {
      that.clear_grid();
    })

    $('body').off('click', '#add-grid').on('click', '#add-grid', function() {
      that.add_new_widget();
    })

    that.delete_widget();
  }

  grid_list() {
    console.log(host + "/tpl/tpl.json");
    let str = "";
    $.getJSON(tplpath + '/tpl.json', function(result) {
      $.each(result.list, function(i, field) {
        str += '<div class="swiper-slide">';
        str += '  <div class="slide-inner" style="background-image:url(' + host + '/tpl/' + field.template + '/ico.jpg)">'
        str += '    <div class="bg wh-center">'
        str += '      <div>'
        str += '        <h2>' + field.title + '</h2>'
        str += '        <button type="button" name="button" data-template="' + field.template + '"><i class="fa fa-plus"></i>添加</button>'
        str += '      </div>'
        str += '    </div>'
        str += '  </div>'
        str += '</div>'
      });
      $('.grid-list .swiper-wrapper').html(str);
      var swiper = new Swiper('.grid-list .swiper-container', {
        pagination: '.grid-list .swiper-pagination',
        slidesPerView: 6,
        paginationClickable: true,
        spaceBetween: 20
      });
    });

  }


  load_grid() {
    var that = this;
    this.grid.remove_all();
    var items = GridStackUI.Utils.sort(this.serialized_data);
    _.each(items, function(node) {
      var str = '';
      $.get(tplpath + "/" + node.template + "/index.html", function(e) {
        let t = $.templates(e);
        $.get(promiseHost + "/get_widget_datalist?catid=" + node.catid, function(res) {
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
    this.serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function(el) {
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

  grid_list_toggle(){
    $('.grid-list').fadeToggle();
    $('#add-grid i').toggleClass('fa-angle-down').toggleClass('fa-angle-up')
  }

  add_new_widget() {
    let that = this;
    that.grid_list_toggle();
    that.grid_list()
    $('body').off('click', '.diy-bar .grid-list .swiper-container .swiper-slide  button').on('click', '.diy-bar .grid-list .swiper-container .swiper-slide  button', function() {
      let template = $(this).data('template');
      let str = '';
      $.get(tplpath + "/" + template + "/form.html", function(e) {
        let t = $.templates(e);
        $.get(promiseHost + "/get_catid", function(res) {
          if(!$('.add-widget-form').length){
            str += '<div class="add-widget-bg"></div>';
            str += '<div class="add-widget-form">';
            str += '  <div class="add-widget-form-close fa fa-close"></div>';
            str += '  <div class="inner">' + t.render(res) + '</div>';
            str += '</div>';
            $('body').append(str);
            that.grid_list_toggle();
          }
        });

      })
    });

    $('body').off('click', '.add-widget-form .add-widget-form-close,.add-widget-bg').on('click', '.add-widget-form .add-widget-form-close,.add-widget-bg', function() {
      $('.add-widget-form').fadeOut('slow', function() {
        $('.add-widget-form').remove()
      })
      $('.add-widget-bg').fadeOut('slow', function() {
        $('.add-widget-bg').remove()
      })
    })
    // this.grid.add_widget(
    //
    // )
  }

  delete_widget() {
    var that = this;
    $('body').off('click', '.grid-stack-item  .fa-trash').on('click', '.grid-stack-item  .fa-trash', function() {
      that.grid.remove_widget($(this).parent().parent())
    })
  }
}
