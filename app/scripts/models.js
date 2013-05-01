/*global define, Backbone */
define(['marionette', 'underscore'], function(marionette, _) {
    'use strict';
    var MILLIS_IN_SECOND = 1000,
        SECONDS_IN_MINUTE = 60,
        MINUTE_AS_MILLIS = MILLIS_IN_SECOND * SECONDS_IN_MINUTE,
        MINUTES_IN_HOUR = 60,
        HOURS_AS_MILLIS = MINUTE_AS_MILLIS * MINUTES_IN_HOUR,
        HOURS_IN_DAY = 24,
        HOUR_OFFSET = 0,
        MINUTE_OFFSET = 3,
        SECOND_OFFSET = 6,
        MILLI_OFFSET = 9,
        HOURS_WIDTH = 2,
        MINUTES_WIDTH = 2,
        SECONDS_WIDTH = 2,
        MILLIS_WIDTH = 3,
        OFFSET1 = 0,
        OFFSET2 = 1,
        MULTIPLIER = 2;
    var tsConv = [
        [HOUR_OFFSET, HOUR_OFFSET + HOURS_WIDTH, HOURS_AS_MILLIS],
        [MINUTE_OFFSET, MINUTE_OFFSET + MINUTES_WIDTH, MINUTE_AS_MILLIS],
        [SECOND_OFFSET, SECOND_OFFSET + SECONDS_WIDTH, MILLIS_IN_SECOND],
        [MILLI_OFFSET, MILLI_OFFSET + MILLIS_WIDTH, 1]
    ];
    var Subtitle = Backbone.Model.extend({
        template: _.template('<%= args.hours %>:<%= args.mins %>:<%= args.secs %>,<%= args.millis %>', null, {
            variable: 'args'
        }),
        defaults: {
            'text': '',
            'start': 0,
            'end': 0
        },
        fmtZeros: function(num, len) {
            var str = '000' + num,
                slen = str.length;
            return str.substring(slen - len, slen);
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
            return this.template({
                'hours': this.fmtZeros(hours, HOURS_WIDTH),
                'mins': this.fmtZeros(minutes, MINUTES_WIDTH),
                'secs': this.fmtZeros(secs, SECONDS_WIDTH),
                'millis': this.fmtZeros(millis, MILLIS_WIDTH)
            });
        },
        timestampToMillis: function(timestamp) {
            var result = 0;
            for (var i = tsConv.length-1, row = tsConv[i]; i > -1; row = tsConv[--i]) {
                result += parseInt(timestamp.substring(row[OFFSET1], row[OFFSET2]), 10) * row[MULTIPLIER];
            }
            return result;
        }
    });
    var Subtitles = Backbone.Collection.extend({
        model: Subtitle
    });
    var lib = {
        'Subtitle': Subtitle,
        'Subtitles': Subtitles
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
