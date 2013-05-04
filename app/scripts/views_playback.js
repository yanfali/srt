/*global define, Backbone, $ */
define(['underscore', 'marionette', 'models', 'views_subtitle'], function(_, m, models) {
    'use strict';
    var playbackRegion = Backbone.Marionette.Region.extend({
        el: '.playback'
    });
    var msToTimestamp = models.msToTimestamp;
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
            _.bindAll(this, 'start', 'stop', 'forward', 'back');
            this.vent.on('control:start', this.start);
            this.vent.on('control:stop', this.stop);
            this.vent.on('control:forward', this.forward);
            this.vent.on('control:back', this.back);
        },
        timer: null,
        start: function() {
            console.log('received start');
            if (this.timer !== null) {
                return;
            }
            this.stopwatch = Date.now();
            (function(self) {
                var rawEl = self.$el[0];
                self.timer = setInterval(function() {
                    var ms = Date.now() - self.stopwatch;
                    rawEl.innerHTML = msToTimestamp(ms - ms % 100);
                }, 66.67);
            })(this);
        },
        stop: function() {
            console.log('received stop');
            if (this.timer === null) {
                return;
            }
            clearInterval(this.timer);
            this.timer = null;
        },
        forward: function() {
            console.log('received forward');
        },
        back: function() {
            console.log('received back');
        }
    });
    var PlayerTextView = Backbone.Marionette.View.extend({
        el: '.play-text',
        timer: null,
        collection: null,
        initialize: function(opts) {
            if (opts.vent) {
                this.vent = opts.vent;
            } else {
                throw new Error('vent Event aggregator needed');
            }
            if (opts.collection) {
                this.collection = opts.collection;
            } else {
                throw new Error('need subtitle collection');
            }
            _.bindAll(this, 'start', 'stop', 'forward', 'back');
            this.vent.on('control:start', this.start);
            this.vent.on('control:stop', this.stop);
            this.vent.on('control:forward', this.forward);
            this.vent.on('control:back', this.back);
        },
        start: function() {
            if (this.timer !== null) {
                return;
            }
            console.log('starting preview');
            var start, end, newstart, rawEl, index, nextMs, playerFn, subtitle, elapsed;
            index = 0;
            subtitle = this.collection.at(index++);
            nextMs = subtitle.get('start');
            this.stopwatch = Date.now();
            playerFn = (function(self) {
                rawEl = self.$el[0];
                playerFn = function(subtitle) {
                    rawEl.innerHTML = subtitle.get('text').join('</br>');
                    start = subtitle.get('start');
                    end = subtitle.get('end');
                    setTimeout(function() {
                        rawEl.innerHTML = '';
                    }, end - start);
                    subtitle = self.collection.at(index++);
                    newstart = subtitle.get('start');
                    elapsed = Date.now() - self.stopwatch;
                    self.timer = setTimeout(function() {
                        playerFn(subtitle);
                    }, newstart - elapsed);
                };
                return playerFn;
            })(this);
            this.timer = setTimeout(function() {
                playerFn(subtitle);
            }, nextMs);
        },
        stop: function() {
            if (this.timer === null) {
                return;
            }
            clearTimeout(this.timer);
            this.timer = null;
        },
        forward: function() {},
        back: function() {},
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
        PlayerTimerView: PlayerTimerView,
        PlayerTextView: PlayerTextView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
