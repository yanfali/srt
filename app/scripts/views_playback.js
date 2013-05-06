/*global define, Backbone, $, clearInterval */
define(['underscore', 'marionette', 'models', 'js-state-machine', 'views_subtitle'], function(_, m, models, StateMachine) {
    'use strict';
    var playbackRegion = Backbone.Marionette.Region.extend({
        el: '.playback'
    });
    var msToTimestamp = models.msToTimestamp;
    var playerControlView = Backbone.Marionette.View.extend({
        el: '.controls',
        collection: null,
        vent: null,
        fsm: null,
        events: {
            'click': 'handleClick'
        },
        ui: {},
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
            (function(self) {
                self.fsm = StateMachine.create({
                    error: function(eventName, from, to, args, errorCode, errorMessage) {
                        console.log('event ' + eventName + ' was unexpected :- ' + errorMessage);
                    },
                    initial: 'unloaded',
                    events: [{
                        name: 'load',
                        from: 'unloaded',
                        to: 'stopped'
                    }, {
                        name: 'start',
                        from: 'stopped',
                        to: 'playing'
                    }, {
                        name: 'stop',
                        from: 'playing',
                        to: 'stopped'
                    }, {
                        name: 'stop',
                        from: 'paused',
                        to: 'stopped'
                    }, {
                        name: 'pause',
                        from: 'playing',
                        to: 'paused'
                    }, {
                        name: 'resume',
                        from: 'paused',
                        to: 'playing'
                    }, {
                        name: 'start',
                        from: 'paused',
                        to: 'playing'
                    }, {
                        name: 'start',
                        from: 'unloaded',
                        to: 'unloaded'
                    }],
                    callbacks: {
                        onstart: function(event, from /*, to*/ ) {
                            self.vent.trigger('control:start');
                            if (from === 'unloaded') {
                                return false;
                            }
                            self.ui.play.removeClass('play').addClass('pause');
                            self.ui.play.find('i').removeClass().addClass('icon-pause');
                        },
                        onstop: function( /*event, from, to*/ ) {
                            self.vent.trigger('control:stop');
                            self.ui.play.removeClass('pause').addClass('play');
                            self.ui.play.find('i').removeClass().addClass('icon-play');
                            console.log(self.pauseIconTimer);
                            if (self.pauseIconTimer !== null) {
                                clearInterval(self.pauseIconTimer);
                                self.ui.play.find('i').css('visibility', 'visible');
                            }
                        },
                        onpause: function( /*event, from, to*/ ) {
                            self.vent.trigger('control:pause');
                            var icon = self.ui.play.find('i');
                            self.ui.play.removeClass('pause').addClass('resume');
                            icon.removeClass().addClass('icon-play');
                            self.pauseIconTimer = setInterval(function() {
                                if (icon.css('visibility') === 'visible') {
                                    icon.css('visibility', 'hidden');
                                } else {
                                    icon.css('visibility', 'visible');
                                }
                            }, 1000);
                        },
                        onresume: function( /*event, from, to*/ ) {
                            self.vent.trigger('control:resume');
                            self.ui.play.removeClass('resume').addClass('pause');
                            clearInterval(self.pauseIconTimer);
                            var icon = self.ui.play.find('i');
                            icon.css('visibility', 'visible');
                            icon.removeClass().addClass('icon-pause');
                        }
                    }
                });
                self.vent.on('file:loaded', function() {
                    self.fsm.load();
                });
            })(this);
            this.ui.play = this.$('.btn.play');
        },
        handleClick: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var $target = $(e.target).closest('a');
            if ($target.is('.play')) {
                this.fsm.start();
            } else if ($target.is('.pause')) {
                this.fsm.pause();
            } else if ($target.is('.resume')) {
                this.fsm.resume();
            } else if ($target.is('.stop')) {
                this.fsm.stop();
            } else if ($target.is('.step-backward')) {
                this.vent.trigger('control:back');
            } else if ($target.is('.step-forward')) {
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
            _.bindAll(this, 'start', 'stop', 'forward', 'back', 'pause', 'resume');
            this.vent.on('control:start', this.start);
            this.vent.on('control:pause', this.pause);
            this.vent.on('control:resume', this.resume);
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
        },
        pause: function() {
            console.log('pausing timer');
            clearInterval(this.timer);
            this.elapsed = Date.now() - this.stopwatch;
            this.timer = null;
        },
        resume: function() {
            this.stopwatch = Date.now() - this.elapsed;
            console.log('resuming timer from ' + this.elapsed);
            (function(self) {
                var rawEl = self.$el[0];
                self.timer = setInterval(function() {
                    var ms = Date.now() - self.stopwatch;
                    rawEl.innerHTML = msToTimestamp(ms - ms % 100);
                }, 66.67);
            })(this);
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
            _.bindAll(this, 'start', 'stop', 'forward', 'back', 'pause');
            this.vent.on('control:start', this.start);
            this.vent.on('control:stop', this.stop);
            this.vent.on('control:pause', this.pause);
            this.vent.on('control:forward', this.forward);
            this.vent.on('control:back', this.back);
        },
        pause: function() {},
        start: function() {
            if (this.timer !== null) {
                return;
            }
            console.log('starting preview');
            var start, end, newstart, rawEl, index, nextMs, playerFn, subtitle, elapsed;
            index = 0;
            if (this.collection.length === 0) {
                this.vent.trigger('player:no:subtitles:loaded');
                this.vent.trigger('control:stop');
                return;
            }
            subtitle = this.collection.at(index++);
            nextMs = subtitle.get('start');
            this.stopwatch = Date.now();
            playerFn = (function(self) {
                rawEl = self.$el[0];
                playerFn = function(subtitle) {
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
                        this.vent.trigger('control:stop');
                        return;
                    }
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
