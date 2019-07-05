/** ====================================================================================================================
 // Delos
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('GlobalNavigation');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');
    
    const ElementsMenu = require('../../elements-menu/js/elements-menu');
    let elementsMenu = new ElementsMenu();
    
    const MoreInfo = require('../../more-info/js/more-info');
    let moreInfo = new MoreInfo();

    let _this = {};
    let GlobalNavigation = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
        window.$navMenuVideo = document.getElementById('nav_menu_video');
    };

    Assign(GlobalNavigation.prototype, {

        secondPreviousControls: {
            page: 'page',
            back_button: 'back_button',
            page_title: 'page_title',
            visibility: {
                nav_back: true,
                nav_title: true,
                nav_intelligence: true,
                nav_more_info: true,
                nav_menu: true
            }
        },

        previousControls: {
            page: 'page',
            back_button: 'back_button',
            page_title: 'page_title',
            visibility: {
                nav_back: true,
                nav_title: true,
                nav_intelligence: true,
                nav_more_info: true,
                nav_menu: true
            }
        },

        currentControls: {
            page: 'page',
            back_button: 'back_button',
            page_title: 'page_title',
            visibility: {
                nav_back: true,
                nav_title: true,
                nav_intelligence: true,
                nav_more_info: true,
                nav_menu: true
            }
        },

        backButtonBusy: false,

        /**
         * Init.
         *
         * Sets up the global navigation.
         */
        init: function () {
            Log('Global Navigation initialised.');

            _this.attachMenuIconClick();
            _this.attachBackIconClick();
            _this.attachIntelligenceClick();
            _this.attachMoreInfoClick();
            _this.attachNavMenuVideoClick();
            _this.listenToEvents();
        },

        /**
         * Run Global Navigation.
         *
         * Applies new settings to Global Navigation.
         *
         * @param {Obj}    menuControls    This object is passed to GlobalNavigation from another component
         *                                 and determins which navigation items are visible, the page tite
         *                                 and the functionality of the back button.
         * const menuControls = {
         *     page: 'darwin_elements',
         *     back_button: 'home.init',
         *     page_title: 'Darwin Elements',
         *     visibility: {
         *          nav_back: true,
         *          nav_title: true,
         *          nav_intelligence: true,
         *          nav_more_info: false,
         *          nav_menu: true
         *      }
         *  }
         */
        runGlobalNavigation: function(menuControls) {
            Log('Global Navigation run.');

            if(_this.currentControls.page !== 'element_page') {
                _this.secondPreviousControls = _this.previousControls;
                _this.previousControls = _this.currentControls;
            }
            _this.currentControls = menuControls;

            _this.setNavigationTitle(menuControls.page_title);
            _this.showGlobalNav(0);
            _this.setNavigationVisibility(menuControls.visibility);
        },

        /**
         * Set Navigation Title.
         *
         * Sets the page title in the left side global navigation.
         *
         * @param {String}    pageTitle    This text is rendered in the DOM as the page title.
         */
        setNavigationTitle: function(pageTitle) {
            let $navigationTitle = document.getElementById('nav_title');

            $navigationTitle.innerHTML = pageTitle;
        },

        /**
         * Set Navigation Visibility.
         *
         * Shows or hides the navigation items depending on the object provided.
         *
         * @param {Obj}    visibilityControl    This object contains true and false values for each
         *                                      menu item which determine if they are visible or not.
         * const visibilityControl = {
         *     visibility: {
         *          nav_back: true,
         *          nav_title: true,
         *          nav_intelligence: true,
         *          nav_more_info: false,
         *          nav_menu: true
         *      }
         *  }
         */
        setNavigationVisibility: function (visibilityControl) {
            Utils.forEach(visibilityControl, function(show, menuItem) {
                if(show) {
                    _this.showMenuItem(menuItem);
                }
                else {
                    _this.hideMenuItem(menuItem);
                }
            });
        },

        /**
         * Show Menu Item.
         *
         * Shows a menu item.
         *
         * @param {String}    menuItem    This is the ID of the menu item.
         */
        showMenuItem: function(menuItem) {
            let $menuItem = document.getElementById(menuItem);

            setTimeout(function() {
                Utils.addClass($menuItem, 'visible');
            }, 200);
        },

        /**
         * Hide Menu Item.
         *
         * Hides a menu item.
         *
         * @param {String}    menuItem    This is the ID of the menu item.
         */
        hideMenuItem: function(menuItem) {
            let $menuItem = document.getElementById(menuItem);

            Utils.removeClass($menuItem, 'visible');
        },

        /**
         * Attach Menu Icon Click.
         *
         * Attaches the click event listener for the menu icon.
         */
        attachMenuIconClick: function() {
            var $menuIcon = document.getElementById('nav_menu');

            $menuIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (Utils.hasClass($menuIcon, 'visible')) {
                    Utils.Events.emit('show_elements_menu');
                    window.timeout.restartTimeout();
                }
            });
        },

        /**
         * Attach Back Icon Click.
         *
         * Attaches the click event listener for the back icon.
         */
        attachBackIconClick: function() {
            var $menuIcon = document.getElementById('nav_back');
            var $menuTitle = document.getElementById('nav_title');

            $menuIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if(!_this.backButtonBusy) {
                    if(Utils.hasClass($menuIcon, 'visible')) {
                        Utils.Events.emit('trigger_back', _this.currentControls, _this.previousControls, _this.secondPreviousControls);
                        window.timeout.restartTimeout();
                    }
                }
            });

            $menuTitle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if(!_this.backButtonBusy) {
                    if(Utils.hasClass($menuIcon, 'visible')) {
                        Utils.Events.emit('trigger_back', _this.currentControls, _this.previousControls, _this.secondPreviousControls);
                        window.timeout.restartTimeout();
                    }
                }
            });
        },

        /**
         * Attach More Info Click.
         *
         * Attaches the click event listener for the more info button.
         */
        attachMoreInfoClick: function() {
            var $moreInfoButton = document.getElementById('nav_more_info');

            $moreInfoButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (Utils.hasClass($moreInfoButton, 'visible')) {
                    Utils.Events.emit('show_more_info_page');
                    window.timeout.restartTimeout();
                }
            });
        },

        /**
         * Attach Nav Menu Video Click.
         *
         * Attaches the click event listener for the video play/pause button on the global nav.
         */
        attachNavMenuVideoClick: function() {

            window.$navMenuVideo.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                Utils.Events.emit('video:toggle');
            });
        },

        /**
         * Attach Intelligence Click.
         *
         * Attaches the click event listener for the intelligence button.
         */
        attachIntelligenceClick: function() {
            var $intelligenceButton = document.getElementById('nav_intelligence');

            $intelligenceButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (Utils.hasClass($intelligenceButton, 'visible')) {
                    Utils.Events.emit('page:show', 'intelligence');
                    elementsMenu.destroy(false);
                    window.timeout.restartTimeout();
                }
            });
        },

        /**
         * Listen To Events.
         *
         * Contains all event listeners.
         *
         * @param {Obj}    backFunction    This is a function that has been passed through the
         *                                 menuControl which is triggered when clicking the back
         *                                 icon.
         */
        listenToEvents: function() {

            Utils.Events.on('show_elements_menu', function(a) {
                elementsMenu.run();
            });

            Utils.Events.on('trigger_back', function(currentControls, previousControls, secondPreviousControls) {
                if(typeof currentControls.back_button === 'function' && !_this.backButtonBusy) {
                    _this.backButtonBusy = true;

                    if(currentControls.page === 'darwin_elements') {
                        window.globalNavigation.runGlobalNavigation(previousControls);
                        currentControls.back_button(true);
                    }
                    else if(currentControls.page === 'video_end_experience' || currentControls.page === 'video_end_intelligence') {
                        window.globalNavigation.runGlobalNavigation(secondPreviousControls);

                        currentControls.back_button(secondPreviousControls.page);
                    }
                    else {
                        currentControls.back_button();
                    }

                    window.timeout.restartTimeout();

                    setTimeout(function() {
                        _this.backButtonBusy = false;
                    }, 1500);
                }
            });

            Utils.Events.on('show_more_info_page', function(a) {
                moreInfo.run();
            });

            Utils.Events.on('experience:show', function () {
                Utils.addClass(window.$navMenuVideo, 'active');
            });
        },

        /**
         * Show Global Nav.
         *
         * shows the Global Navigation.
         *
         * @param {int}    timeout    The length of time that should be waited before hiding
         *                            the global navigation.
         */
        showGlobalNav: function(timeout) {
            let $globalNavigation = document.getElementById('global_navigation');

            setTimeout(function() {
                Utils.removeClass($globalNavigation, 'hide');
            }, timeout);
        },

        /**
         * Hide Global Nav.
         *
         * Hides the Global Navigation.
         *
         * @param {int}    timeout    The length of time that should be waited before hiding
         *                            the global navigation.
         */
        hideGlobalNav: function(timeout) {
            let $globalNavigation = document.getElementById('global_navigation');

            setTimeout(function() {
                Utils.addClass($globalNavigation, 'hide');
            }, timeout);
        }

    });

    module.exports = GlobalNavigation;
})();

