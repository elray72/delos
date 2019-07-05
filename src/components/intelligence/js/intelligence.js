/** ====================================================================================================================
 // Intelligence
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('Intelligence');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');

    let _this = {};
    let Intelligence = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(Intelligence.prototype, {

        init: function () {
            Log('Intelligence Page initialised.');

            // page show event
            Utils.Events.on('intelligence:show', function () {
                Log('Show Intelligence Page.');
                _this.initMenu();
                _this.playIntelligenceVideo();

                window.currentPage = 'intelligence';
            });

            // page hide event
            Utils.Events.on('intelligence:hide', function () {
                Log('Hide Intelligence Page.');

                let $intelligence = document.getElementById('intelligence');
                Utils.removeClass($intelligence, 'page--ready');
                Utils.removeClass($intelligence, 'page--show');
            });
        },

        initMenu: function() {

            let menuControls = {
                page: 'intelligence',
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

        playIntelligenceVideo: function() {
            Utils.Events.emit('video:play', 'intelligence');
        }
    });

    module.exports = Intelligence;
})();