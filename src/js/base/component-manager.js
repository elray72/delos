/** ====================================================================================================================
 // Component Manager
 // ================================================================================================================= */

const Log = require('bows')('Components');

const Components = {
    'home': require('../../components/home/js/home'),
    'experience': require('../../components/experience/js/experience'),
    'intelligence': require('../../components/intelligence/js/intelligence'),
    'elements-menu': require('../../components/elements-menu/js/elements-menu'),
    'video-player': require('../../components/video-player/js/video-player'),
    'timeout': require('../../components/timeout/js/timeout'),
    'more-info': require('../../components/more-info/js/more-info'),
    'video-end': require('../../components/video-end/js/video-end'),
    'debug': require('../../components/_debug/debug'),
};

let ComponentManager = function() {};
ComponentManager.prototype = {

    init: function () {
        Log('Components initialised.');
        this._setup();
    },

    _setup: function () {
        let $components = document.querySelectorAll('[data-component]');
        for (let i = 0; i < $components.length; i++) {
            this._initComponent($components[i]);
        }
    },

    _initComponent: function ($el) {
        let componentType = $el.getAttribute('data-component');
        let Component = typeof Components[componentType] === 'undefined' ? null : Components[componentType];
        if (Component !== null) {
            let component = new Component();
            component.init({ el: $el });
        }
    }
};

module.exports = ComponentManager;