/*global define, describe, it */
'use strict';
define(function(require) {
    var models = require('models');
    (function() {
        describe('Subtitle model tests', function() {
            describe('startToString output', function() {
                it('output some formatted strings', function() {
                    var subtitle = new models.Subtitle();
                    subtitle.startToString().should.equal('0:0');
                });
            });
        });
    })();
});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
