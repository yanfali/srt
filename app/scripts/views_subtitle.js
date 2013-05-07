/*global define, Backbone */
define(['marionette', 'underscore', 'models'], function(marionette, _, models) {
    'use strict';
    var msToTs = models.msToTimestamp;
    var subtitleView = Backbone.Marionette.ItemView.extend({
        template: '#subtitle-template',
        modelEvents: {
            'change:selected': 'changeSelected'
        },
        ui: {
            'text': '.text',
            'icon': '.icon'
        },
        changeSelected: function() {
            if (this.model.get('selected')) {
                this.ui.text.addClass('selected');
                this.ui.icon.find('i').addClass('icon-arrow-right');
            } else {
                this.ui.text.removeClass('selected');
                this.ui.icon.find('i').removeClass('icon-arrow-right');
            }
        },
        serializeData: function() {
            var m = this.model;
            return {
                start: msToTs(m.get('start')),
                end: msToTs(m.get('end')),
                text: m.get('text').join('</br>'),
                clazz: m.get('selected') ? 'current' : '',
                icon: ''
            };
        }
    });
    var lib = {
        SubtitleView: subtitleView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
