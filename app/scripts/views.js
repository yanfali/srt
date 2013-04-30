/*global define, Backbone, escape, _ */
define(['marionette'], function() {
    'use strict';
    var navBarView = Backbone.Marionette.View.extend({
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
        el: '#navigation',
        open: function(view) {
            var $nav = this.$el.find('.nav');
            console.log('open: adding view');
            view.setElement($nav[0]);
        }
    });
    var mainRegion = Backbone.Marionette.Region.extend({
        el: '#workarea',
        open: function(view) {
            var $nav = this.$el.find('.subtitles');
            console.log('open: adding subtitle view');
            view.setElement($nav[0]);
        }
    });
    var mainView = Backbone.Marionette.View.extend({
        ullist: '<ul><%= args.listitems %></ul>',
        listitem: '<li><%= args.name %> - <%= args.type %> - <%= args.size %></li>',
        events: {
            'dragover': 'handleDragOver',
            'drop': 'handleDrop'
        },
        handleDragOver: function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'copy';
            console.log('drag over!');
        },
        handleDrop: function(e) {
            var files, output, reader;
            e.stopPropagation();
            e.preventDefault();
            console.log('dropped!');

            files = e.originalEvent.dataTransfer.files;
            output = [];
            for (var i = 0, f = files[i]; f ; f = files[++i]) {
                output.push(_.template(this.listitem, {
                    'name': escape(f.name),
                    'type': f.type || 'n/a',
                    'size': f.size
                }, {
                    'variable': 'args'
                }));
            }
            this.$('.files').html(_.template(this.ullist, {
                'listitems': output.join('')
            }, {
                'variable': 'args'
            }));

            reader = new FileReader();
            reader.onload = (function(){
                return function(e) {
                    var lines;
                    console.log('loaded');
                    lines = e.target.result.split('\r\n');
                    console.log('read ' + lines.length);
                };
            })(files[0]);
            reader.readAsText(files[0]);
        }
    });
    var lib = {
        'regions': {
            NavRegion: navRegion,
            MainRegion: mainRegion
        },
        'views': {
            NavBarView: navBarView,
            WorkAreaView: mainView
        }
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
