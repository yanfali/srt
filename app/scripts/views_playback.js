/*global define, Backbone */
define(['underscore', 'marionette', 'models', 'js-state-machine', 'views_playback_controls', 'views_subtitle'], function(_, m, models, StateMachine, control) {
    'use strict';
    var playbackRegion = Backbone.Marionette.Region.extend({
        el: '.playback'
    });
    var msToTimestamp = models.msToTimestamp;
    var PlayerTimerView = Backbone.Marionette.View.extend({
        el: '.timer',
        vent: null,
        interval: 66.67,
        initialize: function(opts) {
            if (opts.vent) {
                this.vent = opts.vent;
            } else {
                throw new Error('vent Event aggregator needed');
            }
            _.bindAll(this, 'start', 'stop', 'forward', 'backward', 'pause', 'resume', 'stopwatch');
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
            var rawEl = this.$el[0], self = this;
            this.timer = setInterval(function() {
                var ms = Date.now() - self.stopwatch;
                rawEl.innerHTML = msToTimestamp(ms - ms % 100);
            }, this.interval);
        },
        start: function() {
            console.log('received start');
            if (this.timer !== null) {
                return;
            }
            this.stopwatch = Date.now();
            this.runTimer();
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
        stopwatch: function(stopwatch) {
            console.log('received new stopwatch ' + stopwatch);
            this.stopwatch = stopwatch;
        },
        backward: function() {
            console.log('received back');
        },
        pause: function() {
            clearInterval(this.timer);
            this.elapsed = Date.now() - this.stopwatch;
            console.log('pausing timer ' + this.elapsed);
            this.timer = null;
        },
        resume: function() {
            this.stopwatch = Date.now() - this.elapsed;
            console.log('resuming timer from ' + this.elapsed);
            this.runTimer();
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
            _.bindAll(this, 'start', 'stop', 'forward', 'back', 'pause', 'resume');
            this.vent.on('control:start', this.start);
            this.vent.on('control:stop', this.stop);
            this.vent.on('control:pause', this.pause);
            this.vent.on('control:resume', this.resume);
            this.vent.on('control:forward', this.forward);
            this.vent.on('control:back', this.back);
        },
        pause: function() {
            clearTimeout(this.timer);
            this.elapsed = Date.now() - this.stopwatch;
            console.log('pausing text @ ' + this.elapsed);
            this.timer = null;
        },
        resume: function() {
            this.stopwatch = Date.now() - this.elapsed;
            console.log('resuming text from ' + this.elapsed);
            var playerFn = this.makePlayerFn();
            var subtitle = this.collection.at(this.index);
            var nextMs = subtitle.get('start') - this.elapsed;
            console.log('showing subtitle in ' + nextMs);
            var self = this;
            this.timer = setTimeout(function() {
                playerFn(self.index);
            }, nextMs);
        },
        forward: function() {
            clearTimeout(this.timer);
            this.elapsed = Date.now() - this.stopwatch;
            var index = this.index;
            var subtitle = this.collection.at(index);
            var start = subtitle.get('start');
            subtitle.set('selected', false);
            var playerFn = this.makePlayerFn();
            if (this.elapsed < subtitle.get('start')) {
                this.elapsed = start;
            } else {
                index++;
                subtitle = this.collection.at(index);
                this.elapsed = subtitle.get('start');
            }
            this.stopwatch = Date.now() - this.elapsed;
            this.vent.trigger('update:stopwatch', this.stopwatch);
            this.timer = setTimeout(function() {
                playerFn(index);
            }, 0);
        },
        makePlayerFn: function() {
            var self = this;
            var playerFn = (function() {
                var rawEl = self.$el[0];
                var start, end, newstart, elapsed;
                return function(index) {
                    self.index = index;
                    var subtitle = self.collection.at(index);
                    rawEl.innerHTML = subtitle.get('text').join('</br>');
                    start = subtitle.get('start');
                    end = subtitle.get('end');
                    subtitle.set('selected', true);
                    (function(prevModel) {
                        setTimeout(function() {
                            rawEl.innerHTML = '';
                            prevModel.set('selected', false);
                        }, end - start);
                    })(subtitle);
                    if (self.collection.length === index + 1) {
                        self.vent.trigger('control:stop');
                        return;
                    }
                    self.index += 1;
                    subtitle = self.collection.at(self.index);
                    newstart = subtitle.get('start');
                    elapsed = Date.now() - self.stopwatch;
                    self.timer = setTimeout(function() {
                        playerFn(self.index);
                    }, newstart - elapsed);
                };
            })();
            return playerFn;
        },
        start: function() {
            if (this.timer !== null) {
                return;
            }
            console.log('starting preview');
            if (this.collection.length === 0) {
                this.vent.trigger('player:no:subtitles:loaded');
                this.vent.trigger('control:stop');
                return;
            }
            this.stopwatch = Date.now();
            var playerFn = this.makePlayerFn();
            var subtitle = this.collection.at(0);
            var nextMs = subtitle.get('start');
            this.timer = setTimeout(function() {
                playerFn(0);
            }, nextMs);
        },
        stop: function() {
            if (this.timer === null) {
                return;
            }
            clearTimeout(this.timer);
            this.timer = null;
        },
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
        PlayerControlView: control.PlayerControlView,
        PlayerLayout: PlayerLayout,
        PlayerTimerView: PlayerTimerView,
        PlayerTextView: PlayerTextView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
