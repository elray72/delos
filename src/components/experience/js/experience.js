/** ====================================================================================================================
 // Experience
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('Experience');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');
    const BezierEasing = require('../../../vendor/bezier-easing/bezier-easing');

    let _this = {};
    let Experience = function (options) {

        Log('Experience initialised.');
        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(Experience.prototype, {

        init: function () {

            // elements
            _this.$experience = document.getElementById('experience');
            _this.$menu = document.getElementById('experience_menu');
            _this.$menuItems = _this.$menu.querySelectorAll('.experience-button');
            _this.$slider = document.getElementById('experience_slider');
            _this.$sliderBar = document.getElementById('experience_slider_bar');
            _this.$wave = document.getElementById('experience_wave');

            // wave positions
            _this.waveUp = { cpX: 960, cpY: -470, x: 1920, y: 660, width: 3 };
            _this.waveDown = { cpX: 960, cpY: 726, x: 1920, y: 726, width: 2 };

            // event: on page click
            _this.$experience.addEventListener('click', _this.onPageClick.bind(_this));

            // event: on menu item click
            Utils.forEach(_this.$menuItems, function($m) {
                $m.addEventListener('click', function (e) {
                    _this.onMenuItemClick($m, e);
                });
            });

            // event: page show event
            Utils.Events.on('experience:show', function (timing) {

                window.currentPage = 'experience';
                timing = timing > 0 ? timing : 1000;

                // global events
                window.playVideo('menu_in');
                setTimeout(function () {
                    _this.floatMenu();
                    _this.animateWaveUp(1000);
                    _this.initMenu();
                }, timing);
            });

            // event: on video playing
            Utils.Events.on('experience:playing', function () {
                Utils.removeClass(_this.$experience, 'page--paused');
                setTimeout(function () {
                    Utils.addClass(_this.$experience, 'page--playing');
                }, 3000);
            });

            // event: on video pause
            Utils.Events.on('experience:pause', function () {
                Utils.removeClass(_this.$experience, 'page--playing');
                Utils.addClass(_this.$experience, 'page--paused');
            });

            // event: next video
            Utils.Events.on('experience:next', function (videoId) {
                _this.goToNextExperience(videoId);
            });
        },
        initMenu: function() {

            let menuControls = {
                page: 'experience',
                back_button: _this.back,
                page_title: 'Experience Darwin',
                visibility: {
                    nav_back: true,
                    nav_title: true,
                    nav_intelligence: false,
                    nav_more_info: false,
                    nav_menu: true
                }
            };

            window.globalNavigation.runGlobalNavigation(menuControls);
        },
        back: function() {
            let $menuButtons = document.getElementsByClassName('experience-button');
            let experienceActive = false;

            Utils.forEach($menuButtons, function ($button) {
                if(Utils.hasClass($button, 'active')) {
                    Utils.Events.emit('page:show', 'experience');
                    Utils.removeClass($button, 'active');
                    experienceActive = true;
                }
            });
            
            if(!experienceActive) {
                Utils.Events.emit('page:show', 'home');
            }
        },
        setGlobalNavTitle: function(videoName) {
            let title = videoName.replace('_', ' ');

            window.globalNavigation.setNavigationTitle(title);
        },

        // PAGE EVENTS
        onPageClick: function() {

            if (Utils.hasClass(_this.$experience, 'page--ready')) {
                Utils.Events.emit('video:toggle');
            }
        },
        onMenuItemClick: function($m, e) {

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (window.videoLoading) {
                return;
            }

            // active state
            _this.toggleMenuItemActive($m);

            // move menu slider
            _this.moveMenuSlider($m);

            // dock menu
            if (!Utils.hasClass(_this.$menu, 'docked')) {
                _this.dropMenu();
                _this.animateWaveDown(1000);
            }

            // toggle play pause on global nav
            setTimeout(function () {
                Utils.addClass(window.$navMenuVideo, 'pause');
                Utils.removeClass(window.$navMenuVideo, 'play');
            }, 1000);

            window.playVideo($m.getAttribute('data-video-id'));
            _this.setGlobalNavTitle($m.getAttribute('data-video-id'));
        },
        toggleMenuItemActive: function($m) {

            Utils.forEach(_this.$menuItems, function($menuItem) {
                if ($menuItem === $m) {
                    Utils.addClass($menuItem, 'active');
                }
                else {
                    Utils.removeClass($menuItem, 'active');
                }
            });
        },
        goToNextExperience: function(videoId) {

            // move menu item
            let $menuItem = document.querySelector('[data-video-id="' + videoId + '"]');
            _this.onMenuItemClick($menuItem);
            $menuItem.focus();

            // play next video
            setTimeout(function () {
                Utils.Events.emit('video:play', videoId);
            }, 0);
        },

        //
        // WAVE ANIMATIONS
        animateWaveUp: function(duration) {

            let ctx = _this.$wave.getContext('2d');
            _this.animateWave(ctx, _this.waveDown, _this.waveUp, duration);
        },
        animateWaveDown: function(duration) {

            let ctx = _this.$wave.getContext('2d');
            _this.animateWave(ctx, _this.waveUp, _this.waveDown, duration);
        },
        animateWave: function(ctx, a, b, duration) {

            let startTime;
            duration = duration ? duration : 1000;
            _this.drawWave(ctx, a);
            window.requestAnimationFrame(function step(timestamp) {

                if (!startTime) startTime = timestamp;
                let time = timestamp - startTime;
                let easeInOutBack = BezierEasing(0.680, -0.550, 0.265, 1.550);
                let bezier = easeInOutBack(time / duration, 1);

                ctx.clearRect(0, 0, 1920, 810);
                _this.drawWave(ctx, {
                    cpX: a.cpX + ((b.cpX - a.cpX) * bezier),
                    cpY: a.cpY + ((b.cpY - a.cpY) * bezier),
                    x: a.x + ((b.x - a.x) * bezier),
                    y: a.y + ((b.y - a.y) * bezier),
                    width: a.width + ((b.width - a.width) * bezier),
                });

                if (time < duration) {
                    window.requestAnimationFrame(step);
                }
                setTimeout(function () {
                    ctx.clearRect(0, 0, 1920, 810);
                    _this.drawWave(ctx, b);
                }, duration);
            });
        },
        drawWave: function(ctx, wave) {

            ctx.lineWidth = wave.width;
            ctx.strokeStyle = "#fff";
            ctx.beginPath();
            ctx.moveTo(0, wave.y);
            ctx.quadraticCurveTo(wave.cpX, wave.cpY, wave.x, wave.y);
            ctx.stroke();
        },

        //
        // MENU ANIMATIONS
        floatMenu: function() {
            Utils.removeClass(_this.$menu, 'menu-down');
            Utils.removeClass(_this.$menu, 'docked');
            Utils.addClass(_this.$menu, 'menu-up');
            Utils.addClass(_this.$menu, 'float');
            setTimeout(function () {
                Utils.removeClass(_this.$menu, 'menu-up');
                Utils.removeClass(_this.$menu, 'pre-init');
            }, 1000);
        },
        dropMenu: function() {
            Utils.addClass(_this.$menu, 'menu-down');
            Utils.addClass(_this.$menu, 'docked');
            setTimeout(function () {
                Utils.removeClass(_this.$menu, 'menu-down');
                Utils.removeClass(_this.$slider, 'pre-init');
            }, 1000);
        },

        //
        // MENU SLIDER
        moveMenuSlider: function($m) {

            let elem = $m.getBoundingClientRect();
            _this.$sliderBar.style.transform = 'translateX(' + (elem.x) + 'px)';
            _this.$sliderBar.style.width = elem.width + 'px';
        }
    });

    module.exports = Experience;
})();