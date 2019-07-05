/** ====================================================================================================================
 // Video End
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('VideoEnd');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');
    
    const Home = require('../../home/js/home');
    let home = new Home();
    
    const Intelligence = require('../../intelligence/js/intelligence');
    let intelligence = new Intelligence();

    let _this = {};
    let VideoEnd = function (options) {

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(VideoEnd.prototype, {

        endingVideoID: '',

        /**
         * Init.
         *
         * Registers event listeners.
         */
        init: function () {
            Log('Video End initialised');

            _this.listenForPageShow();
            _this.listenForPageHide();
            _this.listenForPageClick();
            _this.listenForMoreInfoClick();
            _this.listenForReplayClick();
            _this.setEventListeners();

        },

        listenForPageShow: function() {
            Utils.Events.on('video_end:show', function (options) {

                window.currentPage = 'video_end';

                _this.endingVideoID = options.videoId;
                
                _this.setGlobalNavigationSettings();
                Utils.removeClass(window.$navMenuVideo, 'active');
                _this.setPageContent();
            });
        },

        listenForPageHide: function() {
            Utils.Events.on('video_end:hide', function () {
                let $videoEnd = document.getElementById('video_end');

                Utils.removeClass($videoEnd, 'page--ready');
                setTimeout(function () {
                    Utils.removeClass($videoEnd, 'page--show');
                }, 500)
            });
        },

        listenForPageClick: function() {
            let $videoEndPage = document.getElementById('video_end_page');

            $videoEndPage.addEventListener('click', function(e) {
                e.preventDefault();

                Utils.Events.emit('video_end_page_click');
            });
        },

        listenForMoreInfoClick: function() {
            let $videoEndMoreInfo = document.getElementById('video_end_more_info');

            $videoEndMoreInfo.addEventListener('click', function(e) {
                e.preventDefault();

                Utils.Events.emit('video_end_more_info_click');
            });
        },

        listenForReplayClick: function() {
            let $videoEndReplay = document.getElementById('video_end_replay');

            $videoEndReplay.addEventListener('click', function(e) {
                e.preventDefault();

                Utils.Events.emit('video_end_replay_click');
            });
        },

        setEventListeners: function() {
            Utils.Events.on('video_end_page_click', function () {
                Utils.Events.emit('intelligence:hide');
                Utils.Events.emit('video_end:hide');

                if(_this.endingVideoID === 'intelligence') {
                    Utils.Events.emit('video:play', 'intro');
                    window.currentPage = 'intro';
                    home.setIntroGlobalNav();
                }
                else {
                    Utils.Events.emit('page:show', 'intelligence');
                }
                
                window.timeout.restartTimeout();
            });


            Utils.Events.on('video_end_more_info_click', function () {
                Utils.Events.emit('show_more_info_page');
                
                window.timeout.restartTimeout();
            });
            

            Utils.Events.on('video_end_replay_click', function () {
                let page = '';

                if(_this.endingVideoID === 'intelligence') {

                    intelligence.initMenu();
                    Utils.Events.emit('video_end:hide');
                    setTimeout(function () {
                        Utils.Events.emit('video:replay');
                    }, 500);
                }
                else {
                    Utils.Events.emit('page:show', 'experience');
                    window.experienceVideoPlays = [];
                }

                window.timeout.restartTimeout();
            });
        },

        setGlobalNavigationSettings: function() {
            let menuControls = {};

            menuControls = {
                page: 'video_end_experience',
                back_button: _this.back,
                page_title: 'Experience Darwin',
                visibility: {
                    nav_back: true,
                    nav_title: true,
                    nav_intelligence: false,
                    nav_more_info: false,
                    nav_menu: false
                }
            }

            if(_this.endingVideoID === 'intelligence') {
                menuControls.page = 'video_end_intelligence';
                menuControls.page_title = 'Darwin Intelligence';
            }

            window.globalNavigation.runGlobalNavigation(menuControls);
        },

        getContent: function() {
            let content = {};

            if(_this.endingVideoID === 'intelligence') {
                content = {
                    video_end_page_icon: {
                        image: '/img/video-end/icons/experience.svg',
                        width: '2.6vw',
                        height: '5.09vh'
                    },
                    video_end_page_title: 'Experience Darwin',
                    video_end_replay_title: 'Replay Darwin Intelligence',
                    video_end_page: '/img/video-end/background/experience.jpg'
                }
            }
            else {
                content = {
                    video_end_page_icon: {
                        image: '/img/video-end/icons/intelligence.svg',
                        width: '2.6vw',
                        height: '5.09vh'
                    },
                    video_end_page_title: 'Darwin Intelligence',
                    video_end_replay_title: 'Replay Experience Darwin',
                    video_end_page: '/img/video-end/background/intelligence.jpg',
                }
            }

            return content;
        },

        setPageContent: function() {
            let pageContent = _this.getContent();
            let $element = {};

            Utils.forEach(pageContent, function(value, key) {
                $element = document.getElementById(key);

                if(key === 'video_end_page_icon') {
                    $element.style = 'width: '+value.width+'; height: '+value.height+';';
                    $element.src = value.image;
                    $element.alt = pageContent.video_end_page_title;
                }
                else if (key === 'video_end_page') {
                    $element.style = "background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('"+value+"')";
                }
                else {
                    $element.innerHTML = value;
                }
            });
        },

        back: function(page) {
            Utils.Events.emit('video_end:hide');

            if(_this.endingVideoID === 'intelligence') {
                Utils.Events.emit('intelligence:hide');

                if(page === 'home') {
                    Utils.Events.emit('page:show', 'home');
                }
                else if(page === 'video_end_experience') {
                    Utils.Events.emit('page:show', 'experience');
                }
                else if(page === 'video_end_intelligence') {
                    Utils.Events.emit('page:show', 'home');
                }
                else {
                    Utils.Events.emit('show_elements_menu');
                }
            }
            else {
                Utils.Events.emit('page:show', 'experience');
            }

        }

    });

    module.exports = VideoEnd;
})();