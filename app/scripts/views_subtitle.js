/*global define, Backbone */
define(['marionette', 'underscore', 'models'], function(marionette, _, models) {
    'use strict';
    var msToTs = models.Subtitle.prototype.millisToString;
    var subtitleTemplateHtml = ['<span class="start"><%= args.start %></span>', '<span class="end"><%= args.end %></span>', '<span class="text"><%= args.text %></span>'];
    subtitleTemplateHtml = subtitleTemplateHtml.join('');
    var subtitleTemplate = _.template(subtitleTemplateHtml, null, {
        variable: 'args'
    });
    var subtitleView = Backbone.Marionette.ItemView.extend({
        template: function(serModel) {
            console.log(serModel);
            var start = msToTs.call(models.Subtitle.prototype, serModel.start);
            var end = msToTs.call(models.Subtitle.prototype, serModel.end);
            return subtitleTemplate({
                start: start,
                end: end,
                text: serModel.text.join('</br>')
            });
        }
    });
    var lib = {
        SubtitleView: subtitleView
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
