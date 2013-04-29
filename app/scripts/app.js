/*global define, Backbone */
define(['marionette', 'views', 'models'], function(marionette, uilib, models) {
    'use strict';
    var SrtApp = new Backbone.Marionette.Application();
    SrtApp.lib = uilib;
    SrtApp.model = models;
    SrtApp.addRegions({
        navbar: uilib.regions.NavRegion
    });
    SrtApp.navbar.show(new uilib.views.NavBarView());
    return SrtApp;
});

// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
