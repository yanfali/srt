/*global define, Backbone, $ */
define(['marionette', 'models', 'views_subtitle'], function() {
    'use strict';
    var playbackRegion = Backbone.Marionette.Region.extend({
        el: '#playback',
        open: function(view) {
            var $nav = this.$el.find('.player');
            console.log('open: adding playerback view');
            view.setElement($nav[0]);
        }
    });
    var playbackView = Backbone.Marionette.View.extend({
        events: {
            'click .controls': 'handleClick'
        },
        ui: {
            timer: '.timer',
            playtext: '.play-text'
        },
        handleClick: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var $target = $(e.target);
            if ($target.is('a.btn\\ play') || $target.is('i.icon-play')) {
                console.log('play');
            }
            if ($target.is('a.btn\\ stop') || $target.is('i.icon-stop')) {
                console.log('stop');
            }
            if ($target.is('a.btn\\ step-backward') || $target.is('i.icon-step-backward')) {
                console.log('back');
            }
            if ($target.is('a.btn\\ step-forward') || $target.is('i.icon-step-forward')) {
                console.log('forward');
            }
        },
        initialize: function(opts) {
            if (opts.collection) {
                this.collection = opts.collection;
            } else {
                throw new Error('Need a collection!');
            }
        }
    });
    var lib = {
        PlaybackRegion: playbackRegion,
        PlayerView: playbackView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
