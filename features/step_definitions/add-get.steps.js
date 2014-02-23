/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;

var request = require('supertest');
var req = require('request');

module.exports = function() {
  'use strict';

  var postBody = {
    "method": "get",
    "uri": "/hello",
    "response": {
      "id": "foo"
    }
  };

  this.World = require('../support/world').World;

  this.When(/^I submit a GET request with response JSON$/, function(callback) {
    var serverLocation = this.serverLocation;
    req({
      method: 'POST',
      uri: serverLocation + '/api',
      json: postBody
    }, function(error, response, body) {
      if(error) {
        expect(false).to.equal(true, error);
      }
      callback();
    });
  });

  this.Then(/^The JSON is returned by issuing a GET at the specified uri$/, function(callback) {
    request(this.serverLocation)
      .get('/hello')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(error, res) {
        if(error) {
          expect(false).to.equal(true, error);
        }
        else {
          expect(res.body).to.deep.equal(postBody.response);
        }
        callback();
      });
  });

};