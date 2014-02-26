/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;

var request = require('supertest');

module.exports = function() {
  'use strict';

  this.World = require('../support/world').World;

  this.Then(/^The status code response received is (\d+) with:$/, function(statusCode, json, callback) {
    request(this.serverLocation)
      .get('/user/23234234')
      .expect(parseInt(statusCode,10))
      .end(function(error, res) {
        if(error) {
          expect(false).to.equal(true, error);
        }
        else {
          callback();
        }
      });
  });

};