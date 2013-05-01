/*global define, Backbone */
define(['marionette', 'views', 'models', 'parse'], function(marionette, uilib, models, parse) {
    'use strict';
    var SrtApp = new Backbone.Marionette.Application();
    SrtApp.lib = uilib;
    SrtApp.model = models;
    SrtApp.parse = parse;
    SrtApp.addRegions({
        navbar: uilib.regions.NavRegion,
        workarea: uilib.regions.MainRegion,
        playback: uilib.regions.PlaybackRegion
    });
    SrtApp.navbar.show(new uilib.views.NavBarView());
    var subtitles = new models.Subtitles();
    SrtApp.workarea.show(new uilib.views.WorkAreaView({collection: subtitles}));
    SrtApp.playback.show(new uilib.views.PlayerView({collection: subtitles}));
    return SrtApp;
});

// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
