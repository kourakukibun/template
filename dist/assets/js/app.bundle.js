(function (global) {
  'use strict';

  /**
   * デバイス判別
   * @constructor
   */
  function Device(userAgent) {
    this.userAgent = userAgent;
  }

  Device.prototype.getPlatformClass = function () {
    var ua = this.userAgent;
    switch (true) {
    case /Windows/.test(ua):
      return 'win';
    case /Android/.test(ua):
      return 'android';
    case /iPhone|iPad/.test(ua):
      return 'ios';
    case /Mac OS X/.test(ua):
      return 'mac';
    }
    return '';
  };

  Device.prototype.getPlatformAndroidOldClass = function () {
    var ua = this.userAgent;
    if (ua.indexOf('Android') > 0) {
      var version = parseFloat(ua.slice(ua.indexOf('Android') + 8));

      if (version < 4.4) {
        return 'android-old';
      } else {
        return '';
      }

    } else {
      return '';
    }
  };

  Device.prototype.getBrowserClass = function () {
    var ua = this.userAgent;
    switch (true) {
    case /Edge/.test(ua):
      return 'edge';
    case /Chrome/.test(ua):
      return 'chrome';
    case /Firefox/.test(ua):
      return 'firefox';
    case /MSIE|Trident/.test(ua):
      return 'ie';
    case /Silk\//.test(ua):
      return 'aosp';
    case /CriOS/.test(ua):
      return 'chrome';
    case /Safari\//.test(ua):
      return 'safari';
    }
    return '';
  };

  Device.prototype.getIeVersionClass = function () {
    var ua = this.userAgent;
    switch (true) {
    case /Trident\/.*rv:11/.test(ua):
      return 'ie11';
    case /MSIE 10\./.test(ua):
      return 'ie10';
    case /MSIE 9\./.test(ua):
      return 'ie9';
    case /MSIE 8\./.test(ua):
      return 'ie8';
    }
    return '';
  };

  /**
   * デバイス種別により異なるクラスを取得
   * @return {String} is-tablet is-mobile is-pc のいずれか
   */
  Device.prototype.getKindOfDeviceClass = function () {
    switch (true) {
    case this.isTablet():
      return 'is-tablet';
    case this.isMobile():
      return 'is-mobile';
    }
    return 'is-pc';
  };

  Device.prototype.isTablet = function () {
    return this.isWindowsTablet()
      || this.isIpad()
      || this.isAndroidTablet()
      || this.isKindle();
  };

  Device.prototype.isMobile = function () {
    return this.isWindowsPhone()
      || this.isIphone()
      || this.isAndroidMobile()
      || this.isFirefoxMobile()
      || this.isBlackBerry();
  };

  Device.prototype.isWindowsTablet = function () {
    return /Windows/.test(this.userAgent) && /Touch/.test(this.userAgent);
  };

  Device.prototype.isIpad = function () {
    return /iPad/.test(this.userAgent);
  };

  Device.prototype.isAndroidTablet = function () {
    return /Android/.test(this.userAgent) && (!/Mobile/.test(this.userAgent));
  };

  Device.prototype.isKindle = function () {
    return /Android/.test(this.userAgent) && /Silk/.test(this.userAgent);
  };

  Device.prototype.isWindowsPhone = function () {
    return /Windows Phone/.test(this.userAgent);
  };

  Device.prototype.isIphone = function () {
    return /iPhone/.test(this.userAgent);
  };

  Device.prototype.isAndroidMobile = function () {
    return /Android/.test(this.userAgent) && /Mobile/.test(this.userAgent);
  };

  Device.prototype.isFirefoxMobile = function () {
    return /Firefox/.test(this.userAgent) && /Android/.test(this.userAgent);
  };

  Device.prototype.isBlackBerry = function () {
    return /BlackBerry/.test(this.userAgent);
  };

  Device.prototype.getAllClasses = function (defaultClass) {
    var classes = [],
      os = this.getPlatformClass(),
      browser = this.getBrowserClass(),
      androidOld = this.getPlatformAndroidOldClass(),
      ieVersion = this.getIeVersionClass(),
      device = this.getKindOfDeviceClass();

    if (typeof defaultClass !== 'undefined') {
      classes.push(defaultClass);
    }
    if (os !== '') {
      classes.push(os);
    }
    if (androidOld !== '') {
      classes.push(androidOld);
    }
    if (browser !== '') {
      classes.push(browser);
    }
    if (ieVersion !== '') {
      classes.push(ieVersion);
    }
    if (device !== '') {
      classes.push(device);
    }
    return classes.join(' ');
  };

  /**
   * タブレット時のviewportを指定
   */
  Device.prototype.setTabletViewport = function () {
    // 指定するviewportの幅
    let tabletViewPort = document.createElement('meta');
    tabletViewPort.setAttribute('name', 'viewport');
    tabletViewPort.setAttribute('content', 'width=1300');
    document.head.appendChild(tabletViewPort);
  };

  // Exports (外部から使えるようにするイディオム)
  if ('process' in global) {
    module['exports'] = Device;
  }
  global['Device'] = Device;

})((window || 0).self || global);

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

        // - Velocity版
        // - 他のjQueryの処理に影響を与えないが、スクロール時にポジションを維持できない問題あり
        // $target.velocity('scroll', {
        //   duration: 500,
        //   easing: 'easeInOutQuad'
        // });

        // - jQuery版
        // - 他のスクロール処理が重なると重くなることも
        var pos = $target.offset().top;
        $('body,html').animate({ scrollTop: pos }, 500, 'swing');

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
