/*global define, Backbone */
define(['marionette'], function() {
    'use strict';
    var navBarView = Backbone.Marionette.View.extend({
        el: '.nav',
        initialize: function() {
            console.log('init NavBarView');
        },
        events: {
            'click li a': 'handleClick',
        },
        handleClick: function(e) {
            e.stopPropagation();
            console.log(e);
            return false;
        }
    });
    var navRegion = Backbone.Marionette.Region.extend({
        el: '.navigation',
    });
    var lib = {
        NavRegion: navRegion,
        NavBarView: navBarView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
