/*global define, Backbone, $ */
define(['marionette', 'underscore', 'models', 'views_subtitle'], function(m, _, models) {
    'use strict';
    var playbackRegion = Backbone.Marionette.Region.extend({
        el: '#playback',
        open: function(view) {
            var $nav = this.$el.find('.player');
            console.log('open: adding playerback view');
            view.setElement($nav[0]);
        }
    });
    var proto = models.Subtitle.prototype;
    var msToTs = function(ms) {
            return proto.millisToString.call(proto, ms);
        };

    var playbackView = Backbone.Marionette.View.extend({
        events: {
            'click .controls': 'handleClick'
        },
        timer: null,
        subtimer: null,
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
                if (this.timer === null) {
                    this.stopwatch = new Date().getTime();
                    var $timer = $(this.ui.timer);
                    var self = this;
                    self.timer = setInterval(function() {
                        var ms = new Date().getTime() - self.stopwatch;
                        $timer.text(msToTs(ms));
                    }, 100);

                    var index = 0;
                    var subtitle = this.collection.at(index++);
                    var nextMs = subtitle.get('start');
                    console.log(nextMs);
                    var $playtext = $(this.ui.playtext);
                    var playerF = function(subtitle) {
                            $playtext.html(subtitle.get('text').join('</br>'));
                            var start = subtitle.get('start');
                            var end = subtitle.get('end');
                            setTimeout(function() {
                                $playtext.text('');
                            }, end - start);

                            subtitle = self.collection.at(index++);
                            var newstart = subtitle.get('start');
                            var elapsed = new Date().getTime() - self.stopwatch;
                            self.subtimer = setTimeout(function() {
                                playerF(subtitle);
                            }, newstart - elapsed);
                        };

                    this.subtimer = setTimeout(function() {
                        playerF(subtitle);
                    }, nextMs);
                }
            }
            if ($target.is('a.btn\\ stop') || $target.is('i.icon-stop')) {
                console.log('stop');
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                if (this.subtimer) {
                    clearTimeout(this.subtimer);
                    this.subtimer = null;
                }
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
            _.bindAll(this);
        }
    });
    var lib = {
        PlaybackRegion: playbackRegion,
        PlayerView: playbackView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
