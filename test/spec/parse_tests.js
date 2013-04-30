/*global define, describe, it */
/*jshint multistr: true */
'use strict';

var dataset = [ '1\r\n', '00:00:00,242 --> 00:00:03,703\r\n', 'Book One: Water | Chapter Twenty:\r\n', 'The Siege of the North Part 2\r\n' ];
define(function(require) {
    var parse = require('parse');
    (function() {
        describe('SRT Parser Tests', function() {
            describe('Testing the parsing function', function() {
                it('default values', function() {
                    parse.fromSrt(dataset).should.equal(4);
                });
            });
        });
    })();

});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
