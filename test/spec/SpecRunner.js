/*global require, mocha */
'use strict';
require.config({
    baseUrl: '../',
    paths: {
        jquery: 'app/components/jquery/jquery',
        bootstrap: 'app/scripts/vendor/bootstrap',
        underscore: 'app/components/underscore/underscore',
        backbone: 'app/components/backbone/backbone',
        marionette: 'app/components/backbone.marionette/lib/backbone.marionette',
        'backbone.augment': 'app/components/backbone.marionette/public/javascripts/backbone.augment',
        'backbone.wreqr': 'app/components/backbone.marionette/public/javascripts/backbone.wreqr',
        'backbone.babysitter': 'app/components/backbone.marionette/public/javascripts/backbone.babysitter',
        'mocha': 'test/lib/mocha/mocha',
        'chai': 'test/lib/chai',
        'app': 'app/scripts/app',
        'views': 'app/scripts/views',
        'models': 'app/scripts/models'
    },
    shim: {
        backbone: {
            deps: ['underscore','jquery'],
            exports: 'Backbone'
        },
        'backbone.augment': {
            deps: ['backbone']
        },
        'backbone.wreqr': {
            deps: ['backbone']
        },
        'backbone.babysitter': {
            deps: ['backbone', 'marionette']
        },
        marionette: {
            deps: ['backbone'],
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        underscore: {
            exports: '_'
        }
    }
});

require(['app', 'jquery', 'require', 'chai', 'mocha', 'bootstrap', 'underscore', 'backbone', 'backbone.augment', 'backbone.wreqr', 'marionette', 'backbone.babysitter'], function (app, $, require, chai) {
    // use app here
    console.log(app);
    window.app = app;
    console.log('Running jQuery %s', $().jquery);

    chai.should();
    mocha.setup('bdd');

    require([
        'spec/test.js'
    ], function() {
        mocha.run();
    });
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
