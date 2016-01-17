$(document).ready(function () {
	var $body = $('body');

	//navigation
	var navigation = (function () {
		
		var $win = $(window),
			$navigation = $body.find('.main-nav'),
			$menu  = $navigation.children('.nav-container'),
			$menuToggler = $body.find('.menu-toggler'),
			$goTop = $body.children('.go_top');

		// toggle menu visibility on mobile devices
		function menuToggle () {
			$menu.slideToggle(400, function () {
				var $this = $(this)

				if ($this.is(':hidden')) $this.removeAttr('style')
			})
		};

		//
		function menuWatcher (argument) {
			if ($body.width() > 767 && $menu.is('[style]')) {
				$menu.removeAttr('style')
			};
		}
		//show / hide go top
		function showGoTop () {
			var offset = $body.scrollTop();
				
			if (offset > 300 && $goTop.is(':hidden')) {
				$goTop.fadeIn(400);
			} else if (offset < 300 && $goTop.is(':visible')) {
				$goTop.fadeOut(400);
			};
		};

		//'go top'
		function goTop () {
			$body.animate({
				scrollTop: 0
			});
		};
		//public
		return {

			switch_on: function () {
				$menuToggler.on('click', menuToggle);
				$goTop.on('click', goTop);
				$win.on('scroll', showGoTop);
				$win.on('resize', menuWatcher)
			}
		};
	})();
//slider
	var slider = (function () {

		var animation = false;

		function sliderMotion (e) {

			var $target = $(e.target),
				$slider = $target.closest('.slider-wrap'),
				$slidesSet = $slider.find('.slider-item'),
				$slideVisible = $slidesSet.filter('.visible'),
				$controlSet = $slider.find('.control-item'),
				$currentControl = $controlSet.filter('.active'),
				currentPos = $currentControl.index(),
				targetPos = $target.index(),
				imageWidth = $slideVisible.children('img').width(),
				startAnimPos,
				targetVisiblePos;

			//no animation if previous isn't ended
			if ($target.hasClass('active') || animation) return;
			animation = true;

			if ( targetPos - currentPos < 0) {
				startAnimPos = -imageWidth;
				targetVisiblePos = imageWidth;
			} else {
				startAnimPos = imageWidth;
				targetVisiblePos = -imageWidth;
			};
			
			$currentControl = $controlSet.removeClass('active')
								.eq(targetPos)
								.addClass('active');

			$slidesSet.eq(targetPos)
					.addClass('animating')
					.css({
						left: startAnimPos
					})
					.animate({
						left: 0
					}, 500,function(){
						$slidesSet.removeClass('visible').removeAttr('style');
						$slideVisible = $(this).toggleClass('visible animating');
						animation = false;
					})
			$slideVisible.animate({
					left: targetVisiblePos
			},500)
		};

		return {
			switch_on: function () {
				$body.find('.slider-wrap')
					.children('.slider-control')
					.on('click', 'li', sliderMotion)
			}
		};
	})()

//waypoints
	var wayponts = (function () {
		
		if(Modernizr.cssanimations) {
			var $featureWrap = $body.find('.features-wrap')
								.css('visibility','hidden'),
				$features = $featureWrap.find('.feature'),
				$leftElements,
				$rightElements;


			$leftElements = $features.filter(function (index) {
				return (index % 3 == 0)
			});

			$rightElements = $features.filter(function (index) {
				return ((index + 1) % 3 == 0)
			});


			$featureWrap.waypoint(function () {
				$featureWrap.removeAttr('style');
				$leftElements.addClass('animated slideInLeft');
				$rightElements.addClass('animated slideInRight');
			},{
				offset: '20%'
			});
		};	
	})();

	//form
	var form = (function () {
		var $launchButton = $body.find('#hire_us'),
			$formContainer = $body.children('.hire-form'),
			$inputs = $formContainer.find('input'),
			$message = $formContainer.find('p:not(.success)'),
			$leave = $formContainer.find('.cancel'),
			$submit = $formContainer.find('.submit'),
			phoneNumb = '+3***********';

			function checkerField (event) {

				if (arguments.length < 1){
					var $mail = $inputs.filter('[name=email]'),
						$phone = $inputs.filter('[name=phone]');
					
					if( checker($mail) || checker($phone)) return true
						else return false;

				} else {
					var $field = $(event.target);
					checker($field);
				};
				
			};

			//check inputs via regexp pattern
			function checker ($field) {
				var type = $field.attr('name'),
					value = $field.val(),
					pattern,
					result;

				if (type == 'name') return;

				if (type == 'email') pattern = new RegExp("^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$")

					else {
						pattern = /\d{12}/;
						value = value.split('+')[1];
					}

				result = pattern.test(value);

				if (result) {
					errorManagement($field, 'hide');
					return true;

				} else {
					errorManagement($field, 'show');
				};
			};

			// show/hide error
			function errorManagement ($field, toggler) {
				var $label = $field.parent('label');

				if (toggler == 'show') {
					$label.addClass('invalid');
					$message.css('visibility', 'visible');

				} else if (toggler == 'hide') {

					$label.removeClass('invalid');
					
					if (!$label.siblings().hasClass('invalid')) {
						$message.css('visibility', 'hidden');
					};
				};
			}
			//checking phone input
			function phoneValidate (e) {
				e.preventDefault();
				var $phoneField = $(e.target),
					key = e.which;

				if ((key > 47 && key < 58) || (key > 95 && key < 106) ) {
					
					if (key > 57) key -= 48;

					if ($phoneField.val().length < 1){
						$phoneField.val(phoneNumb);
					};

					var digit = String.fromCharCode(key),
						number = $phoneField.val().replace('*', digit);
				
					$phoneField.val(number);
					return;

				} else if ( key == 8 ){

					var fieldVal = $phoneField.val(),
						digitEnds = fieldVal.indexOf('*');

					if (digitEnds == -1) digitEnds = fieldVal.length
						else if (digitEnds == 1 ) return;

					var leftPart = fieldVal.substr(0, digitEnds-1),
						rightPart = fieldVal.substr(digitEnds);

					fieldVal = leftPart + '*' + rightPart;
					$phoneField.val(fieldVal);

					return;
				};

				errorManagement ($phoneField, 'show');
			};

			// main check on submit form
			function validateForm (event) {
				event.preventDefault();

				var $form = $(event.target).closest('form');

				if (checkerField()) {
					
					$.ajax({
						type: "POST",
						url: "mail.php",
						data: $form.serialize()
					}).done(function() {

						$form.find('.success')
							.css('visibility','visible');

						setTimeout(function() {
							$form.find('p')
								.css('visibility','hidden');

							$form.trigger("reset");
							$leave.trigger('click');
						}, 2000);
					});
				};
			};
		return {
			switch_on: function () {
					$inputs.filter('[name="phone"]').on('keydown', phoneValidate)
					$inputs.on('blur', checkerField)
					$submit.on('click', validateForm);

					$leave.on('click',function (e) {
						e.preventDefault();
						$formContainer.fadeOut(700)
					});
					$launchButton.on('click',function () {
						$formContainer.fadeIn(500)
					});
			}
		};
	})()
	navigation.switch_on();
	slider.switch_on();
	form.switch_on();
})

