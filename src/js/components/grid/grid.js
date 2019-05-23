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
import '../form/jquery.cssforms';
export default class Grid {
  constructor(data, type) {
    let options = {
      verticalMargin: 0,
      cellHeight: 1
    };
    $('.grid-stack').gridstack(options);
    this.serialized_data = data;
    this.type = type;
    if (token) {
      // 开启编辑模式
      $('body').addClass('diy').addClass('hasRuler');
      $.pageRuler({
        v: [($(window).width() - 1000) / 2 + "px", $(window).width() / 2 + "px", ($(window).width() - ($(window).width() - 1000) / 2) + "px"],
        h: ["98px"]
      });

      $(window).resize(function () {
        $('.zxxRefLine_v,.zxxRefLine_h').remove();
        $.pageRuler({
          v: [($(window).width() - 1000) / 2 + "px", $(window).width() / 2 + "px", ($(window).width() - ($(window).width() - 1000) / 2) + "px"],
          h: ["98px"]
        });
      });
    }
    this.grid = $('.grid-stack').data('gridstack');
  }

  index() {
    let that = this;
    // 加载板块
    this.load_grid();
    // 显示隐藏标尺
    $('body').off('click', '#show-ruler').on('click', '#show-ruler', function () {
      $.pageRulerToggle();
      $('body').toggleClass('hasRuler');
    })
    // 显示隐藏辅助线
    $('body').off('click', '#show-line').on('click', '#show-line', function () {
      $.lineToggle();
    })
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

    $('body').off('click', '#add-grid').on('click', '#add-grid', function (e) {
      that.add_new_widget();
    })
    $('body').off('click', '.grid-list').on('click', '.grid-list', function (e) {
      if (e.target.className == 'grid-list') {
        that.grid_list_toggle();
      }
    })

    that.delete_widget();

    that.edit_widget();
  }

  grid_list() {
    // console.log(host + "/tpl/tpl.json");
    let str = "";
    $.getJSON(tplpath + '/tpl.json', function (result) {
      $.each(result.list, function (i, field) {
        str += '<div class="swiper-slide">';
        str += '  <div class="slide-inner" style="background-image:url(' + host + '/tpl/' + field.template + '/ico@303x160.jpg)">'
        str += '    <div class="bg wh-center">'
        str += '      <div>'
        str += '        <h2>' + field.title + '</h2>'
        str += '        <button type="button" name="button" data-type="' + field.type + '" data-template="' + field.template + '" data-template_id="' + field.template_id + '"><i class="fa fa-plus"></i>添加</button>'
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
        spaceBetween: 20,
        prevButton: '.grid-list .swiper-button-prev',
        nextButton: '.grid-list .swiper-button-next'
      });
    });

  }

  grid_list_toggle() {
    $('.grid-list').fadeToggle();
    $('#add-grid i').toggleClass('fa-angle-down').toggleClass('fa-angle-up')
  }

  load_grid() {
    var that = this;
    this.grid.removeAll();
    var items = GridStackUI.Utils.sort(this.serialized_data);
    _.each(items, function (node) {
      let str = '';
      $.get(tplpath + "/" + node.template + "/index.html", function (e) {
        let t = $.templates(e);
        if (node.modulname) {
          if (node.content) {
            $.post(promiseHost + "/get_widget_datalist?modulname=" + node.modulname, {
              data: node.content
            }, function (res) {
              let data = {
                res: res.data,
                node: node,
                tplpath: tplpath
              }
              if (res.code == 200) {
                if (that.type == 1 && token) {
                  str = '<div>' + t.render(data) + '<div class="ui-resizable-w"><div class="fa fa-edit"></div><div class="fa fa-trash"></div></div><div/>'
                } else {
                  str = '<div data-gs-no-move="1" data-gs-no-resize="1">' + t.render(data) + '</div>'
                }
                that.grid.addWidget($(str), node.template, node.template_id, JSON.stringify(node.content), JSON.stringify(node.style), node.aid, node.num, node.modulname, node.x, node.y, node.width, node.height, false);
                $('html').getNiceScroll(0).resize();
              }
            }, 'json')
          }

          // $.get(promiseHost + "/get_widget_datalist?modulname=" + node.modulname + "&catid=" + node.catid + "&num=" + node.num + "&id=" + node.aid, function(res) {
          //   let data = {
          //     res:res.data,
          //     node:node
          //   }
          //   if (res.code == 200) {
          //     if (that.type == 1 && token) {
          //       str = '<div>' + t.render(data) + '<div class="ui-resizable-w"><div class="fa fa-edit"></div><div class="fa fa-trash"></div></div><div/>'
          //     } else {
          //       str = '<div data-gs-no-move="1" data-gs-no-resize="1">' + t.render(data) + '</div>'
          //     }
          //     that.grid.addWidget($(str), node.template, node.template_id, node.catid, node.style, node.aid, node.num, node.modulname, node.x, node.y, node.width, node.height, false);
          //   }
          // }, 'json')
        } else {
          let data = {
            node: node,
            tplpath: tplpath
          }
          if (that.type == 1 && token) {
            str = '<div>' + t.render(data) + '<div class="ui-resizable-w"><div class="fa fa-edit"></div><div class="fa fa-trash"></div></div><div/>'
          } else {
            str = '<div data-gs-no-move="1" data-gs-no-resize="1">' + t.render(data) + '</div>'
          }
          that.grid.addWidget($(str), node.template, node.template_id, node.catid, node.style, node.aid, node.num, node.modulname, node.x, node.y, node.width, node.height, false);
          $('html').getNiceScroll(0).resize();
        }
      });

    }, that);
  }

