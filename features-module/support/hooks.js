'use strict';

module.exports = function() {
  
  this.Before(function(callback) {
    this.caddisModule = require('../../lib/caddis');
    this.caddisModule.start(3002, callback);
  });

  this.After(function(callback) {
    this.caddisModule.stop(callback);
  });

};