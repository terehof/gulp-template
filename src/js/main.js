let app = app || {};

let mobileBreakpoint = 767,
    tabletBreakpoint = 1023;
app.options = {
    winW: $(window).width(),
    winH: $(window).height(),
    isMobile: ($(window).width() <= mobileBreakpoint),
    isTablet: ($(window).width() <= tabletBreakpoint)
};

app.main = {
    test: function () {

        console.log('wahoo!');

    }


};

app.init = function () {
    app.main.test();


};



$(function() {
    app.init();
});

window.onload = function () {

};

window.addEventListener('resize', function () {
    app.options.winH = $(window).height();
    app.options.winW = $(window).width();
    app.options.isMobile = ($(window).width() <= mobileBreakpoint);
    app.options.isTablet = ($(window).width() <= tabletBreakpoint);
});