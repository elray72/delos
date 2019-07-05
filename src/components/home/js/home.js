/** ====================================================================================================================
 // Home
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('Home');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');

    let _this = {};
    let Home = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(Home.prototype, {

        init: function () {

            window.currentPage = 'home';

            // elements
            _this.$home = document.getElementById('home');

            // on init
            _this.initMenu();
            _this.onHomeLoad();

            // events
            _this.$home.addEventListener('click', _this.onHomeClick.bind(_this, this));

            // page show event
            Utils.Events.on('home:show', function () {
                _this.initMenu();
                _this.onHomeLoad();
                window.experienceVideoPlays = [];
                window.currentPage = 'home';
                Utils.removeClass(window.$navMenuVideo, 'active');
            });

            Utils.Events.on('home:blink', function(timing) {
                Utils.addClass(_this.$home, 'page--blink');
                setTimeout(function () {
                    Utils.removeClass(_this.$home, 'page--blink');
                }, timing);
            });
        },

        initMenu: function() {

            let menuControls = {
                page: 'home',
                back_button: '',
                page_title: '',
                visibility: {
                    nav_back: false,
                    nav_title: false,
                    nav_intelligence: true,
                    nav_more_info: true,
                    nav_menu: true
                }
            };

            window.globalNavigation.runGlobalNavigation(menuControls);
        },

        // ON LOAD: show page and load video
        onHomeLoad: function() {

            Utils.addClass(_this.$home, 'page--show');
            Utils.addClass(_this.$home, 'page--ready');
            setTimeout(function () {
                Utils.removeClass(_this.$home, 'pre-init');
            }, 1000);

            let $video = document.querySelector('.video-player video');
            if ($video.getAttribute('data-video-id') !== 'home') {
                Utils.Events.emit('video:play', 'home');
            }
            else {
                Utils.addClass($video, 'visible');
            }
        },

        // ON CLICK: play into video
        onHomeClick: function(o, e) {

            e.preventDefault();
            Utils.removeClass(_this.$home, 'page--ready');
            setTimeout(function () {
                _this.setIntroGlobalNav();
                Utils.Events.emit('video:play', 'intro');
                window.currentPage = 'intro';
                Utils.removeClass(_this.$home, 'page--show');
            }, 1000);
        },

        setIntroGlobalNav: function() {
            let menuControls = {
                page: 'intro',
                back_button: '',
                page_title: '',
                visibility: {
                    nav_back: false,
                    nav_title: false,
                    nav_intelligence: false,
                    nav_more_info: false,
                    nav_menu: false
                }
            };

            window.globalNavigation.runGlobalNavigation(menuControls);
        },

        debugViewport: function() {
            Utils.Debug.log('VIEWPORT: ' + window.innerWidth + 'x' + window.innerHeight + 'px');
            window.addEventListener('resize', function () {
                Utils.Debug.log('VIEWPORT: ' + window.innerWidth + 'x' + window.innerHeight + 'px');
            });
        }
    });

    module.exports = Home;
})();