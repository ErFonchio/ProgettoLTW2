$('.circle_est').click(function() {
    let spWidth = $('.sidepanel_est').width();
    let spMarginRight = parseInt($('.sidepanel_ovest').css('margin-right'),10);
    let radius = 11;
    
    console.log(spMarginRight);
    console.log(radius);

    let w = (spMarginRight >= 0 ) ? spWidth * -1 : 0;
    let cw = (w < 0) ? -(w+radius): spWidth-$('.circle_ovest').width()-radius;
    
    $('.sidepanel_est').animate({
        marginRight: w
    });
    $('.sidepanel_est span').animate({
        marginRight: w
    });
    $('.circle_est').animate({
        right: cw
    });
});