  save_grid() {
    let that = this;
    this.serialized_data = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
      el = $(el);
      // var node = el.data('_gridstack_node');
      return {
        x: $(el).data('gs-x'),
        y: $(el).data('gs-y'),
        width: $(el).data('gs-width'),
        height: $(el).data('gs-height'),
        template: $(el).data('gs-template'),
        template_id: $(el).data('gs-template_id'),
        catid: $(el).data('gs-catid'),
        num: $(el).data('gs-num'),
        aid: $(el).data('gs-aid'),
        content: $(el).data('gs-content'),
        style: $(el).data('gs-style'),
        modulname: $(el).data('gs-modulname')
      };
    }, this);
    console.log(JSON.stringify(this.serialized_data));
    let pagename = '';
    if (window.location.pathname == '/') {
      pagename = 'index'
    } else {
      pagename = window.location.pathname.split('/');
      pagename = pagename[1].split('.');
      pagename = pagename[0];
    }
    pajax.post(promiseHost + '/save_page?page=' + pagename, JSON.stringify(this.serialized_data), {
      headers: {
        token: token
      }
    }).then(res => res.auto()).then(res => {
      if (res.code == 200) {
        alertinfo('保存成功!')
        that.load_grid();
      }
    });
  }

  clear_grid() {
    this.grid.remove_all();
  }

  add_form_close() {
    $('.add-widget-form').fadeOut('slow', function () {
      $('.add-widget-form').remove()
    })
    $('.add-widget-bg').fadeOut('slow', function () {
      $('.add-widget-bg').remove()
    })
  }

  add_new_widget() {
    let that = this;
    that.grid_list_toggle();
    that.grid_list()
    $('body').off('click', '.diy-bar .grid-list .swiper-container .swiper-slide  button').on('click', '.diy-bar .grid-list .swiper-container .swiper-slide  button', function () {
      let template = $(this).data('template');
      let template_id = $(this).data('template_id');
      let type = $(this).data('type');
      let str = '';
      $.get(tplpath + "/" + template + "/form.html", function (e) {
        let t = $.templates(e);
        if (!$('.add-widget-form').length) {
          str += '<div class="add-widget-bg"></div>';
          str += '<div class="add-widget-form">';
          str += '  <div class="add-widget-form-close fa fa-close"></div>';
          str += '  <div class="inner"><form ><input type="hidden" name="template" value="' + template + '"><input type="hidden" name="template_id" value="' + template_id + '">' + t.render({
            tplpath: tplpath
          }) + '</form></div>';
          str += '</div>';
          $('body').append(str);
          $('.add-widget-form .inner').niceScroll({
            horizrailenabled: false,
            cursorcolor: '#1479d7',
            zindex: 10
          });
          that.grid_list_toggle();
        }
      })
    });

    $('body').off('click', '.add-widget-form .add-widget-form-close,.add-widget-bg').on('click', '.add-widget-form .add-widget-form-close,.add-widget-bg', function () {
      that.add_form_close();
    });

    $('body').off('click', '.add-widget-form .form-item button.submit').on('click', '.add-widget-form .form-item button.submit', function () {
      let data = $('.add-widget-form form').serializeJson();

      // console.log(data);
      // {template: "news1", catid: "1", num: "7", dragable: "1"}
      data.style = '', data.content = '';
      let arr = [],
        obj = {};
      if (data.isSwitch) {
        obj.isSwitch = data.isSwitch;
      }
      data.style = JSON.stringify(obj);
      if ($('.add-widget-form form select[name="catid[]"],.add-widget-form form input[name="catid[]"]')) {
        $('.add-widget-form form select[name="catid[]"],.add-widget-form form input[name="catid[]"]').each(function (i) {
          arr.push({
            catid: $('.add-widget-form form select[name="catid[]"],.add-widget-form form input[name="catid[]"]').eq(i).val(),
            num: $('.add-widget-form form input[name="num[]"]').eq(i).val()
          })
        });
      }
      data.content = JSON.stringify(arr);
      console.log(data);
      // return false;
      let str = '';
      $.get(tplpath + "/" + data.template + "/index.html", function (e) {
        let t = $.templates(e);
        if (data.modulname) {
          $.post(promiseHost + "/get_widget_datalist?modulname=" + data.modulname, {
            data: data.content
          }, function (res) {
            if (res.code == 200) {
              if (that.type == 1 && token) {
                str = '<div>' + t.render(res) + '<div class="ui-resizable-w"><div class="fa fa-edit"></div><div class="fa fa-trash"></div></div><div/>'
              } else {
                str = '<div data-gs-no-move="1" data-gs-no-resize="1">' + t.render(res) + '</div>'
              }
              that.grid.addWidget($(str), data.template, data.template_id, data.content, data.style, data.aid, data.num, data.modulname, 0, 0, data.width, data.height, true);
            }
          }, 'json')
        } else {
          if (that.type == 1 && token) {
            str = '<div>' + t.render() + '<div class="ui-resizable-w"><div class="fa fa-edit"></div><div class="fa fa-trash"></div></div><div/>'
          } else {
            str = '<div data-gs-no-move="1" data-gs-no-resize="1">' + t.render() + '</div>'
          }
          that.grid.addWidget($(str), data.template, data.template_id, data.content, data.style, data.aid, data.num, data.modulname, 0, 0, data.width, data.height, true);
        }
        that.add_form_close();
      });

    });
    // this.grid.addWidget(
    //
    // )
  }

  delete_widget() {
    var that = this;
    $('body').off('click', '.grid-stack-item  .fa-trash').on('click', '.grid-stack-item  .fa-trash', function () {
      that.grid.remove_widget($(this).parent().parent())
    })
  }

  edit_widget() {
    var that = this;
    $('body').off('click', '.grid-stack-item  .fa-edit').on('click', '.grid-stack-item  .fa-edit', function () {
      let parent = $(this).parent().parent();
      // data.template, data.template_id, data.catid, data.modulname, 0, 0, data.width, data.height, true
      let template = parent.data('gs-template');
      let template_id = parent.data('gs-template_id');
      let catid = parent.data('gs-catid');
      let modulname = parent.data('gs-modulname');
      let height = parent.data('gs-height');
      let num = parent.data('gs-num');
      let str = '';
      let data = {
        catid: catid,
        modulname: modulname,
        height: height
      };
      $.get(tplpath + "/" + template + "/form.html", function (e) {
        let t = $.templates(e);
        if (!$('.add-widget-form').length) {
          str += '<div class="add-widget-bg"></div>';
          str += '<div class="add-widget-form">';
          str += '  <div class="add-widget-form-close fa fa-close"></div>';
          str += '  <div class="inner"><form ><input type="hidden" name="template" value="' + template + '"><input type="hidden" name="template_id" value="' + template_id + '">' + t.render(data) + '</form></div>';
          str += '</div>';
          $('body').append(str);
        }
      })

      $('body').off('click', '.add-widget-form .form-item button.submit').on('click', '.add-widget-form .form-item button.submit', function () {
        let data = $('.add-widget-form form').serializeJson();
        parent.data('gs-catid', data.catid);
        parent.data('gs-modulname', data.modulname);
        parent.data('gs-height', data.height);
        parent.data('gs-num', data.num);
        that.grid._updateElement(parent, function () {

        })
        that.save_grid();
        that.add_form_close();
      });
    })


    $('body').off('click', '.add-widget-form .add-widget-form-close,.add-widget-bg').on('click', '.add-widget-form .add-widget-form-close,.add-widget-bg', function () {
      that.add_form_close();
    });

  }
}
