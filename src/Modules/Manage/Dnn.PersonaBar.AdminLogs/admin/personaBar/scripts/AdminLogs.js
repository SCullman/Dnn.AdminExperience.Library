﻿define(['jquery', './extension',
    '../scripts/config'], function ($, ext, cf) {
        'use strict';
        var isMobile;
        var identifier;

        var utility;
        var config = cf.init();

        function loadScript() {
            var url = "scripts/bundles/adminLogs-bundle.js";
            $.ajax({
                dataType: "script",
                cache: true,
                url: url
            });
        }

        var init = function (wrapper, util, params, callback) {
            identifier = params.identifier;
            utility = util;

            window.dnn.initAdminLogs = function initializeAdminLogs() {
                return {
                    utility: utility,
                    moduleName: 'AdminLogs'
                };
            };
            loadScript();

            if (config.debugMode === true) {
                window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
            }

            if (typeof callback === 'function') {
                callback();
            }
        };

        var initMobile = function (wrapper, util, params, callback) {
            isMobile = true;
            this.init(wrapper, util, params, callback);
        };

        var load = function (params, callback) {
            if (typeof callback === 'function') {
                callback();
            }
        };

        var loadMobile = function (params, callback) {
            isMobile = true;
            this.load(params, callback);
        };

        return {
            init: init,
            load: load,
            initMobile: initMobile,
            loadMobile: loadMobile
        };
    });