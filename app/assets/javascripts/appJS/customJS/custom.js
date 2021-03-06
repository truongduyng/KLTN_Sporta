$(document).ready(function() {
  "use strict";
  $(".big-cta").hover(
    function () {
     $('.cta a').addClass("animated shake");
   },
   function () {
     $('.cta a').removeClass("animated shake");
   }
   );

  $(".box").hover(
    function () {
     $(this).find('.icon').addClass("animated fadeInDown");
     $(this).find('p').addClass("animated fadeInUp");
   },
   function () {
     $(this).find('.icon').removeClass("animated fadeInDown");
     $(this).find('p').removeClass("animated fadeInUp");
   }
   );

  $('.accordion').on('show', function (e) {

    $(e.target).prev('.accordion-heading').find('.accordion-toggle').addClass('active');
    $(e.target).prev('.accordion-heading').find('.accordion-toggle i').removeClass('icon-plus');
    $(e.target).prev('.accordion-heading').find('.accordion-toggle i').addClass('icon-minus');
  });

  $('.accordion').on('hide', function (e) {
    $(this).find('.accordion-toggle').not($(e.target)).removeClass('active');
    $(this).find('.accordion-toggle i').not($(e.target)).removeClass('icon-minus');
    $(this).find('.accordion-toggle i').not($(e.target)).addClass('icon-plus');
  });

  //scroll to top
  $(window).scroll(function(){
    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });

  $('.scrollup').click(function(){
    $("html, body").animate({ scrollTop: 0 }, 100);
    return false;
  });

  var $table = $('table.tablebooking'),
  $bodyCells = $table.find('tbody tr:first').children(),
  colWidth;

  // Adjust the width of thead cells when window resizes
  $(window).resize(function() {
    // Get the tbody columns width array
    colWidth = $bodyCells.map(function() {
      return $(this).width();
    }).get();

    // Set the width of thead columns
    $table.find('thead tr').children().each(function(i, v) {
      $(v).width(colWidth[i]);
    });
  }).resize();

  if (window.location && window.location.hash) {
    // if (window.location.hash == '#_=_') {
    //   console.log("wwww");
    //   window.location.hash = '';
    //   return;
    // }
    var facebookFubarLoginHash = RegExp('_\=_', 'g');
    window.location.hash = window.location.hash.replace(facebookFubarLoginHash,'');

  }

});
