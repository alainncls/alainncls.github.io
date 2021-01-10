(function ($) {
    'use strict'; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            let target = $(this.hash);
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
        console.log('CLOSE')
        $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $(document).ready(function () {
        $('body').scrollspy({
            target: '#sideNav'
        });
    });

    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let n = 0;
    $(document).keydown(function (e) {
        if (e.keyCode === konami[n++]) {
            if (n === konami.length / 2) {
                const profilPicture = $('.img-profile');
                profilPicture.attr('src', profilPicture.attr('src').slice(0, profilPicture.attr('src').lastIndexOf('/')) + '/baby-yoda.webp');
                return false;
            }
            if (n === konami.length) {
                const profilPicture = $('.img-profile');
                profilPicture.attr('src', profilPicture.attr('src').slice(0, profilPicture.attr('src').lastIndexOf('/')) + '/penguin-chick.gif');
                n = 0;
                return false;
            }
        } else {
            n = 0;
        }
    });

    const dark = [68, 65, 82, 75];
    let o = 0;
    $(document).keydown(function (e) {
        if (e.keyCode === dark[o++]) {
            if (o === dark.length) {
                const styleSheet = document.createElement('style');
                styleSheet.textContent = '  html {\n' +
                    '    filter: invert(1) hue-rotate(.5turn);\n' +
                    '  }\n' +
                    '\n' +
                    '  img {\n' +
                    '    filter: invert(1) hue-rotate(.5turn);\n' +
                    '  }\n' +
                    '\n' +
                    '  img:not(:hover) {\n' +
                    '    opacity: .7;\n' +
                    '    transition: opacity .25s ease-in-out;\n' +
                    '  }';
                document.body.appendChild(styleSheet);
                return false;
            }
        } else {
            o = 0;
        }
    });

})(jQuery); // End of use strict
