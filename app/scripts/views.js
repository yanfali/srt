/*global define, Backbone */
define(['marionette'], function () {
    'use strict';
    var navBarView = Backbone.Marionette.View.extend({
        initialize: function(){
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
        el: '#navigation',
        open: function(view) {
            var $nav = this.$el.find('.nav');
            console.log('open: adding view');
            view.setElement($nav[0]);
        }
    });
    var lib = {
	    'regions': {
		    NavRegion: navRegion
	    },
        'views': {
		    NavBarView: navBarView
	    }
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
