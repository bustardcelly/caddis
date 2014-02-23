/*jshint unused:false*/
'use strict';

var World = function World(callback) {

  this.serverLocation = 'http://localhost:3001';
  
  callback();
};

module.exports.World = World;