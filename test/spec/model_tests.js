/*global define, describe, it */
'use strict';
define(function(require) {
    var models = require('models');
    (function() {
        describe('Subtitle model millis to timestamp tests', function() {
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
                it('remove mantissa', function() {
                    var subtitle = new models.Subtitle({start: 4333});
                    subtitle.startToString().should.equal('00:00:04,333');
                });
                it('11:11:11,111', function() {
                    var subtitle = new models.Subtitle({start: 40271111});
                    subtitle.startToString().should.equal('11:11:11,111');
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

    (function() {
        describe('Subtitle model timestamp to millis tests', function() {
            describe('millisToString output', function() {
                it('default values', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('00:00:00,000').should.equal(0);
                });
                it('999ms', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('00:00:00,999').should.equal(999);
                });
                it('1s', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('00:00:01,000').should.equal(1000);
                });
                it('59s 999ms', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('00:00:59,999').should.equal(59999);
                });
                it('1m', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('00:01:00,000').should.equal(60000);
                });
                it('59m 59s 999ms', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('00:59:59,999').should.equal(3599999);
                });
                it('1h', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('01:00:00,000').should.equal(3600000);
                });
                it('10h', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.timestampToMillis('10:00:00,000').should.equal(36000000);
                });
            });
        });
    })();
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
