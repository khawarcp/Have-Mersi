(function($){
    $(document).ready(function() {

        // Brands slider homepage
        $('.brands-logos-slider').owlCarousel({
            loop:true,
            margin:10,
            items:6,
            dots: false,
            autoplay:true,
            autoplayTimeout:5000,
            autoplayHoverPause:true,
            autoplaySpeed: 2000,
            nav:false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:3
                },
                1000:{
                    items:6
                }
            }
        })
        // Featured Collection slider homepage      
        $('.featured-collection-slider').on('initialized.owl.carousel changed.owl.carousel', function(e) {
            if (!e.namespace)  {
            return;
            }
            var carousel = e.relatedTarget;
            $('.slider-counter').text(carousel.relative(carousel.current()) + 1 + '/' + carousel.items().length);
        }).owlCarousel({
            loop:true,
            margin:10,
            dots: false,
            autoplay:false,
            autoplayTimeout:5000,
            autoplayHoverPause:true,
            autoplaySpeed: 2000,
            nav:true,
            navText: ["<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-left-arrow.svg?v=1691503007'>","<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-right-arrow.svg?v=1691503011'>"],
            responsive:{
                0:{
                    items:1.3,
                    margin: 0
                },
                600:{
                    items:2
                },
                1000:{
                    items:3
                }
            }
        })
 
     // Featured Collection slider homepage      
     $('.collection-list-slider').on('initialized.owl.carousel changed.owl.carousel', function(e) {
        if (!e.namespace)  {
        return;
        }
        var carousel = e.relatedTarget;
        $('.collection-slider-counter').text(carousel.relative(carousel.current()) + 1 + '/' + carousel.items().length);
    }).owlCarousel({
        loop:true,
        margin:10,
        items:4,
        dots: false,
        autoplay:false,
        autoplayTimeout:5000,
        autoplayHoverPause:true,
        autoplaySpeed: 2000,
        nav:true,
        navText: ["<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-left-arrow.svg?v=1691503007'>","<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-right-arrow.svg?v=1691503011'>"],
        responsive:{
            0:{
                items:1.4
            },
            600:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    })


     // Top Picks Collection slider homepage      
     $('.top-picks').on('initialized.owl.carousel changed.owl.carousel', function(e) {
        if (!e.namespace)  {
        return;
        }
        var carousel = e.relatedTarget;
        $('.top-picks-counter').text(carousel.relative(carousel.current()) + 1 + '/' + carousel.items().length);
    }).owlCarousel({
        loop:true,
        margin:10,
        items:2.5,
        dots: false,
        autoplay:false,
        autoplayTimeout:5000,
        autoplayHoverPause:true,
        autoplaySpeed: 2000,
        nav:true,
        navText: ["<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/cream-right-arrow.svg?v=1691590464'>","<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/cream-left-arrow.svg?v=1691590460'>"],
        responsive:{
            0:{
                items:1.3,
                margin: 0
            },
            600:{
                items:1.4
            },
            767:{
                items:1.8
            },
            1000:{
                items:2.5
            }
        }
    })

     // Strap Collection slider homepage      
    $('.strap-collection-slider').on('initialized.owl.carousel changed.owl.carousel', function(e) {
        if (!e.namespace)  {
        return;
        }
        var carousel = e.relatedTarget;
        $('.strap-counter').text(carousel.relative(carousel.current()) + 1 + '/' + carousel.items().length);
    }).owlCarousel({
        loop:true,
        margin:10,
        items:3,
        dots: false,
        autoplay:false,
        autoplayTimeout:5000,
        autoplayHoverPause:true,
        autoplaySpeed: 2000,
        nav:true,
        navText: ["<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-left-arrow.svg?v=1691503007'>","<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-right-arrow.svg?v=1691503011'>"],
        responsive:{
            0:{
                items:1.3,
                margin: 0
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    })

    // product as seen slider 
    $('.as-seen-slider').on('initialized.owl.carousel changed.owl.carousel', function(e) {
        if (!e.namespace)  {
        return;
        }
        var carousel = e.relatedTarget;
        $('.as-seen-counter').text(carousel.relative(carousel.current()) + 1 + '/' + carousel.items().length);
    }).owlCarousel({
        loop:true,
        margin:20,
        items:4,
        dots: false,
        autoplay:false,
        autoplayTimeout:5000,
        autoplayHoverPause:true,
        autoplaySpeed: 2000,
        nav:true,
        navText: ["<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-left-arrow.svg?v=1691503007'>","<img src='https://cdn.shopify.com/s/files/1/0804/7368/6324/files/slider-right-arrow.svg?v=1691503011'>"],
        responsive:{
            0:{
                items:1.5
            },
            600:{
                items:3
            },
            1000:{
                items:4
            }
        }
    })

    // strap metafields complete look and feel
    $('.strap-look-slider').owlCarousel({
        loop:false,
        margin:10,
        items:3,
        dots: true,
        autoplay:false,
        autoplayTimeout:5000,
        autoplayHoverPause:true,
        autoplaySpeed: 2000,
        nav:false,
        slideBy: 5,
        responsive:{
            0:{
                items:3
            },
            600:{
                items:3
            },
            1000:{
                items:3
            }
        }
    })

    //remove disable from owl nav
    // $('.collection-list-slider .owl-nav').removeClass('disabled');
    $('.collection-list-slider .owl-nav').click(function(event) {
        $(this).removeClass('disabled');
      });
    });



    
    
  
})(jQuery);
