/*global define, Backbone */
define(['marionette', 'underscore'], function(marionette, _) {
    'use strict';
    var subtitle = Backbone.Model.extend({
        template: '<%= args.secs %>:<%= args.millis %>',
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
            var model = this.toJSON();
            var millis = model.start % 1000;
            var secs = model.start % (1000 * 60);
            return _.template(this.template, {
                'millis': this.fmtZeros(millis, 3),
                'secs': this.fmtZeros(secs, 2)
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
