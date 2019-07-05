/** ====================================================================================================================
 // Debug
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('Debug');
    const Assign = require('lodash/assign');
    const Utils = require('../../js/base/utils');

    let _this = {};
    let Debug = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(Debug.prototype, {

        init: function () {
            Log('Debug initialised.');

            let mode = Utils.getQueryStringValue('m');
            if (mode !== 'debug') return;

            _this.$body = document.querySelector('body');
            Utils.addClass(_this.$body, 'dev');

            // create debug span
            let $debugMsg = document.createElement('span');
            Utils.addClass($debugMsg, 'dev__msg');
            $debugMsg.setAttribute('id', 'dev_msg');
            _this.$body.appendChild($debugMsg);

            // event listeners
            setTimeout(function () {
                _this.debugViewport();
            }, 0);
        },

        debugViewport: function() {
            Utils.Debug.log('VIEWPORT: ' + window.innerWidth + 'x' + window.innerHeight + 'px');
            window.addEventListener('resize', function () {
                Utils.Debug.log('VIEWPORT: ' + window.innerWidth + 'x' + window.innerHeight + 'px');
            });
        }
    });

    module.exports = Debug;
})();