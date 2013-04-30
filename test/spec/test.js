/*global define, describe, it */
'use strict';
define(function(require) {
    var models = require('models');
    (function() {
        describe('Subtitle model tests', function() {
            describe('startToString output', function() {
                it('default values', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.startToString().should.equal('00:00:00,000');
                });
                it('< 1 second', function() {
                    var subtitle = new models.Subtitle({start: 999});
                    subtitle.startToString().should.equal('00:00:00,999');
                });
                it('1 second', function() {
                    var subtitle = new models.Subtitle({start: 1000});
                    subtitle.startToString().should.equal('00:00:01,000');
                });
                it('59 seconds', function() {
                    var subtitle = new models.Subtitle({start: 59000});
                    subtitle.startToString().should.equal('00:00:59,000');
                });
                it('1 minute', function() {
                    var subtitle = new models.Subtitle({start: 60000});
                    subtitle.startToString().should.equal('00:01:00,000');
                });
                it('59 minutes', function() {
                    var subtitle = new models.Subtitle({start: 3540000});
                    subtitle.startToString().should.equal('00:59:00,000');
                });
                it('1 hour', function() {
                    var subtitle = new models.Subtitle({start: 3600000});
                    subtitle.startToString().should.equal('01:00:00,000');
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
