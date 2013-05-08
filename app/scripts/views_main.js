/*global define, Backbone, escape, _ */
define(['backbone.babysitter', 'models', 'parse', 'views_subtitle'], function(marionette, models, parse, subtitle) {
    'use strict';
    var mainRegion = Backbone.Marionette.Region.extend({
        el: '.workarea',
    });
    var mainView = Backbone.Marionette.CollectionView.extend({
        el: '.subtitles',
        initialize: function() {
            _.bindAll(this, 'flashDragToMe');
            this.on('flash:dragtome', this.flashDragToMe);
        },
        flashDragToMe: function() {
            var el = this.$('h1');
            el.addClass('swing');
            _.delay(function() {
                el.removeClass('swing');
            },2500);
        },
        itemView: subtitle.SubtitleView,
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
            for (var i = 0, f = files[i]; f; f = files[++i]) {
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
            var subtitles = this.collection;
            reader.onload = (function(self, file) {
                return function(e) {
                    var lines;
                    console.log('loaded ' + file.name);
                    lines = e.target.result.split('\r\n');
                    subtitles.reset();
                    parse.fromSrt(lines, subtitles);
                    console.log('read ' + lines.length);
                    self.trigger('loaded');
                };
            })(this, files[0]);
            reader.readAsText(files[0]);
        }
    });
    var lib = {
        MainRegion: mainRegion,
        WorkAreaView: mainView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
