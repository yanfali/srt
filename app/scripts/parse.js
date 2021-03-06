/*global define,$, setTimeout */
define(['marionette', 'underscore', 'models'], function(m, _, models) {
    'use strict';
    var EOL = '',
        lineRegex = /^\d+$/,
        timestampRegex = (/(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})/),
        srt, tsToMs = models.Subtitle.prototype.timestampToMillis,
        lib;
    srt = function(strings, collection) {
        var d = $.Deferred(),
            inner;
        inner = function() {
            var nolines, foundrealend, i, obj, inSrt, matches, line;
            if (collection && collection.models) {
                console.log('Got a collection with models in it');
            }
            nolines = strings.length;
            foundrealend = false;
            for (i = nolines - 1; i > -1; --i) {
                if (strings[i] === EOL && strings[i - 1] === EOL) {
                    foundrealend = true;
                    nolines = i - 1;
                    break;
                }
            }
            if (!foundrealend) {
                d.reject(new Error('Does not look like a valid file'));
                return;
            }

            obj = {
                text: []
            };
            inSrt = false;
            for (i = 0; i < nolines; i++) {
                line = strings[i];
                console.log('line ' + i + ' @ ' + (line || ''));
                if ((!inSrt) && lineRegex.test(line)) {
                    inSrt = true;
                    console.log('found an new subtitle');
                    obj.lineno = line;
                    continue;
                }
                if (line === '') {
                    collection.add({
                        'text': obj.text,
                        'start': obj.start,
                        'end': obj.end
                    });
                    obj = {
                        text: []
                    };
                    inSrt = false;
                    continue;
                }
                matches = timestampRegex.exec(line);
                if (matches) {
                    obj.start = tsToMs(matches[1]);
                    obj.end = tsToMs(matches[2]);
                    continue;
                }
                obj.text.push(line);
            }
            d.resolve(nolines, collection);
        };
        setTimeout(inner, 0);
        return d.promise();
    };
    lib = {
        fromSrt: srt
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
