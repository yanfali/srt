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
        startToString: function() {
            var model = this.toJSON();
            var millis = model.start % 1000;
            var secs = model.start % (1000 * 60);
            return _.template(this.template, {
                'millis': millis,
                'secs': secs
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
