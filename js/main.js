(function ($) {
	"use strict";

	function safe(name, fn) {
		try { fn(); } catch (e) { if (window.console) console.warn('[main.js] ' + name + ' failed:', e); }
	}

	function hideLoader() {
		var el = document.getElementById('ftco-loader');
		if (el) el.classList.remove('show');
	}

	// Hide loader immediately on DOM ready AND after window load — belt-and-braces.
	$(function () { setTimeout(hideLoader, 1); });
	$(window).on('load', hideLoader);
	setTimeout(hideLoader, 3000); // hard safety net

	if (window.AOS) safe('AOS', function () { AOS.init({ duration: 800, easing: 'slide' }); });

	safe('stellar', function () {
		if (!$.fn.stellar) return;
		$(window).stellar({
			responsive: true,
			parallaxBackgrounds: true,
			parallaxElements: true,
			horizontalScrolling: false,
			hideDistantElements: false,
			scrollProperty: 'scroll'
		});
	});

	safe('fullheight', function () {
		function apply() { $('.js-fullheight').css('height', $(window).height()); }
		apply();
		$(window).on('resize', apply);
	});

	safe('scrollax', function () { if ($.Scrollax) $.Scrollax(); });

	safe('carousel', function () {
		if (!$.fn.owlCarousel) return;
		$('.home-slider').owlCarousel({
			loop: false,
			autoplay: false,
			margin: 0,
			mouseDrag: false,
			touchDrag: false,
			pullDrag: false,
			freeDrag: false,
			nav: false,
			dots: false,
			items: 1,
			responsive: { 0: { items: 1 }, 600: { items: 1 }, 1000: { items: 1 } }
		});
	});

	safe('dropdown-hover', function () {
		$('nav .dropdown').hover(
			function () {
				var $this = $(this);
				$this.addClass('show');
				$this.find('> a').attr('aria-expanded', true);
				$this.find('.dropdown-menu').addClass('show');
			},
			function () {
				var $this = $(this);
				$this.removeClass('show');
				$this.find('> a').attr('aria-expanded', false);
				$this.find('.dropdown-menu').removeClass('show');
			}
		);
	});

	safe('scroll-nav', function () {
		$(window).on('scroll', function () {
			var st = $(this).scrollTop();
			var navbar = $('.ftco_navbar');
			var sd = $('.js-scroll-wrap');
			if (st > 150) navbar.addClass('scrolled');
			else navbar.removeClass('scrolled sleep');
			if (st > 350) {
				navbar.addClass('awake');
				if (sd.length) sd.addClass('sleep');
			} else if (navbar.hasClass('awake')) {
				navbar.removeClass('awake').addClass('sleep');
				if (sd.length) sd.removeClass('sleep');
			}
		});
	});

	safe('content-waypoint', function () {
		if (!$.fn.waypoint) return;
		$('.ftco-animate').waypoint(function (direction) {
			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
				$(this.element).addClass('item-animate');
				setTimeout(function () {
					$('body .ftco-animate.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeInLeft') el.addClass('fadeInLeft ftco-animated');
							else if (effect === 'fadeInRight') el.addClass('fadeInRight ftco-animated');
							else if (effect === 'fadeIn') el.addClass('fadeIn ftco-animated');
							else el.addClass('fadeInUp ftco-animated');
							el.removeClass('item-animate');
						}, k * 50);
					});
				}, 100);
			}
		}, { offset: '95%' });
	});

	safe('onepage-nav', function () {
		$(".smoothscroll[href^='#'], #ftco-nav ul li a[href^='#']").on('click', function (e) {
			var target = $(this.hash);
			if (!target.length) return;
			e.preventDefault();
			$('html, body').animate({ scrollTop: target.offset().top }, 700);
			var navToggler = $('.navbar-toggler');
			if (navToggler.is(':visible')) navToggler.click();
		});
	});

})(jQuery);
