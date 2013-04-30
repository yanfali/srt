/*global define, Backbone */
define(['marionette', 'underscore'], function(marionette, _) {
    'use strict';
    var MILLIS_IN_SECOND = 1000,
        SECONDS_IN_MINUTE = 60,
        MINUTE_AS_MILLIS = MILLIS_IN_SECOND * SECONDS_IN_MINUTE,
        MINUTES_IN_HOUR = 60,
        HOURS_AS_MILLIS = MINUTE_AS_MILLIS * MINUTES_IN_HOUR,
        HOURS_IN_DAY = 24;
    var subtitle = Backbone.Model.extend({
        template: '<%= args.hours %>:<%= args.mins %>:<%= args.secs %>,<%= args.millis %>',
        defaults: {
            'text': '',
            'start': 0,
            'end': 0
        },
        fmtZeros: function(num, len) {
            var str = '000' + num;
            var slen = str.length;
            return str.slice(slen - len, slen);
        },
        startToString: function() {
            return this.millisToString(this.get('start'));
        },
        endToString: function() {
            return this.millisToString(this.get('end'));
        },
        millisToString: function(ms) {
            var millis, secs, minutes, hours;
            millis = ms % MILLIS_IN_SECOND;
            secs = ms >= MILLIS_IN_SECOND ? (ms / MILLIS_IN_SECOND) % SECONDS_IN_MINUTE : 0;
            minutes = ms >= MINUTE_AS_MILLIS ? (ms / MINUTE_AS_MILLIS) % MINUTES_IN_HOUR : 0;
            hours = ms >= HOURS_AS_MILLIS ? (ms / HOURS_AS_MILLIS) % HOURS_IN_DAY : 0;
            return _.template(this.template, {
                'hours': this.fmtZeros(hours, 2),
                'mins': this.fmtZeros(minutes, 2),
                'secs': this.fmtZeros(secs, 2),
                'millis': this.fmtZeros(millis, 3)
            }, {
                variable: 'args'
            });
        }
    });
    var lib = {
        Subtitle: subtitle
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
