/** ====================================================================================================================
// App
// ================================================================================================================== */
'use strict';

const GlobalNavigation = require('../components/global-navigation/js/global-navigation');
window.globalNavigation = new GlobalNavigation();
window.globalNavigation.init();

const PageLoader = require('./base/page-loader');
const pageLoaderInstance = new PageLoader();
pageLoaderInstance.init();

const Timeout = require('../components/timeout/js/timeout');
window.timeout = new Timeout();
window.timeout.init();

const ComponentManager = require('./base/component-manager');
const componentMangerInstance = new ComponentManager();
componentMangerInstance.init();