/** ====================================================================================================================
 // ElementPage
 // ================================================================================================================= */
'use strict';

(function () {

	// Dependencies
	const Log = require('bows')('ElementPage');
	const Assign = require('lodash/assign');
	const Utils = require('../../../js/base/utils');
	const Lottie = require('../../../vendor/lottie/lottie.min');
	const lottieAnimationData = require('../../../animations/animations');

	let _this = {};
	let ElementPage = function (options) {

		Assign(this, options);
		_this = this;
		_this.$el = this.el;
	};

	_this.previousControls = '';
	_this.currentControls = '';

	Assign(ElementPage.prototype, {

		elementsMenuBack: {},
		elementLottieAnimations: {},
		activeElement: '',

		/**
		 * Init.
		 *
		 * Sets up the global navigation.
		 */
		init: function () {
			Log('Element Page initialised.');

			_this.listenToEvents();
			_this.listenToCloseClick();
			Utils.Events.emit('video:pause');
			setTimeout(function () {
				Utils.removeClass(window.$navMenuVideo, 'active');
				Utils.removeClass(window.$navMenuVideo, 'play');
				Utils.removeClass(window.$navMenuVideo, 'pause');
			}, 0);
		},

		run: function(elementsMenuBackFunction, $activeElement) {
			let menuControls = {
				visibility: {
					nav_back: false,
					nav_title: false,
					nav_intelligence: false,
					nav_more_info: false,
					nav_menu: false
				}
			}

			window.globalNavigation.setNavigationVisibility(menuControls.visibility);

			setTimeout(function() {
				_this.elementsMenuBack = elementsMenuBackFunction;

				_this.previousPage = window.currentPage;
				window.currentPage = 'element_page';

				_this.activeElement = $activeElement.getAttribute('data-element');

				_this.runAnimation();
			}, 1150);
		},

		listenToCloseClick: function() {
			let closeButtons = document.querySelectorAll('[data-close-element]');;

			[].forEach.call(closeButtons, $closeButton => {
				$closeButton.addEventListener('click', function(e) {
					e.preventDefault();
					e.stopPropagation();

					Utils.Events.emit('close_element');
					window.timeout.restartTimeout();
				});

			});
		},

		listenToEvents: function() {
			Utils.Events.on('close_element', function() {

				let $elements = document.querySelectorAll('[data-element]');

				[].forEach.call($elements, $element => {
					if (Utils.hasClass($element, 'open')) {
						Utils.removeClass($element, 'open');
						_this.killVideo($element, 1800);
					}
					else {
						setTimeout(function() {
							Utils.removeClass($element, 'hide');
						}, 1800);
					}
				});

				let menuControls = {
					visibility: {
						nav_back: true,
						nav_title: true,
						nav_intelligence: true,
						nav_more_info: true,
						nav_menu: false
					}
				}

				_this.killAnimation();

				setTimeout(function() {
					window.globalNavigation.showGlobalNav();
					window.globalNavigation.setNavigationVisibility(menuControls.visibility);
				}, 1150);

				window.currentPage = _this.previousPage;
			});
		},

		killVideo: function($element, delay) {

			let $video = $element.querySelector('video');
			Utils.addClass($video, 'fade-out');
			setTimeout(function() {
				$video.remove();
			}, delay);
		},

		runAnimation: function() {
			let params = {
				container: document.getElementById('lottie_'+_this.activeElement),
				renderer: 'svg',
				loop: true,
				autoplay: true,
				animationData: lottieAnimationData.animations.elements[_this.activeElement].animationData
			};

			_this.elementLottieAnimation = Lottie.loadAnimation(params);
		},

		killAnimation: function() {
			setTimeout(function() {
				_this.elementLottieAnimation.destroy();
			}, 500);
		}

	});

	module.exports = ElementPage;
})();

