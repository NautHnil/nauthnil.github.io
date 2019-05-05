(function($) {
  'use strict';
  
  let headerHeight = $('header').outerHeight();
  $(document).scroll(function() {
    let pos = $(document).scrollTop();
    let parallax = parseInt(pos * - 0.3) + 'px';
    let rgba = (pos / headerHeight) * 0.6;
    
    $('.about-me').css('margin-top', parallax);
    $('header').css('background', 'rgba(0,0,0,' + rgba);
    $('body').css({
      'backgroundPosition': 'center ' + parallax
    });
  })
})(jQuery);