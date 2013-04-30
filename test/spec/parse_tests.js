/* global define, describe, it, should */
/* jshint multistr: true */
'use strict';

var dataset = [ '1', '00:00:00,242 --> 00:00:03,703', 'Book One: Water | Chapter Twenty:', 'The Siege of the North Part 2', '', '', '', '0', '00:00:00,242 --> 00:00:03,703', 'weird junk on the end' ];

var datasetBad = [ '1' ];
var datasetEmpty = [ ];


define(function(require) {
    var parse = require('parse');
    var model = require('models');
    var subs = new model.Subtitles();
    (function() {
        describe('SRT Parser Tests', function() {
            describe('Testing the parsing function', function() {
                it('find real length of file', function() {
                    subs.reset();
                    parse.fromSrt(dataset, subs).done(function(lines) {
                        lines.should.equal(5);
                    }).fail(function(err) {
                        console.log(err);
                        should.not.exist(err);
                    });
                });
                it('bad dataset', function() {
                    subs.reset();
                    parse.fromSrt(datasetBad, subs).fail(function(err) {
                        err.message.should.equal('Does not look like a valid file');
                    });
                });
                it('empty dataset', function() {
                    subs.reset();
                    parse.fromSrt(datasetEmpty, subs).fail(function(err) {
                        err.message.should.equal('Does not look like a valid file');
                    });
                });
                it('add a model', function() {
                    subs.reset();
                    parse.fromSrt(dataset, subs).fail(function(err) {
                        err.message.should.not.exist(err);
                    }).done(function(lines, collection){
                        lines.should.equal(5);
                        collection.length.should.equal(1);
                        var model = collection.at(0);
                        model.get('start').should.equal(242);
                        model.get('end').should.equal(3703);
                        model.get('text').length.should.equal(2);
                    });
                });
            });
        });
    })();

});
// vim: set shiftwidth=4 softtabstop=4 tabstop=4 expandtab:
