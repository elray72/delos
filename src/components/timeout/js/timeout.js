/** ====================================================================================================================
 // Timeout
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('Timeout');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');
    
    const Home = require('../../home/js/home');
    let home = new Home();
    
    const ElementsMenu = require('../../elements-menu/js/elements-menu');
    let elementsMenu = new ElementsMenu();

    let _this = {};
    let Timeout = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    window.timeoutTimeoutTimeout = {};
    window.timeoutInterval = {};

    Assign(Timeout.prototype, {

        /**
         * Init.
         *
         * Registers event listeners.
         */
        init: function () {
            Log('Timeout initialised.');

            _this.listenToEvents();
        },


        listenToEvents: function() {
            Utils.Events.on('timeout_startover', function() {
                _this.stopTimeouts();
                _this.endCountdown();
            });

            Utils.Events.on('timeout_continue', function() {
                _this.destroy();
                _this.restartTimeout();
            });
        },

        startTimeout: function() {
            if (window.currentPage !== 'home') {

                window.timeoutTimeout = setTimeout(function() {
                    _this.showCountdown();
                }, 600000);
                
            }
            else if(window.currentPage === 'home') {
                _this.stopTimeouts();
            }
        },

        stopTimeouts: function() {
            clearTimeout(window.timeoutTimeout);
            clearTimeout(window.timeoutInterval);
        },

        restartTimeout: function() {
            _this.stopTimeouts();
            _this.startTimeout();
        },

        showCountdown: function() {
            let timeoutPage = document.getElementById('timeout_template').innerHTML;
            let $timeoutPage = document.createElement('div');
            let $body = document.getElementsByTagName('body');

            window.currentPage = 'timeout';

            $timeoutPage.innerHTML = timeoutPage;
            $body[0].appendChild($timeoutPage);

            setTimeout(function() {
                _this.attachContinueClick();
                _this.attachStartoverClick();
                _this.startCountdown();
            }, 200);
        },

        attachStartoverClick: function() {
            let $startoverButton = document.getElementById('timeout_startover');

            $startoverButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                Utils.Events.emit('timeout_startover');
            });
        },

        attachContinueClick: function() {
            let $timeout = document.getElementById('timeout');
            let $continueButton = document.getElementById('timeout_continue');

            $continueButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                Utils.Events.emit('timeout_continue');
                window.timeout.restartTimeout();
            });

            $timeout.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                Utils.Events.emit('timeout_continue');
                window.timeout.restartTimeout();
            });
        },

        startCountdown: function() {
            let totalTime = 60;
            let time = 60;
            let i = 1;
            let $circle = document.getElementById('countdown_circle');
            let $number = document.getElementById('countdown_number');

            Utils.addClass($circle, 'animate');

            window.timeoutInterval = setInterval(function() {
                time--;
                $number.innerHTML = time;
                if (i == totalTime) {    
                    clearInterval(window.timeoutInterval);
                    _this.stopTimeouts();
                    _this.endCountdown();
                    return;
                }
                i++;
            }, 1000);
        },

        endCountdown: function() {
            elementsMenu.destroy();
            Utils.Events.emit('close_more_info_page');
            Utils.Events.emit('page:show', 'home');
            _this.destroy();
        },

        destroy: function() {
            let $timeout = document.getElementById('timeout');

            Utils.addClass($timeout, 'exit');

            setTimeout(function() {
                $timeout.parentElement.remove();
            }, 400);
        }
    });

    module.exports = Timeout;
})();


