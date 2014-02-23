/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;

var request = require('supertest');
var req = require('request');

module.exports = function() {
  'use strict';

  var postBody = {
    "method": "get",
    "uri": "/user/:id",
    "response": {
      "name": "foo"
    }
  };

  this.World = require('../support/world').World;

  this.When(/^I submit a GET request with uri params$/, function(callback) {
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

  this.Then(/^The JSON response from a GET request to defined url$/, function(callback) {
    request(this.serverLocation)
      .get('/user/23234234')
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