/** ====================================================================================================================
 // More Info
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('MoreInfo');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');

    let _this = {};
    let MoreInfo = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(MoreInfo.prototype, {

        previousPage: '',

        /**
         * Init.
         *
         * Sets up the global navigation.
         */
        init: function () {
            Log('More Info initialised.');

            _this.listenToEvents();
        },

        run: function() {
            Log('More Info run.');

            _this.injectMoreInfoPage();
            _this.attachCloseClick();
            _this.attachMenuClick();
            _this.previousPage = window.currentPage;
            window.currentPage = 'more_info';
        },

        injectMoreInfoPage: function() {
            let $body = document.getElementsByTagName('body');
            let moreInfoPage = document.getElementById('more_info_template').innerHTML;
            let $moreInfoPage = document.createElement('div');
            $moreInfoPage.innerHTML = moreInfoPage;

            $body[0].appendChild($moreInfoPage);
        }, //more_info_close

        attachCloseClick: function() {
            let $moreInfoClose = document.getElementById('more_info_close');

            $moreInfoClose.addEventListener('click', function() {
                Utils.Events.emit('close_more_info_page');
                window.timeout.restartTimeout();
            });
        },

        attachMenuClick: function() {
            let $moreInfoMenu = document.getElementById('more_info_menu');

            $moreInfoMenu.addEventListener('click', function() {

                Utils.Events.emit('show_elements_menu');
                Utils.Events.emit('close_more_info_page', 0);
                Utils.Events.emit('home:blink', 1000);
                window.timeout.restartTimeout();
            });
        },

        listenToEvents: function() {
            Utils.Events.on('close_more_info_page', function(timing) {
                let $moreInfoPage = document.getElementById('more_info');
                if (!timing) timing = 500;
                Log(timing);

                if($moreInfoPage) {
                    
                    Utils.addClass($moreInfoPage, 'hide');

                    window.currentPage = _this.previousPage;

                    setTimeout(function() {
                        $moreInfoPage.parentElement.remove();
                    }, timing);
                    
                }
            });

            Utils.Events.on('close_more_info_page_fade', function(a) {
                let $moreInfoPage = document.getElementById('more_info');

                if ($moreInfoPage) {

                    Utils.addClass($moreInfoPage, 'fade-out');
                    setTimeout(function() {
                        $moreInfoPage.parentElement.remove();
                    }, 500);
                    Utils.addClass($moreInfoPage, 'hide');

                    window.currentPage = _this.previousPage;

                    setTimeout(function() {
                        $moreInfoPage.parentElement.remove();
                    }, 500);

                }
            });
        }

    });

    module.exports = MoreInfo;
})();

