
//menu module
var menu = (function () {
	var buttonsWrap = document.getElementById('menu_buttons'),
		menu = document.getElementById('menuContainer');

	function showHideMenu (event) {
		var target = event && event.target || event.srcElement;

		while (target != buttonsWrap) {
			if ( target.tagName == "BUTTON" ){
				menu.classList.toggle('header__navigation-list--is-collapsed');
				return;
			}
			target = target.parentNode;
		}
	}
	return {
		init: function () {
			buttonsWrap.addEventListener('click', showHideMenu);
		}
	};
})();

//google maps module
var google_map = (function () {
	var mapContainer = document.getElementById('google_map'),
		MAP_PROP = {
			//центр карты - объект LatLng
			center: new google.maps.LatLng(35.199333, -111.648540),
			zoom: 8,
			disableDefaultUI: true,
			scrollwheel: false,
			//тип карты
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

	function buildMap () {
		new google.maps.Map(mapContainer,MAP_PROP);
	};

	return {
		init: function () {
			buildMap();
		}
	};
})();//end google maps

//order module
var orderForm = (function () {
	var form = document.getElementById('search_form'),
		saved_checkInDate,
		saved_checkOutDate,
		saved_adultsAmount = 1,
		saved_childrenAmount = 0,
		ONE_DAY = (1000 * 60 * 60 * 24);

	function setDate () {
		var checkInWrap = document.getElementById('check_in'),
			checkOutWrap = document.getElementById('check_out'),
			checkIn = checkInWrap.getElementsByTagName('INPUT')[0],
			checkOut = checkOutWrap.getElementsByTagName('INPUT')[0],
			today = new Date(),
			tomorrow = new Date( +today + ONE_DAY),
			outputOptions = {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};

			//set initial date
		saved_checkInDate = today;
		saved_checkOutDate = tomorrow;

		checkIn.value = today.toLocaleString("ru", outputOptions);
		checkOut.value = tomorrow.toLocaleString("ru", outputOptions);
	};//end set Date

	function setDatepicker () {
		var $checkIn = $(form).find('input[name="check_in"]'),
			$checkOut = $(form).find('input[name="check_out"]');

		$.datepicker.setDefaults({
			minDate: saved_checkInDate,
			dateFormat: "dd MM yy",
			showOn: "focus",
			 monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
			 dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			 firstDay: 1
		});

		$checkOut.datepicker({
			onClose: function () {
			 	saved_checkOutDate = $checkOut.datepicker('getDate');
			 }
		});

		$checkIn.datepicker({
			onClose: function () {
				var checkInDate = $checkIn.datepicker('getDate'),
					checkOutDate = $checkOut.datepicker('getDate'),
					newCheckOutDate =  new Date(+checkInDate + ONE_DAY);

				if ( checkInDate >= checkOutDate) {
					$checkOut.datepicker("option", "minDate", newCheckOutDate);
					$checkOut.datepicker("setDate", newCheckOutDate);
					saved_checkOutDate = newCheckOutDate;
				};

				saved_checkInDate = checkInDate;
			}
		});
	};//end setDatepicker
	
	function clickDelegate (event) {
		event.preventDefault();

		var target = event && event.target || event.srcElement,
		 	targetId;
		
		while ( target != form ) {
			targetId = target.getAttribute('id');
			
			if ( targetId == 'check_in' || targetId == 'check_out' ) {

				setInputFieldFocus(target);
				return;
			} else if ( target.classList.contains('btn') ) {
				
				personAmountChange(target);
				return;
			} else if (targetId == 'formSubmit') {
				formSubmit();
				return;
			}

			target = target.parentNode;
		};
	};//end clickDelegate

	function personAmountChange (btn) {
		var inputField = [].filter.call(btn.parentNode.children, function (element) {
				return element.tagName == 'INPUT';
			}),
			currentAmmount = +inputField[0].value,
			fieldName = inputField[0].getAttribute('name');

		console.log(fieldName);

		if ( btn.classList.contains('btn--add') ) {
			inputField[0].value = ++currentAmmount;
		} else if ( currentAmmount > 0 ) {
			inputField[0].value = --currentAmmount;
		};

		if ( fieldName == 'adults') {
			saved_adultsAmount = currentAmmount;
		} else {
			saved_childrenAmount = currentAmmount;
		};
	};//end person amount change

	function setInputFieldFocus (inputWrap) {
		var input = [].filter.call(inputWrap.children, function (element) {
					return element.tagName == 'INPUT';
			})[0],
			clickEvent = new Event('focus');

			input.dispatchEvent(clickEvent);
	};//end setInputFieldFocus

	function formSubmit () {
		/*ajax send saved values*/
		console.log('your request in process');
	};//end formSubmit

	return {
		init: function () {
			setDate();
			setDatepicker();
			form.addEventListener('click', clickDelegate);
		}
	};	
})();//end order module



menu.init();
google_map.init();
orderForm.init();
