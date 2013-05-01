/*global define, Backbone */
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
        handleClick: function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log(e.target);
        }
    });
    var lib = {
        PlaybackRegion: playbackRegion,
        PlayerView: playbackView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
