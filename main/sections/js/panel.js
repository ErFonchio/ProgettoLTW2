$('.circle_ovest').click(function() {
    let spWidth = $('.sidepanel_ovest').width();
    let spMarginLeft = parseInt($('.sidepanel_ovest').css('margin-left'),10);
    let radius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--radius').trim());

    let w = (spMarginLeft >= 0 ) ? spWidth * -1 : 0;
    let cw = (w < 0) ? -(w+radius): spWidth-$('.circle_ovest').width()-radius;
    $('.sidepanel_ovest').animate({
        marginLeft:w
    });
    $('.sidepanel_ovest span').animate({
        marginLeft:w
    });
    $('.circle_ovest').animate({
        left:cw
    },
    function() {
        $('.fa-chevron-left-ovest').toggleClass('hide');
        $('.fa-chevron-right-ovest').toggleClass('hide');
    });
});


$('.circle_est').click(function() {
    let spWidth = $('.sidepanel_est').width();
    let spMarginRight = parseInt($('.sidepanel_est').css('margin-right'),10);
    let radius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--radius').trim());

    let w = (spMarginRight >= 0 ) ? spWidth * -1 : 0;
    let cw = (w < 0) ? -(w+radius): spWidth-$('.circle_est').width()-radius;
    $('.sidepanel_est').animate({
        marginRight:w
    });
    $('.sidepanel_est span').animate({
        marginRight:w
    });
    $('.circle_est').animate({
        right:cw
    },
    function() {
        $('.fa-chevron-left-est').toggleClass('hide');
        $('.fa-chevron-right-est').toggleClass('hide');
    });
});

