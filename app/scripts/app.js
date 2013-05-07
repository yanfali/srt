/*global define, Backbone, $ */
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
    SrtApp.vent.on('warning:load:subtitles', function() {
        SrtApp.workarea.currentView.trigger('flash:dragtome');
    });

    var playerVent = new Backbone.Wreqr.EventAggregator();
    var playerLayout = new uilib.views.PlayerLayout();
    SrtApp.playback.show(playerLayout);

    playerLayout.controls.attachView(new uilib.views.PlayerControlView({
        vent: playerVent,
        collection: subtitles
    }));
    playerLayout.timer.attachView(new uilib.views.PlayerTimerView({
        vent: playerVent
    }));
    playerLayout.playtext.attachView(new uilib.views.PlayerTextView({
        vent: playerVent,
        collection: subtitles
    }));

    playerVent.on('player:no:subtitles:loaded', function() {
        SrtApp.vent.trigger('warning:load:subtitles');
        console.log('player stopping no subs loaded.');
    });
    SrtApp.workarea.currentView.on('loaded', function() {
        console.log('sending trigger for loaded!');
        playerVent.trigger('file:loaded');
    });

    $('body').on('keyup', function(event) {
        console.log('you pushed ' + event.keyCode);
        if (event.keyCode === 32) {
            playerVent.trigger('control:toggleplay');
        }
        return false;
    });

    return SrtApp;
});

// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
