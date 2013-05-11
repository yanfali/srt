/*global define, Backbone, $, clearInterval */
define(['underscore', 'marionette', 'js-state-machine', 'views_subtitle'], function(_, m, StateMachine) {
    'use strict';
    var playerControlView = Backbone.Marionette.View.extend({
        el: '.controls',
        collection: null,
        vent: null,
        fsm: null,
        events: {
            'click': 'handleClick'
        },
        ui: {},
        fsmEvents: [{
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
        }, {
            name: 'forward',
            from: 'paused',
            to: 'paused'
        }, {
            name: 'backward',
            from: 'paused',
            to: 'paused'
        }, {
            name: 'forward',
            from: 'playing',
            to: 'playing'
        }, {
            name: 'backward',
            from: 'playing',
            to: 'playing'
        }],
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
            _.bindAll(this, 'onstart', 'onstop', 'onpause', 'onresume', 'onforward', 'onbackward', 'toggle');
            (function(self) {
                self.fsm = StateMachine.create({
                    error: function(eventName, from, to, args, errorCode, errorMessage) {
                        console.log('event ' + eventName + ' was unexpected :- ' + errorMessage);
                    },
                    initial: 'unloaded',
                    events: self.fsmEvents,
                    callbacks: {
                        onstart: self.onstart,
                        onstop: self.onstop,
                        onpause: self.onpause,
                        onresume: self.onresume,
                        onforward: self.onforward,
                        onbackward: self.onbackward
                    }
                });
                self.vent.on('file:loaded', function() {
                    self.fsm.load();
                });
            })(this);
            this.ui.play = this.$('.btn.play');
            this.vent.on('control:toggleplay', this.toggle);
        },
        toggle: function() {
            var current = this.fsm.current;
            console.log(current);
            if (current === 'stopped') {
                this.fsm.start();
            } else if (current === 'playing') {
                this.fsm.pause();
            } else if (current === 'paused') {
                this.fsm.resume();
            }
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
                this.fsm.backward();
            } else if ($target.is('.step-forward')) {
                this.fsm.forward();
            }
        },
        onstart: function(event, from /*, to*/ ) {
            var $play = this.ui.play,
                $icon = $play.find('i');
            var vent = this.vent;
            _.defer(function() {
                vent.trigger('control:start');
            });
            if (from === 'unloaded') {
                return false;
            }
            $play.removeClass('play').addClass('pause');
            $icon.removeClass().addClass('icon-pause');
        },
        onstop: function( /*event, from, to*/ ) {
            var $play = this.ui.play,
                $icon = $play.find('i'),
                vent = this.vent;
            $play.removeClass('pause').addClass('play');
            $icon.removeClass().addClass('icon-play');
            if (this.pauseIconTimer !== null) {
                console.log(this.pauseIconTimer);
                clearInterval(this.pauseIconTimer);
                $icon.css('visibility', 'visible');
            }
            _.defer(function() {
                vent.trigger('control:stop');
            });
        },
        onpause: function( /*event, from, to*/ ) {
            var $play = this.ui.play,
                $icon = $play.find('i'),
                vent = this.vent;
            $play.removeClass('pause').addClass('resume');
            $icon.removeClass().addClass('icon-play');
            this.pauseIconTimer = setInterval(function() {
                if ($icon.css('visibility') === 'visible') {
                    $icon.css('visibility', 'hidden');
                } else {
                    $icon.css('visibility', 'visible');
                }
            }, 1000);
            _.defer(function() {
                vent.trigger('control:pause');
            });
        },
        onresume: function( /*event, from, to*/ ) {
            var $play = this.ui.play,
                $icon = $play.find('i'),
                vent = this.vent;
            $play.removeClass('resume').addClass('pause');
            clearInterval(this.pauseIconTimer);
            $icon.css('visibility', 'visible').removeClass().addClass('icon-pause');
            _.defer(function() {
                vent.trigger('control:resume');
            });
        },
        onforward: function() {
            var vent = this.vent;
            _.defer(function() {
                vent.trigger('control:forward');
            });
        },
        onbackward: function() {
            var vent = this.vent;
            _.defer(function() {
                vent.trigger('control:backward');
            });
        }
    });
    var lib = {
        PlayerControlView: playerControlView,
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
