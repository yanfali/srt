/*global define,$, setTimeout */
define(['marionette', 'underscore', 'models'], function(m, _, models) {
    'use strict';
    var EOL = '\r\n',
        lineRegex = /^\d+$/,
        timestampRegex = (/(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})/),
        srt, tsToMs = models.Subtitle.prototype.timestampToMillis;
    srt = function(strings, collection) {
        var d = $.Deferred(),
            inner;
        inner = function() {
            var nolines, foundrealend;
            if (collection && collection.models) {
                console.log('Got a collection with models in it');
            }
            nolines = strings.length;
            foundrealend = false;
            for (var i = nolines - 1; i > -1; --i) {
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

            var obj = {};
            var inSrt = false;
            var matches;
            for (i = 0; i < nolines; i++) {
                var line = strings[i];
                line = line.length > 2 ? line.substring(0, line.length - 2) : line;
                console.log('line ' + i + ' @ ' + (line || ''));
                if ((!inSrt) && lineRegex.test(line)) {
                    inSrt = true;
                    console.log('found an new subtitle');
                    obj.line = line;
                    continue;
                }
                if (inSrt) {
                    if (line === '\r\n') {
                        collection.add({
                            'text': obj.text,
                            'start': obj.start,
                            'end': obj.end
                        });
                        obj = {};
                        inSrt = false;
                        continue;
                    }
                    matches = timestampRegex.exec(line);
                    if (matches) {
                        obj.start = tsToMs(matches[1]);
                        obj.end = tsToMs(matches[2]);
                        continue;
                    }
                    if (obj.text) {
                        obj.text.push(line);
                    } else {
                        obj.text = [line];
                    }
                }
            }
            d.resolve(nolines, collection);
        };
        setTimeout(inner, 0);
        return d.promise();
    };
    var lib = {
        fromSrt: srt
    };
    return lib;
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
