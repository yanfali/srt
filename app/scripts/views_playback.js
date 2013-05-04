/*global define, Backbone, $ */
define(['underscore', 'marionette', 'models', 'views_subtitle'], function(_) {
    'use strict';
    var playbackRegion = Backbone.Marionette.Region.extend({
        el: '.playback'
    });
    var playerControlView = Backbone.Marionette.View.extend({
        el: '.controls',
        collection: null,
        vent: null,
        initialize: function(opts) {
            if (opts.collection) {
                this.collection = opts.collection;
            } else {
                throw new Error('Need a collection!');
            }
            if (opts.vent) {
                this.vent = opts.vent;
            } else {
                throw new Error('Need an vent aggregator!');
            }
        },
        events: {
            'click': 'handleClick'
        },
        handleClick: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var $target = $(e.target);
            if ($target.is('a.btn\\ play') || $target.is('i.icon-play')) {
                this.vent.trigger('control:start');
            }
            if ($target.is('a.btn\\ stop') || $target.is('i.icon-stop')) {
                this.vent.trigger('control:stop');
            }
            if ($target.is('a.btn\\ step-backward') || $target.is('i.icon-step-backward')) {
                this.vent.trigger('control:back');
            }
            if ($target.is('a.btn\\ step-forward') || $target.is('i.icon-step-forward')) {
                this.vent.trigger('control:forward');
            }
        }
    });
    var PlayerTimerView = Backbone.Marionette.View.extend({
        el: '.timer',
        vent: null,
        initialize: function(opts) {
            if (opts.vent) {
                this.vent = opts.vent;
            } else {
                throw new Error('vent Event aggregator needed');
            }
            _.bindAll(this, 'start', 'stop');
            this.vent.on('control:start', this.start);
            this.vent.on('control:stop', this.stop);
        },
        timer: null,
        start: function() {
            console.log('received start');
            if (this.timer !== null) {
                return;
            }
        },
        stop: function() {
            console.log('received stop');
        }
    });
    var PlayerLayout = Backbone.Marionette.Layout.extend({
        template: '#player-template',
        regions: {
            timer: '.timer',
            controls: '.controls',
            playtext: '.play-text'
        }
    });
    var lib = {
        PlaybackRegion: playbackRegion,
        PlayerControlView: playerControlView,
        PlayerLayout: PlayerLayout,
        PlayerTimerView: PlayerTimerView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
