'use strict';
require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        underscore: '../components/underscore/underscore',
        backbone: '../components/backbone/backbone',
        marionette: '../components/backbone.marionette/lib/backbone.marionette',
        'backbone.augment': '../components/backbone.marionette/public/javascripts/backbone.augment',
        'backbone.wreqr': '../components/backbone.marionette/public/javascripts/backbone.wreqr',
        'backbone.babysitter': '../components/backbone.marionette/public/javascripts/backbone.babysitter'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.augment': {
            deps: ['backbone']
        },
        'backbone.wreqr': {
            deps: ['backbone']
        },
        'backbone.babysitter': {
            deps: ['backbone']
        },
        marionette: {
            deps: ['backbone', 'backbone.augment', 'backbone.wreqr', 'backbone.babysitter'],
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

require(['app', 'jquery', 'bootstrap', 'underscore', 'backbone', 'backbone.augment', 'backbone.wreqr', 'marionette', 'backbone.babysitter'], function(app, $) {
    // use app here
    console.log(app);
    window.app = app;
    console.log('Running jQuery %s', $().jquery);
});
