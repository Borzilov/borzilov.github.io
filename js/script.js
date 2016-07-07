(function(){
    'use strict';
    angular.module('personalPage', ['ngAnimate'])
        .controller('cvMainCtrl', ['$http', mainCtrl])
        //.controller('cvSliderCtrl', [sliderCtrl])
        .directive('sliderDirective', ['$animate', slider]);



function mainCtrl ($http) {
    var controller = this;

    controller.views = '/views/index.html';
    controller.header = false;
    controller.loader = true;
    controller.language = 'en';
    languageRequest(controller.language);


    controller.skills = {
        main: [
            {
                name: 'HTML5',
                val: '87%'
            },
            {
                name: 'CSS3',
                val: '87%'
            },
            {
                name: 'SASS',
                val: '80%'
            },
            {
                name: 'Twitter Bootstrap',
                val: '85%'
            },
            {
                name: 'JavaScript',
                val: '60%'
            },
            {
                name: 'jQuery',
                val: '75%'
            },
            {
                name: 'AngularJS',
                val: '50%'
            }
        ],
        additional: ['Git', 'Gulp', 'Photoshop', 'Jira']
    }
    controller.text = {};

    controller.methods = {
        loadTemplate : loadTemplate,
        languageRequest: languageRequest
    };


    function loadTemplate (template) {
        controller.views = '/views/' + template + '.html';

        if (!controller.header) {
            controller.header = true;
        }
    };

    function languageRequest (lang) {

        controller.loader = true;

        $http.get('/lang/lang_' + lang + '.json').then(function(response){
            controller.text = response.data;
            controller.language = lang;
            controller.cvLink = '/cv/borzilov_cv(' + lang +').pdf';
        });
        controller.loader = false;
    };

};

function slider ($animate) {
    return {
        restrict: "A",
        templateUrl: "/views/partials/slider.html",
        link: function (scope, element, attrs){
            var controller = scope,
                slidesSet = [
                    {
                        img: '/img/work_thumb/interwood.jpg',
                        link: 'works/interwood/index.html',
                        alt: '"interwood" live sample'
                    },
                    {
                        img: '/img/work_thumb/sedona@1x.jpg',
                        link: 'works/sedona/index.html',
                        alt: '"sedona" live sample'
                    },
                    {
                        img: '/img/work_thumb/bicycle.jpg',
                        link: 'works/bicycle/index.html',
                        alt: '"bicycle" live sample'
                    },
                    {
                        img: '/img//work_thumb/axit.jpg',
                        link: 'works/axit/index.html',
                        alt: '"axit" l/ve sample'
                    },
                    {
                        img: '/img/work_thumb/unique.jpg',
                        link: 'works/unique-tech/index.html',
                        alt: '"unique tech" live sample'
                    }
                ];

            controller.switcher = 1;
            controller.slides = {
                set: slidesSet,
                //set: slidesSet.slice(0,1),
                direction: {
                    backward: false,
                    forward: false
                },
                current: 0,
                isActive: false
            };

            controller.methods = {
                //sliderBackwardsChange : sliderBackwardsChange,
                //sliderForwardChange: sliderForwardChange,
                sliderChange: sliderChange
            };

            function sliderChange (direction) {

                if(controller.slides.isActive) return;

                var targetSlideIndex,
                    currentSlideIndex = controller.slides.current,
                    totalSlides = slidesSet.length;

                if (direction == 'forward'){
                    targetSlideIndex = ( currentSlideIndex == totalSlides - 1 ) ? 0 : ++currentSlideIndex;

                } else if (direction == 'backward') {

                    targetSlideIndex = ( currentSlideIndex == 0 ) ? totalSlides - 1 : --currentSlideIndex;
                }

                controller.slides.current = targetSlideIndex;
                controller.slides.direction = {};
                controller.slides.direction[direction] = true;
            };


            $animate.on('leave', element,
                function callback(element, phase) {
                    if (phase == 'start') {
                        controller.slides.isActive = true;
                    } else if (phase == 'close') {
                        controller.slides.isActive = false;
                    }
                }
            );

            // function sliderForwardChange () {
            //     var arr = slidesSet;

            //     arr.push(arr.shift());
            // };
        }
    };
};
})();