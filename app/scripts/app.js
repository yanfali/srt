/*global define, $, Backbone */
define(['marionette', 'views', 'models'], function(marionette, uilib, models) {
    'use strict';
    var SrtApp = new Backbone.Marionette.Application();
    SrtApp.lib = uilib;
    SrtApp.model = models;
    SrtApp.addRegions({
        navbar: uilib.regions.NavRegion,
        workarea: uilib.regions.MainRegion
    });
    SrtApp.navbar.show(new uilib.views.NavBarView());
    SrtApp.workarea.show(new uilib.views.WorkAreaView());
    $('body').on('drop', function(e) { e.preventDefault(); });
    return SrtApp;
});

// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
