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
    SrtApp.navbar.attachView(new uilib.views.NavBarView());
    var subtitles = new models.Subtitles();
    SrtApp.workarea.attachView(new uilib.views.WorkAreaView({
        collection: subtitles
    }));
    var PlayerLayout = Backbone.Marionette.Layout.extend({
        template: '#player-template',
        regions: {
            timer: '.timer',
            controls: '.controls',
            playtext: '.play-text'
        }
    });
    var playerLayout = new PlayerLayout();
    SrtApp.playback.show(playerLayout);
    playerLayout.controls.attachView(new uilib.views.PlayerControlView({collection: subtitles}));

    return SrtApp;
});

// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
