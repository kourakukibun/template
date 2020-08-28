/* global Device */
(function (window, $) {
  'use strict';

  // Set Namespace
  var APP = window.APP = window.APP || {};

  // メディアクエリ
  APP.mqSp = window.matchMedia('(max-width: 768px)');
  APP.mqPc = window.matchMedia('(min-width: 769px)');
  APP.mqTb = window.matchMedia('(min-width: 769px) and (max-width: 1030px)');
  // Sample:::
  // if (APP.mqSp.matches) {
  //   offset = $('.l-header').outerHeight();
  // }

  // SPメニューボタン設定
  APP.SetSpHeaderBtn = function ($elm) {
    var that = this;
    that.$elm = $elm;
    that.$body = $('body');
    that.$wrapper = $('main');
    that.$header = $('.l-header-menu');
    that.$target = $('.l-header-nav');
    that.$closeBtn = $('.l-header-close-btn');
    that.MENUOPEN = 'is-menu-open';
    that.MENUCLOSE = 'is-menu-close';
    that.topPos = 0;
    that.isOpen = false;

    that.$elm.on('click', function () {
      that.changeStatus();
    });
    
    that.$closeBtn.on('click', function () {
      that.close();
      that.isOpen = !that.isOpen;
    });
  };
  APP.SetSpHeaderBtn.prototype = {
    changeStatus: function () {
      var that = this;
      if (that.isOpen) {
        that.close();
      } else {
        that.open();
      }
      that.isOpen = !that.isOpen;
    },
    close: function () {
      var that = this;

      that.$body.addClass(that.MENUCLOSE);
      setTimeout(function () {
        that.$body.removeClass(that.MENUOPEN);
        that.$wrapper.css({
          'top': 0
        });
        $('html, body').prop({ scrollTop: that.topPos });
        that.$body.removeClass(that.MENUCLOSE);
      }, 310);
    },
    open: function () {
      var that = this;

      that.topPos = $(window).scrollTop();
      that.$body.addClass(that.MENUOPEN);
      that.$wrapper.css({
        'top': -(that.topPos)
      });

      that.$header.animate({
        scrollTop: 0
      }, 0);
    }
  };


  // アコーディオン
  APP.SetAc = function($elm) {
    var that = this;
    that.$elm = $elm;
    that.$trigger = $elm.find('.mod-ac-trigger');
    that.$target = $elm.find('.mod-ac-target');
    that.ACTIVE = 'is-active';

    that.$trigger.on('click', function() {
      if ($elm.hasClass(that.ACTIVE)) {
        $elm.removeClass(that.ACTIVE);
        that.$target.slideUp(500, 'swing');
      } else {
        $elm.addClass(that.ACTIVE);
        that.$target.slideDown(500, 'swing');
      }
    });
  };

  // スクロールイベント（ページトップ）
  APP.SetPageTop = function($elm) {
    var that = this;
    that.$elm = $elm;
    that.$body = $('body');
    that.$footer = $('.l-footer');
    that.scr = $(window).scrollTop();
    that.winH = $(window).height();
    that.maxH = 0;

    $(window).on('load resize scroll', function() {
      that.update();
    });
  };
  APP.SetPageTop.prototype = {
    update: function() {
      var that = this;

      that.scr = $(window).scrollTop();
      that.winH = $(window).height();
      that.maxH = that.$footer.offset().top - that.winH;
      if (that.scr >= that.maxH) {
        that.$body.addClass('is-pagetop-fixed');
        that.$elm.css({'bottom': that.$footer.outerHeight() + 20 +'px'});
      } else if (that.scr > that.winH/2 && that.scr < that.maxH) {
        that.$body.addClass('is-pagetop-active').removeClass('is-pagetop-fixed');
        that.$elm.removeAttr('style');
      } else {
        that.$body.removeClass('is-pagetop-active is-pagetop-fixed');
        that.$elm.removeAttr('style');
      }
    }
  };

  $(function () {
    var html = window.document.getElementsByTagName('html');
    // デバイス情報にもとづくクラス名をbodyに追加
    var device = new Device(navigator.userAgent);
    html[0].className = device.getAllClasses(html[0].className);

    if ($('html').hasClass('is-tablet')) {
      device.setTabletViewport();
    }

    // 画像背景置換
    $('.mod-img2bg').each(function() {
      var src = $(this).attr('src');
      $(this).parent().css({
        background: 'url('+src+') no-repeat 50% 50%',
        'background-size': 'cover'
      });
      $(this).css({
        visibility: 'hidden',
        width: '100%',
        height: '100%'
      });
    });

    // SP メニューボタン設定
    $('.mod-sp-menu').each(function () {
      APP.spmenu = new APP.SetSpHeaderBtn($(this));
    });

    // アコーディオン
    $('.mod-ac').each(function() {
      new APP.SetAc($(this));
    });

    // ページ内リンク
    $('a[href^="#"]').on('click', function () {
      if (!$(this).hasClass('no-scroll')) {
        var href = $(this).attr('href');
        var $target = $(href === '#' || href === '' ? 'html' : href);
        $target.velocity('scroll', {
          duration: 500,
          easing: 'easeInOutQuad'
        });
        return false;
      }
    });

    // スクロールイベント（ページトップ）
    $('.mod-pagetop').each(function() {
      new APP.SetPageTop($(this));
    });

    // パララックス
    new Backpax('.mod-parallax-bg');
    new Rellax('.mod-parallax-part');

    // slick
    $('.mod-slider').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      infinite: false,
      variableWidth: true,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });

  });
})(window, jQuery);
