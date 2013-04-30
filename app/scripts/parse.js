/*global define */
define(['marionette', 'underscore'], function() {
    'use strict';
    var srt = function(strings, collection) {
        if (collection && collection.models.length > 0) {
            console.log('Got a collection with models in it');
        }
        return strings.length;
    };
    var lib = {
        'fromSrt': srt
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
