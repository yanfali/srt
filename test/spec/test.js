/*global define, describe, it */
'use strict';
define(function(require) {
    var models = require('models');
    (function() {
        describe('Subtitle model tests', function() {
            describe('startToString output', function() {
                it('output some formatted strings', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.startToString().should.equal('00:000');
                });
            });
        });
    })();

    (function() {
        describe('Subtitle model fmt test', function() {
            describe('fmtZeros', function() {
                it('output strings with leading zeros', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.fmtZeros(0,3).should.equal('000');
                    subtitle.fmtZeros(0,2).should.equal('00');
                    subtitle.fmtZeros(0,1).should.equal('0');
                });
            });
        });
    })();
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
