(function ($) {
    'use strict'; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: (target.offset().top)
                }, 1000, 'easeInOutExpo');
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function () {
        $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $(document).ready(function () {
        $('body').scrollspy({
            target: '#sideNav'
        });
    });

    let k = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        n = 0;
    $(document).keydown(function (e) {
        if (e.keyCode === k[n++]) {
            if (n === k.length) {
                const profilPicture = $('.img-profile');
                profilPicture.attr('src', profilPicture.attr('src').slice(0, profilPicture.attr('src').lastIndexOf('/')) + '/baby-yoda.webp');
                n = 0;
                return false;
            }
        } else {
            n = 0;
        }
    });

})(jQuery); // End of use strict
