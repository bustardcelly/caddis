/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;

var request = require('supertest');

module.exports = function() {
  'use strict';

  this.Then(/^The JSON is returned by issuing a "PUT" at the specified uri:$/, function(json, callback) {
    request(this.serverLocation)
      .put('/user/23234234')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(error, res) {
        if(error) {
          expect(false).to.equal(true, error);
        }
        else {
          expect(res.body).to.deep.equal(JSON.parse(json));
        }
        callback();
      });
  });

};