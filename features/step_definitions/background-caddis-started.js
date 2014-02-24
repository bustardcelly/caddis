/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;
var request = require('supertest');

module.exports = function() {
  'use strict';

  this.Given(/^The Caddis server has started$/, function(callback) {
    request(this.serverLocation)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(error, res){
        expect(error ? false : true).to.equal(true, 'Failed to access server: ' + error);
        callback();
      });
  });

};