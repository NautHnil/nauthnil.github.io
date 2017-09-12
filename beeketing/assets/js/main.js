'use strict';

(function($) {
  "use strict";

  var Beeketing = {
    getDebounce: function getDebounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        var later = function later() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    getSticky: function getSticky() {
      $('[data-sticky="init"]').each(function() {
        var el = $(this);

        el.addClass('sticky').Stickyfill();
      });
    },

    getOwlCarousel: function getOwlCarousel() {
      $('[data-owl="init"]').each(function() {
        var owl = $(this);

        var owlDefault = {
          items: 3,
          loop: false,
          center: false,

          mouseDrag: true,
          touchDrag: true,

          margin: 0,
          stagePadding: 0,

          nav: false,
          dots: false,
          navText: ['<i class="bk bk-arrows-prev" aria-hidden="true"></i>', '<i class="bk bk-arrows-next" aria-hidden="true"></i>'],

          responsive: {
            0: {
              items: 1,
              dots: true,
              nav: false
            },
            576: {
              dots: true,
              nav: false
            },
            768: {
              items: 3,
              dots: true,
              nav: false
            },
            992: {
              dots: false,
              nav: true
            },
            1200: {
              dots: false,
              nav: true
            }
          }
        };

        var dataOwlXL = owl.data('owl-xl') !== undefined ? owl.data('owl-xl') : 1,
          dataOwlLG = owl.data('owl-lg') !== undefined ? owl.data('owl-lg') : 1,
          dataOwlMD = owl.data('owl-md') !== undefined ? owl.data('owl-md') : 1,
          dataOwlSM = owl.data('owl-sm') !== undefined ? owl.data('owl-sm') : 1,
          dataOwlXS = owl.data('owl-xs') !== undefined ? owl.data('owl-xs') : 1;

        // Merge settings.
        var settings = $.extend(owlDefault, owl.data());
        delete settings.owl;

        if (settings.sync) delete settings.sync;

        // Build breakpoints.
        if (settings.responsive) {
          var _breakpoints = {
            0: {
              items: dataOwlXS,
              dots: true
            },
            576: {
              items: dataOwlSM,
              dots: true
            },
            768: {
              items: dataOwlMD,
              dots: true,
              margin: 15
            },
            992: {
              items: dataOwlLG,
              dots: false,
              nav: true
            },
            1200: {
              items: dataOwlXL,
              dots: false,
              nav: true
            }
          };

          settings.responsive = _breakpoints;
        };

        delete settings.owlXl;
        delete settings.owlLg;
        delete settings.owlMd;
        delete settings.owlSm;
        delete settings.owlXs;

        owl.owlCarousel(settings);
      });
    },

    getAnimateCss: function getAnimateCss() {
      $('[data-animate="init"]').each(function() {
        var el = $(this);
        var animationName = el.data('animate-name');
        var animationDuration = el.data('animate-duration');
        var animationDelay = el.data('animate-delay');

        el.animateCss(animationName, animationDuration, animationDelay);
      });
    },

    getNivoSlider: function getNivoSlider() {
      $('[data-nivo="init"]').each(function() {
        var el = $(this);

        var nivoDefault = {
          effect: 'random',
          slices: 15,
          boxCols: 8,
          boxRows: 4,
          animSpeed: 800,
          pauseTime: 8000,
          startSlide: 0,
          directionNav: true,
          controlNav: false,
          controlNavThumbs: false,
          pauseOnHover: false,
          manualAdvance: true,
          prevText: '<i class="bk bk-arrows-prev" aria-hidden="true"></i>',
          nextText: '<i class="bk bk-arrows-next" aria-hidden="true"></i>',
          randomStart: false,
          beforeChange: function beforeChange() {
            el.find('.nivo-caption').animateCss('fadeOut');
          }
        };

        var settings = $.extend(nivoDefault, el.data());
        delete settings.init;

        el.nivoSlider(settings);
      });
    },

    getWaypoint: function getWaypoint() {
      $('[data-waypoint="init"]').each(function() {
        var el = $(this);
        var animateInit = el.children().find('[data-waypoint-animate="init"]');

        animateInit.addClass('vhidden');

        var waypoints = el.waypoint({
          handler: function handler(direction) {
            if (direction == 'down') {
              animateInit.each(function() {
                var init = $(this);
                var nameIn = init.data('waypoint-animate-name-in');
                var duration = init.data('waypoint-animate-duration');
                var delay = init.data('waypoint-animate-delay');

                init.removeClass('vhidden');
                init.animateCss(nameIn, duration, delay);
              });
            } else {
              animateInit.each(function() {
                var init = $(this);
                var nameOut = init.data('waypoint-animate-name-out');
                var duration = init.data('waypoint-animate-duration');
                var delay = init.data('waypoint-animate-delay');

                init.animateCss(nameOut, duration, delay);
                init.addClass('vhidden');
              });
            }
          },
          offset: '85%'
        });
      });
    },

    init: function init() {
      var self = this;

      // Call functions use debounce resize function
      var resizeDebounce = self.getDebounce(function() {
        // Code here
      }, 250);

      self.getSticky();
      self.getOwlCarousel();
      self.getAnimateCss();
      self.getWaypoint();

      $(window).on('load', function() {
        self.getNivoSlider();
      });

      window.addEventListener('resize', resizeDebounce);
    }
  };

  $.fn.extend({
    animateCss: function animateCss(animationName, animationDuration, animationDelay) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

      if (animationName !== undefined || animationName !== '') {
        this.addClass('animated ' + animationName).one(animationEnd, function() {
          $(this).removeClass('animated ' + animationName);
        });

        if (animationDuration !== undefined) {
          this.css('-webkit-animation-duration', animationDuration).one(animationEnd, function() {
            $(this).removeAttr('style');
          });
        }

        if (animationDelay !== undefined || animationDelay !== '') {
          this.css('-webkit-animation-delay', animationDelay).one(animationEnd, function() {
            $(this).removeAttr('style');
          });
        }
      }
      return this;
    }
  });

  $(document).ready(function() {
    Beeketing.init();
  });
})(jQuery);