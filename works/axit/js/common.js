$(document).ready(function() {
	var $body = $('body'),
		$header = $body.children('header'),
		$mainNavigationSet = $header.find('nav.main-navigation')
									.find('.navigation-panel')
									.find('a'),
		$main = $body.children('main'),
		$tabs = $main.children('section.features').children('.features-first'),
		$tabsSwitcher = $tabs.find('ul.tab-controller li'),
		$tabsSet = $tabs.find('.tab'),
		$goTop = $body.children('.go_top'),
		$signForm = $body.find('#sign_form'),
		$signButton = $signForm.find("#sign_up");


	//if placeholders are not supported add extra support

	if (!Modernizr.input.placeholder) {
		$('input, textarea').placeholder();
	}

	//show main navigation on small devices
	$header.find('button.menu-button').on('click', function(){
		$(this).siblings('ul.navigation-panel').slideToggle(300, function(){
			var $this = $(this);
			if( $this.is(':hidden')) $this.removeAttr('style');
		});
	});
	
	// Main Navigation + go top
	$mainNavigationSet.add($goTop.find("a")).on('click', function(){
		var $this = $(this),
			selector = $this.attr('href').split('#')[1],
			offset;

		if( selector == 'top'){
			offset = 0;
		} else {
			offset = $main.children('.' + selector).offset().top;
			if ($body.width() <= 768) $header.find('button.menu-button').trigger('click');
		}
		
		$body.animate({
			scrollTop : offset
		}, 500);
	});

	// Tabs switch
	$tabsSwitcher.on('click', function(){
		var $this = $(this);

		if (!$this.hasClass('active')){
			$tabsSwitcher.removeClass('active');
			$this.addClass('active');
			$tabsSet.siblings('.active').fadeOut(400, function(){
				$(this).removeClass('active');
				$tabsSet.eq($tabsSwitcher.siblings('.active').index())
					.fadeIn(400)
					.addClass('active');
			});
		};
	});
	//appearing "GoTop"button
	$(window).scroll(function(){

		if($(this).scrollTop() > 1) $goTop.css('display','block')
			else $goTop.css('display','none')
	});

	//show "sign up" form on small devices
	var signForm = (function () {

		var $oldForm, $newForm, $extraBlock;

		function buildForm () {
			$header.find('ul.navigation-panel').css('display','none');
			
			$oldForm = $header.find('.form-container').css('display','none'),
			$newForm = $oldForm.clone().css({
								position: 'relative',
								right: '0',
								margin: '15% auto'
							});

			$extraBlock = $('<div>').addClass('extra').css({
								backgroundColor : 'rgba(0,0,0,.5)',
								width: '100%',
								height: '100%',
								position: 'absolute',
								top: '0',
								left: '0'
							});

			$body.append($extraBlock.append($newForm));
			$newForm.slideDown(200);

			add_RemoveForm_Listener();
		};

		function add_RemoveForm_Listener () {
			$newForm.find('button.close_form').on('click', function (e){
				e.preventDefault();
				$extraBlock.remove();
				$oldForm.removeAttr('style');
				return false;
			});
		};

		return {
			init: function () {
				$header.find('button.show_form').on('click', buildForm);
			}
		}
	})();

	//Validation forms
	var validation = (function () {
		var $form = $body.find('form');
		//mail validate
		function mailValidate(e) {
			var $checkingField = $(e.target).closest('form').find('input[name="email"]'),
				mail = $checkingField.val();

			if ( !checker(mail) ) {
				showError($checkingField);
			} else {
				removeError($checkingField);
				return true;
			};

		};
		
		//function for checking mail field value via regExp
		function checker (str) {
			var pattern = new RegExp("^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$");

			return pattern.test(str);
		};

		function showError($field) {
				$field.css({
					color: 'red',
					'borderColor' : 'red'
				});
		};

		function removeError($field) {
				$field.removeAttr('style')
		};

		//sending values from inputs if form valid
		function formCheck (e) {
			e.preventDefault();

			var $button = $(e.target),
				$form = $button.closest('form'),
				mailCheck = mailValidate(e);

			if (mailCheck) {

				$.ajax({
						type: "POST",
						url: "mail.php",
						data: $form.serialize()
					}).done(function() {
						alert("Thanks for your enquiry!");

						setTimeout(function() {
							$form.trigger("reset");
						}, 1000);
				});
			} else {
			
			};
		};

		return {
			init: function () {
				$body.on('blur', 'input[name="email"]', mailValidate);
				$body.on('click', '.confirm', formCheck);
			}
		};
	})();

	signForm.init();
	validation.init();

});
