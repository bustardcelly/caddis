/*jshint unused:false*/
'use strict';
var chai = require('chai'),
    expect = chai.expect,
    spawn = require('child_process').spawn;

var caddis = require('../../lib/caddis');

module.exports = function() {
  
  this.Before(function(callback) {
    spawn('node', ['./bin/caddis', 'start'])
      .on('exit', callback);
  });

  this.After(function(callback) {
    spawn('node', ['./bin/caddis', 'stop'])
      .on('exit', callback);
  });

};