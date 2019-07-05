/** ====================================================================================================================
 // VideoPlayer
 // ================================================================================================================= */
'use strict';

(function () {

    // Dependencies
    const Log = require('bows')('VideoPlayer');
    const Assign = require('lodash/assign');
    const Utils = require('../../../js/base/utils');
    const playlistData = require('../../../media/playlist');
    const animationDuration = 500;

    let _this = {};
    let VideoPlayer = function (options) {
        Log('VideoPlayer initialised.');

        Assign(this, options);
        _this = this;
        _this.$el = this.el;
    };

    Assign(VideoPlayer.prototype, {

        // INIT
        init: function () {

            // elements
            _this.$videoPlayer = document.getElementById('video_player');

            // video player
            _this.playlist = _this.getPlaylist();
            _this.video = _this.$videoPlayer.querySelector('video');
            _this.videoId = _this.video.getAttribute('data-video-id');
            _this.videoData = _this.playlist[_this.videoId];
            _this.isExperiencePreloaded = false;
            window.experienceVideoPlays = [];

            // toggle play pause on click
            _this.$videoPlayer.addEventListener('click', function (e) {
                e.stopPropagation();
                _this.toggleVideo();
            });

            // swipe next on video
            Utils.SwipeDetect(_this.$videoPlayer, function(direction) {
                _this.onVideoSwipe(direction);
            });

            // event - play video
            Utils.Events.on('video:play', function (videoId) {
                _this.playVideo(videoId);
            });

            // event - play pause
            Utils.Events.on('video:pause', function () {
                _this.toggleVideo('pause');
            });

            // event - toggle video
            Utils.Events.on('video:toggle', function (action) {
                _this.toggleVideo(action);
            });

            // event - pause video
            Utils.Events.on('video:resume', function () {
                _this.toggleVideo('play');
            });

            // event - pause video
            Utils.Events.on('video:replay', function () {
                _this.toggleVideo('replay');
            });

            // event - pause video
            Utils.Events.on('experience:show', function () {
                setTimeout(function () {
                    if (!window.isExperiencePreloaded) {
                        _this.preloadExperienceVideos();
                        window.isExperiencePreloaded = true;
                    }
                }, 1000);
            });
        },
        initVideoEvents: function() {

            _this.video.addEventListener('playing', _this.onVideoPlaying.bind(_this));
            _this.video.addEventListener('pause', _this.onVideoPaused.bind(_this));
            _this.video.addEventListener('ended', _this.onVideoEnded.bind(_this));
        },
        getPlaylist: function () {

            let playlist = [];
            Utils.forEach(playlistData.videos, function(v) {
                playlist[v.id] = v;
            });
            return playlist;
        },

        // PLAY / LOAD / PAUSE
        playVideo: function(videoId) {

            // do nothing - video already loaded
            if (videoId === _this.videoId) {
                _this.toggleVideo('play');
                return;
            }

            // load video
            let videoData = _this.playlist[videoId];
            if (videoData) {

                window.videoLoading = true;
                _this.videoId = videoId;
                _this.videoData = videoData;

                let currVideo = _this.video;
                let currVideoData = _this.playlist[_this.video.getAttribute('data-video-id')];
                let nextVideoData = videoData;
                _this.loadVideo(nextVideoData, function(nextVideo) {

                    // next video
                    _this.$videoPlayer.appendChild(nextVideo);

                    // seamless transition
                    if (nextVideoData.transitionIn === 'seamless') {

                        // show next video
                        Utils.addClass(nextVideo, nextVideoData.transitionIn);
                        setTimeout(function () {
                            Utils.addClass(nextVideo, 'visible');
                            Utils.removeClass(currVideo, currVideoData.transitionIn);
                            _this.video = nextVideo;
                            _this.initVideoEvents();
                            window.videoLoading = false;
                            _this.cleanVideoPlayer();
                        }, animationDuration);

                        // remove current video
                        Utils.addClass(currVideo, currVideoData.transitionOut);
                        setTimeout(function () {
                            Log('VIDEO: destroyed', currVideoData.src);
                            currVideo.remove();
                        }, animationDuration);
                    }

                    // fade in  transition
                    else {

                        // show next video
                        setTimeout(function () {
                            Utils.addClass(nextVideo, nextVideoData.transitionIn);
                            setTimeout(function () {
                                Utils.addClass(nextVideo, 'visible');
                                Utils.removeClass(currVideo, currVideoData.transitionIn);
                                _this.video = nextVideo;
                                _this.initVideoEvents();
                                window.videoLoading = false;
                            }, animationDuration);

                        }, animationDuration);

                        // remove current video
                        Utils.addClass(currVideo, currVideoData.transitionOut);
                        setTimeout(function () {
                            Log('VIDEO: destroyed', currVideoData.src);
                            currVideo.remove();
                        }, animationDuration);
                    }
                });

                if (videoData.category === 'experience') {
                    if (window.experienceVideoPlays.indexOf(videoId) === -1 ) {
                        setTimeout(function () {
                            window.experienceVideoPlays.push(videoId);
                        }, 2000);
                    }
                    Utils.addClass(window.$navMenuVideo, 'pause');
                    Utils.removeClass(window.$navMenuVideo, 'play');
                }
            }
        },
        loadVideo: function(videoData, callback) {

            let video = document.createElement('video');
            video.src = videoData.src;
            video.setAttribute('data-video-id', videoData.id);
            video.setAttribute('preload', 'true');
            video.setAttribute('muted', 'true');

            if (videoData.poster) video.setAttribute('poster', videoData.poster);
            if (videoData.loop) video.setAttribute('loop', 'true');
            if (videoData.autoplay !== false) video.setAttribute('autoplay', 'true');

            callback(video);
        },
        toggleVideo: function(action) {

            // cancel pausing if not experienced or intelligence videos
            if (_this.videoData.category === 'menu') {
                return;
            }

            if (action === 'replay') {
                _this.video.load();
                _this.video.play();
                Utils.addClass(window.$navMenuVideo, 'pause');
                Utils.removeClass(window.$navMenuVideo, 'play');
                return;
            }

            if (action === 'play') {
                _this.video.play();
                Utils.addClass(window.$navMenuVideo, 'pause');
                Utils.removeClass(window.$navMenuVideo, 'play');
                return;
            }

            if (_this.video.playing || action === 'pause') {
                _this.video.pause();
                Utils.addClass(window.$navMenuVideo, 'play');
                Utils.removeClass(window.$navMenuVideo, 'pause');
            }
            else {
                _this.video.play();
                Utils.addClass(window.$navMenuVideo, 'pause');
                Utils.removeClass(window.$navMenuVideo, 'play');
            }
        },
        cleanVideoPlayer: function() {
            setTimeout(function () {
                let videoElems = _this.$videoPlayer.querySelector('video');
                for (let i = 0; i < videoElems.length; i++) {
                    if (videoElems[i].getAttribute('data-video-id') !== _this.videoId) {
                        videoElems[i].remove();
                    }
                }
            }, 0);
        },

        // VIDEO EVENT HANDLERS
        onVideoPlaying: function() {
            Log('VIDEO: playing ' + _this.videoData.src + '.');

            // load next action
            _this.loadPlaylistAction(_this.videoData.onVideoPlaying);

            // update which experience video have been played
            if (_this.videoData.category === 'experience') {

                Utils.Events.emit('experience:playing');
                if (window.experienceVideoPlays.indexOf(_this.videoId) === -1 ) {
                    window.experienceVideoPlays.push(_this.videoId);
                }
            }
        },
        onVideoPaused: function() {
            Log('VIDEO: paused ' + _this.videoData.src + '.');

            // emit event
            if (_this.videoData.category === 'experience') {
                Utils.Events.emit('experience:pause');

                Utils.addClass(window.$navMenuVideo, 'play');
                Utils.removeClass(window.$navMenuVideo, 'pause');
            }
        },
        onVideoEnded: function() {
            Log('VIDEO: ended ' + _this.videoData.src + '.');

            // emit event
            Utils.Events.emit('video:ended');

            // load next action
            if (_this.videoData.category === 'experience') {
                if (window.experienceVideoPlays.indexOf('wake') == -1 ||
                    window.experienceVideoPlays.indexOf('energise') == -1 ||
                    window.experienceVideoPlays.indexOf('daily_routine') == -1 ||
                    window.experienceVideoPlays.indexOf('wind_down') == -1 ||
                    window.experienceVideoPlays.indexOf('sleep') == -1) {

                    _this.loadPlaylistAction(_this.videoData.onVideoEnded);
                }
            }
            else {
                _this.loadPlaylistAction(_this.videoData.onVideoEnded);
            }

            if (_this.videoId === 'intelligence') {
                Utils.Events.emit('page:show', 'video_end', { videoId: _this.videoId });
            }
            else if (_this.videoData.category === 'experience') {

                Log(window.experienceVideoPlays);
                Log('wake', window.experienceVideoPlays.indexOf('wake'));
                Log('energise', window.experienceVideoPlays.indexOf('energise'));
                Log('daily_routine', window.experienceVideoPlays.indexOf('daily_routine'));
                Log('wind_down', window.experienceVideoPlays.indexOf('wind_down'));
                Log('sleep', window.experienceVideoPlays.indexOf('sleep'));

                if (window.experienceVideoPlays.indexOf('wake') > -1 &&
                    window.experienceVideoPlays.indexOf('energise') > -1 &&
                    window.experienceVideoPlays.indexOf('daily_routine') > -1 &&
                    window.experienceVideoPlays.indexOf('wind_down') > -1 &&
                    window.experienceVideoPlays.indexOf('sleep') > -1) {
                    Utils.Events.emit('page:show', 'video_end', { videoId: _this.videoId });
                }
            }
        },
        onVideoSwipe: function(direction) {

            if (direction === 'left') {

                if (_this.videoData.category === 'intro') {
                    _this.loadPlaylistAction(_this.videoData.onVideoEnded, {
                        videoId: _this.videoId
                    });
                }

                if (_this.videoData.category === 'intelligence') {
                    _this.video.pause();
                    setTimeout(function () {
                        Utils.Events.emit('page:show', 'video_end', { videoId: _this.videoId });
                    }, 250);
                }
            }
        },

        // PLAYLIST
        loadPlaylistAction: function(action, options) {

            if (action) {
                let tokens = action.split(' '); // eg: 'page:show experience'
                Log('VIDEO: ' + tokens[0], tokens[1]);
                Utils.Events.emit(tokens[0], tokens[1], options);
                window.timeout.restartTimeout();
            }
        },
        preloadExperienceVideos: function() {

            let $head = document.querySelector('head');
            Utils.forEach(playlistData.videos, function(v) {
                if (v.category === 'experience') {
                    let $preload = document.createElement('link');
                    $preload.setAttribute('rel', 'preload');
                    $preload.setAttribute('as', 'video');
                    $preload.setAttribute('href', v.src);
                    $head.appendChild($preload);
                }
            });
        }
    });

    // VIDEO EXTENSIONS
    HTMLMediaElement.prototype.transitionIn = function (transition, callback, timing) {

        if (!timing) timing = 0;
        let video = this;

        Utils.addClass(video, transition);
        setTimeout(function () {
            Utils.addClass(video, 'visible');
            Utils.removeClass(video, transition);
            callback();
        }, timing);
    };
    HTMLMediaElement.prototype.transitionOut = function (transition, callback, timing) {

        if (!timing) timing = 0;
        let video = this;
        setTimeout(function () {
            Utils.addClass(video, transition);
            callback();
        }, timing);
    };
    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function() {
            let video = this;
            return !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
        }
    });

    // GLOBAL ACCESSORS
    window.playVideo = function(videoId) {
        Utils.Events.emit('video:play', videoId);
    };

    module.exports = VideoPlayer;
})();



