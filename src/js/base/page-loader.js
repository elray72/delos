/** ====================================================================================================================
 // Page Loader
 // ================================================================================================================= */

(function () {

    // Dependencies
    const Log = require('bows')('Pages');
    const Assign = require('lodash/assign');
    const Utils = require('./utils');

    let _this = {};
    let PageLoader = function () {

        Assign(this);
        _this = this;
        window.currentPage = null;
        window.pageList = [];
    };

    PageLoader.prototype = {

        init: function () {
            Log('Pages initialised.');

            Utils.Events.on('page:show', function (elemId, options) {
                _this.showPage(elemId, options);
            });

            // page load
            document.addEventListener('DOMContentLoaded', function() {
                _this.updatePageList();
            });

            // load first page
            Utils.Events.emit('page:show', 'home');
        },

        showPage: function (elemId, options) {

            let $page = document.getElementById(elemId);
            if ($page) {
                _this.updatePageList();
                _this.togglePage(elemId, options);
            }
        },

        updatePageList: function($page) {

            // add function
            function addToPageList($page) {
                if (!window.pageList[$page.id]) {
                    window.pageList[$page.id] = {
                        id: $page.id,
                        $el: $page,
                        visible: Utils.hasClass($page, 'page--show')
                    }
                }
            }

            // single add
            if ($page) {
                addToPageList($page);
                return;
            }

            // add all found
            let $pages = document.querySelectorAll('.page');
            Utils.forEach($pages, function ($p) {
                addToPageList($p);
            });
        },

        togglePage: function(elemId, options) {

            // show page
            let page = window.pageList[elemId];
            if (page) {

                Utils.addClass(page.$el, 'page--show');
                Utils.addClass(page.$el, 'page--ready');

                if (elemId === 'video_end') {
                    Utils.Events.emit(elemId + ':show', options);
                }
                else {
                    Utils.Events.emit(elemId + ':show');
                }

                if (elemId !== 'home') {
                    window.timeout.restartTimeout();
                }
            }
            else {
                Log('Page \'' + elemId + '\' not found.');
            }

            // animate other pages out
            Object.keys(window.pageList).forEach(function(key) {
                if (key !== elemId) {
                    let page = window.pageList[key];
                    if (page) {
                        Utils.removeClass(page.$el, 'page--ready');
                    }
                }
            });

            // hide other pages after animation ends
            setTimeout(function () {
                Object.keys(window.pageList).forEach(function(key) {
                    if (key !== elemId) {
                        let page = window.pageList[key];
                        if (page) {
                            Utils.removeClass(page.$el, 'page--show');
                            Utils.Events.emit(key + ':hide');
                        }
                    }
                });
            }, 1000);
        }
    };

    module.exports = PageLoader;
})();

