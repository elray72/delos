/** ====================================================================================================================
// Utils
// ================================================================================================================= */
'use strict';

const Log = require('bows')('Utils');
const EventEmitter = require('events').EventEmitter;

let Utils = {

    // Lodash
    find: require('lodash/find'),
    get: require('lodash/get'),
    set: require('lodash/set'),
    forEach: require('lodash/forEach'),
    isArray: require('lodash/isArray'),

    // DOM
    addClass: function(el, className) {
        if (el) {
            if (el.classList) {
                el.classList.add(className);
            }
            else {
                el.className += ' ' + className;
            }
        }
        else {
            return false;
        }
    },
    removeClass: function(el, className) {
        if (el) {
            if (el.classList) {
                el.classList.remove(className);
            }
            else {
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }
        else {
            return false;
        }
    },
    hasClass: function(el, className) {
        if (el) {
            if (el.classList) {
                return el.classList.contains(className);

            }
            else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
            }
        }
        else {
            return false;
        }
    },
    replaceAll : function(str, search, replacement) {
        return str.replace(new RegExp(search, 'g'), replacement);
    },

    // HREF
    getQueryStringValue: function (field, url) {

        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    }
};

// Events
Utils.Events = new EventEmitter();
Utils.Events.setMaxListeners(0);

// Swipe
Utils.SwipeDetect = function($el, callback) {

    var $swipeObj = $el,
        swipeDirection,
        startX,
        startY,
        distX,
        distY,
        minDist = 80,               // required min distance traveled to be considered swipe
        maxAngle = 100,             // max angle in perpendicular direction, eg, (swipe left & right) against (swipe up & down)
        allowedTime = 1200,         // max time allowed to travel that distance
        elapsedTime,
        startTime,
        handleSwipe = callback || function(swipeDirection){};

    //
    // Touch start - get initial coordinates
    var handleTouchStart = function(e) {
            var $touch = e.changedTouches[0];
            swipeDirection = 'none';
            startX = $touch.pageX;
            startY = $touch.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
            //e.preventDefault();
        },

        //
        // Prevent scrolling during touch movement on element
        handleTouchMove = function (e){
            //e.preventDefault();
        },

        //
        // Handle return on touch end
        handleTouchEnd = function(e) {

            var $touch = e.changedTouches[0];
            distX = $touch.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = $touch.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed

            // Comment: log if swipe meets time criteria
            // log('SWIPE DURATION:', elapsedTime, '<=', allowedTime, elapsedTime <= allowedTime);

            // swipe within allowed time
            if (elapsedTime <= allowedTime) {

                // Comment: log if swipe meets min distance + angle criteria
                // log('x:', Math.abs(distX), '>', minDist, '|', 'y:',  Math.abs(distY), '<', maxAngle);

                // horizontal swipe: swipe x distance > required, swipe y < distance
                if (Math.abs(distX) >= minDist && Math.abs(distY) <= maxAngle) {
                    swipeDirection = (distX < 0)? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
                }

                // vertical swipe: swipe x distance > required, swipe y < distance
                else if (Math.abs(distY) >= minDist && Math.abs(distX) <= maxAngle){
                    swipeDirection = (distY < 0)? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
                }
            }

            handleSwipe(swipeDirection);
            //e.preventDefault();
        };

    //
    // Events
    $swipeObj.addEventListener('touchstart', handleTouchStart, false);
    $swipeObj.addEventListener('touchmove', handleTouchMove, false);
    $swipeObj.addEventListener('touchend', handleTouchEnd, false);

};

// Debug
Utils.Debug = {
    log: function (msg) {
        let $devMsg = document.getElementById('dev_msg');
        if ($devMsg) {
            Utils.addClass($devMsg, 'dev__msg--show');
            $devMsg.innerHTML = msg;
        }
    }
}

module.exports = Utils;