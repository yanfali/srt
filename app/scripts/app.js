/*global define, Backbone */
define(['marionette', './views'], function (marionette, uilib) {
    'use strict';
    var SrtApp = new Backbone.Marionette.Application();
    SrtApp.addRegions({
        navbar: uilib.regions.NavRegion
    });
    SrtApp.navbar.show(new uilib.views.NavBarView());
    return SrtApp;
});

// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
