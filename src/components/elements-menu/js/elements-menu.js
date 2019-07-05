/** ====================================================================================================================
 // Elements Menu
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('ElementsMenu');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');    

    const ElementPage = require('../../element-page/js/element-page');
    let elementPage = new ElementPage();

    let _this = {};
    let ElementsMenu = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(ElementsMenu.prototype, {

        startingPage: '',

        /**
         * Init.
         *
         * Registers event listeners.
         */
        init: function () {
            Log('Elements Menu initialised.');

            _this.listenToEvents();
        },

        /**
         * Run.
         *
         * Applies settings to Global Navigaton, initalises the Elements Menu page, injects it from the
         * template into the DOM.
         */
        run: function () {
            Log('Elements Menu run.');

            if(window.currentPage === 'home' || window.currentPage === 'experience') {
                _this.startingPage = window.currentPage;
            }

            window.currentPage = 'elements_menu';

            let $elementsMenu = document.getElementById('elements_menu');

            if(!$elementsMenu) {
                let menuControls = {
                    page: 'darwin_elements',
                    back_button: _this.destroy,
                    page_title: 'Darwin Elements',
                    visibility: {
                        nav_back: true,
                        nav_title: true,
                        nav_intelligence: true,
                        nav_more_info: true,
                        nav_menu: false
                    }
                };

                window.globalNavigation.runGlobalNavigation(menuControls);
                
                
                let $elementsMenuTemplate = _this.getElementsMenuTemplate();
                _this.injectMenu($elementsMenuTemplate);
                _this.activateMenu();
                _this.detectMenuItemClick();
                Utils.removeClass(window.$navMenuVideo, 'active');

                elementPage.init();
            }
        },

        /**
         * Get Elemnts Menu Template.
         *
         * Gets the inner HTML of the template, creates a DOM Object variable and injects the template into
         * the DOM Obj.
         *
         * @return {Obj}    $template    A DOM Object that contains the HTML for the Elements Menu Page
         */

        getElementsMenuTemplate: function() {
            let template = document.getElementById('elements_menu_template').innerHTML;
            let $template = document.createElement('div');
            $template.innerHTML = template;

            return $template;
        },

        /**
         * Inject Menu.
         *
         * Appends the Elemnts Menu page to body.
         *
         * @param {Obj}    $elementsMenu    A DOM Object that contains the HTML for the Elements Menu page
         */
        injectMenu: function($elementsMenu) {
            let $body = document.getElementsByTagName('body');

            $body[0].appendChild($elementsMenu);
        },

        /**
         * Activate Page.
         *
         * Applies the active class to the Elements Menu page, this is used to trigger CSS animations.
         */
        activateMenu: function() {
            let $elementsMenu = document.getElementById('elements_menu');

            setTimeout(function() {
                Utils.addClass($elementsMenu, 'active');
            }, 200);
        },

        /**
         * Detect Menu Item Click.
         *
         * Listens for a click event on an element button, this them triggers the show_element event.
         */
        detectMenuItemClick: function() {
            let elements = document.querySelectorAll('[data-element]');

            [].forEach.call(elements, $element => {
                $element.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if(!Utils.hasClass(e.currentTarget, 'open')) {
                        Utils.Events.emit('show_element', elements, $element);
                        window.timeout.restartTimeout();
                    }
                });
            });
        },

        /**
         * Listen To Events.
         *
         * Listens for events related to the Elements Menu page.
         */
        listenToEvents: function() {
            Utils.Events.on('show_element', function(elements, $clickedElement) {
                let elementOpen = false;

                [].forEach.call(elements, $element => {
                    if(Utils.hasClass($element, 'open')) {
                        elementOpen = true;
                    }
                });

                if(elementOpen) {
                    return false;
                }
                else {
                    [].forEach.call(elements, $element => {
                        if($clickedElement === $element) {
                            Utils.addClass($element, 'open');
                            _this.createElementVideo($element, 600);
                        }
                        else {
                            Utils.addClass($element, 'hide');
                        }
                    });

                    elementPage.run(_this.destroy, $clickedElement);
                    window.globalNavigation.hideGlobalNav(1150);
                }
            });
        },

        createElementVideo($element, delay) {

            let $videoContainer = $element.querySelector('.element-page__background-video');
            let video = document.createElement('video');
            let source = document.createElement('source');
            source.type = 'video/mp4';
            source.src = $videoContainer.getAttribute('data-src');
            video.appendChild(source);
            video.preload = true;
            video.muted = true;
            video.loop = true;
            video.autoplay = true;

            setTimeout(function () {
                $videoContainer.appendChild(video);
                Utils.addClass($videoContainer, 'active');
            }, delay);
        },

        /**
         * Destroy.
         *
         * Removes the active class to trigger a CSS animation, then once the animation is complete
         * removes the Elements Menu page from the DOM.
         */
        destroy: function(fromBackButton) {
            let $elementsMenu = document.getElementById('elements_menu');

            if($elementsMenu) {
                Utils.removeClass($elementsMenu, 'active');

                if(fromBackButton) {
                    if(_this.startingPage === 'home') {
                        Utils.Events.emit('page:show', 'home');
                    }
                    else if(_this.startingPage === 'experience') {
                        Utils.Events.emit('page:show', 'experience');
                    }
                }

                setTimeout(function() {
                    $elementsMenu.parentElement.remove();
                }, 300);
            }
        }
    });

    module.exports = ElementsMenu;
})();