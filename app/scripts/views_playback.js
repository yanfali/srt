/*global define, Backbone, $ */
define(['underscore', 'marionette', 'models', 'js-state-machine', 'views_playback_controls', 'views_subtitle', 'rafShim'], function(_, m, models, StateMachine, control) {
    'use strict';
    var playbackRegion = Backbone.Marionette.Region.extend({
        el: '.playback'
    });
    var msToTimestamp = models.msToTimestamp;
    var PlayerTimerView = Backbone.Marionette.View.extend({
        el: '.timer',
        vent: null,
        interval: 1000 / 60,
        running: false,
        current: 0,
        next: 1,
        initialize: function(opts) {
            if (opts.vent) {
                this.vent = opts.vent;
            } else {
                throw new Error('vent Event aggregator needed');
            }
            if (opts.collection) {
                this.collection = opts.collection;
            }
            _.bindAll(this, 'start', 'stop', 'forward', 'backward', 'pause', 'resume', 'stopwatch', 'animate', 'drawTimer', 'drawSubtitle');
            this.vent.on('control:start', this.start);
            this.vent.on('control:pause', this.pause);
            this.vent.on('control:resume', this.resume);
            this.vent.on('control:stop', this.stop);
            this.vent.on('control:forward', this.forward);
            this.vent.on('control:backward', this.backward);
            this.vent.on('update:stopwatch', this.stopwatch);
        },
        timer: null,
        runTimer: function() {
            var rawEl = this.$el[0],
                self = this;
            this.timer = setInterval(function() {
                var ms = Date.now() - self.stopwatch;
                rawEl.innerHTML = msToTimestamp(ms - ms % 100);
            }, this.interval);
        },
        animate: function() {
            if (this.running) {
                window.requestAnimationFrame(this.animate);
                this.drawTimer();
                this.drawSubtitle();
            }
        },
        drawTimer: function() {
            var rawEl = this.$el[0];
            var ms = Date.now() - this.stopwatch;
            rawEl.innerHTML = msToTimestamp(ms);
        },
        drawSubtitle: function() {
            var rawEl = $('.play-text')[0];
            var subtitle = this.collection.at(this.next);
            var elapsed = Date.now() - this.stopwatch;
            var start = subtitle.get('start');
            var end = subtitle.get('end');
            if (this.current !== this.next && elapsed >= start && elapsed <= end) {
                this.current = this.next;
                rawEl.innerHTML = subtitle.get('text').join('</br>');
                rawEl.style.visibility = 'visible';
                subtitle.set('selected', true);
            } else {
                if (this.current === this.next && elapsed >= start && elapsed >= end) {
                    rawEl.style.visibility = 'hidden';
                    subtitle.set('selected', false);
                    this.next += 1;
                }
            }
        },
        start: function() {
            console.log('received start');
            if (this.collection.length === 0) {
                this.vent.trigger('player:no:subtitles:loaded');
                this.vent.trigger('control:stop');
                return;
            }
            this.stopwatch = Date.now();
            this.current = -1;
            this.next = 0;
            this.running = true;
            this.animate();
        },
        stop: function() {
            console.log('received stop');
            this.running = false;
        },
        forward: function() {
            console.log('received forward');
        },
        stopwatch: function(stopwatch) {
            console.log('received new stopwatch ' + stopwatch);
            this.stopwatch = stopwatch;
        },
        backward: function() {
            console.log('received back');
        },
        pause: function() {
            this.elapsed = Date.now() - this.stopwatch;
            console.log('pausing timer ' + this.elapsed);
            this.running = false;
        },
        resume: function() {
            this.stopwatch = Date.now() - this.elapsed;
            console.log('resuming timer from ' + this.elapsed);
            this.running = true;
            this.animate();
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
        PlayerControlView: control.PlayerControlView,
        PlayerLayout: PlayerLayout,
        PlayerTimerView: PlayerTimerView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
