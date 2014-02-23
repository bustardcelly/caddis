/*jshint unused:false*/
'use strict';
var chai = require('chai'),
    expect = chai.expect;

var caddis = require('../../lib/caddis');

module.exports = function() {
  
  this.Before(function(callback) {
    caddis.start(function(error) {
      if(error) {
        expect(false).to.equal(true, 'Error in establishing server: ' + error);
      }
      else {
        callback();
      }
    });
  });

  this.After(function(callback) {
    caddis.stop(function(error) {
      if(error) {
        expect(false).to.equal(true, 'Error in stopping server: ' + error);
      }
      else {
        callback();
      }
    });
  });

};