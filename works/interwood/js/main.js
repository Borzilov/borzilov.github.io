$(document).ready(function () {
	var $body = $('body');

	//menu module
	var menu = (function () {
		var $mainMenu = $body.find('.main-navigation'),
			$menuController = $body.find('.main-navigation__buttons-wrap');

		function openCloseMenu () {
			$mainMenu.toggleClass('is-opened');
		};
		return {
			init: function () {
				$menuController.on('click', 'button', openCloseMenu);
			},
		};
	})();//end menu module

	//sign form module
	var signForm = (function () {
		var $form = $body.find('#sign_form'),
			$submitBtn = $form.children('#send');
			VALIDATION_PROPERTY = {
				rules: {
					name: {
						required: true
					},
					mail: {
						required: true,
						email: true,
					}
				},
				messages: {
    				name: "Будь ласка, залишить Ваше ім'я",
    				mail: {
      					required: "Будь ласка, залишить Ваш e-mail",
      					email: "Перевірте Ваш e-mail. Він має бути формату name@domain.com"
    				}
  				},
  				errorLabelContainer: ".sign__form__message",
  				focusCleanup: true
			};
		//set validation
		function setValidation(){
			$form.validate(VALIDATION_PROPERTY);
		};
		//if no placeholders support adding via extra library
		function checkPlaceholders () {
			if ( !Modernizr.input.placeholder ) {
				$form.find('input:not([type=submit])')
						.css('height', '52px').placeholder();
			};
		};

		//send data from valid form
		function validateAndSend (event) {
			event.preventDefault();

			if ( $form.valid() ){
				console.log("valid");
				//some action (Ajax send)
				$.ajax({
						type: "GET",
						url: "mail.php",
						data: $form.serialize()
					}).done(function() {
						alert("Дякуємо");

						setTimeout(function() {
							$form.trigger("reset");
						}, 1000);
				});
			};

		};

		return {
			init: function () {
				checkPlaceholders();
				setValidation();

				$submitBtn.on('click', validateAndSend);
			}
		};
	})();//end sign form module

	menu.init();
	signForm.init();
});