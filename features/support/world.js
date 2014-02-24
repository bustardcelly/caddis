/*jshint unused:false*/
'use strict';

var req = require('request');

var World = function World(callback) {

  this.serverLocation = 'http://localhost:3001';
  this.postAPI = function postAPI(json, cb) {
    req({
      method: 'POST',
      uri: this.serverLocation + '/api',
      json: json
    }, cb);
  };
  
  callback();
};

module.exports.World = World;