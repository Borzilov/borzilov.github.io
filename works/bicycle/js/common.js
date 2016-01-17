$(document).ready(function() {
	var $body = $('body');

	//menu smooth scroll
	var menu = (function () {

		var $menuItem = $body.find('.main-menu')
							.find('.menu-item').
							children('a');

		function smoothScroll ($link) {

			var target = $link.attr('href')
							.replace('#',''),
				scrollValue = $body.find('section.' + target)
								.offset().top,
				scrollTime = scrollValue / 2;

			$body.animate({
				'scrollTop' : scrollValue - 30
			}, scrollTime);

		};

		return {
			init: function () {

				$menuItem.on('click', function (e){

					e.preventDefault();
					smoothScroll($(this));
				});
			},
		};
	})();

	//twitter tabs
	var tabs = (function () {

		var $controls = $body.find('.control-item'),
			$container = $body.find('.tabs-container'),
			$content = $container.children();
			
		
		function tabsSwitcher ($targetTab) {

			if (!$targetTab.hasClass('active')){
				$targetTab.addClass('active')
					.siblings().removeClass('active');

				$content.siblings('.active').stop().fadeOut(500, function () {
					$(this).removeClass('active');
					$content.eq($targetTab.index())
						.fadeIn(500)
						.addClass('active');
				});
			};
		};
		return {

			init: function () {
				$controls.on('click', function () {
					tabsSwitcher($(this));
				});
			},
		};
	})();

	menu.init();
	tabs.init();
});
