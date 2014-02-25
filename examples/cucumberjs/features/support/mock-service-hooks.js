'use strict';
var spawn = require('child_process').spawn;

module.exports = function() {
  
  this.Before(function(callback) {
    spawn('caddis', ['start'])
      .on('exit', callback);
  });

  this.After(function(callback) {
    spawn('caddis', ['stop'])
      .on('exit', callback);
  });

};