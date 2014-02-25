var assert = require('assert');
var req = require('request');
var request = require('supertest');

module.exports = function() {
  'use strict';

  var user;
  var credentials;
  var profile = {
    name: 'Ted Henderson',
    age: 34,
    email: 'ted@tedhenderson.net'
  };
  var requestBody = {
    "method": "POST",
    "uri": "/user/:username",
    "response": profile
  };

  this.hooks = require('../support/mock-service-hooks');
  this.World = require('../support/world').World;

  this.Given(/^I have valid user credentials$/, function(callback) {
    
    user = {};
    credentials = {
      username: 'foo',
      password: 'bar'
    };
    
    req({
      method: 'POST',
      uri: 'http://localhost:3001/api',
      json: requestBody
    }, callback);

  });

  this.When(/^I submit my username and password$/, function(callback) {
    request('http://localhost:3001')
      .post('/user/' + credentials.username)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(error, res) {
        if(error) {
          assert.fail(false, true, error);
        }
        else {
          user = res.body;
        }
        callback();
      });
  });

  this.Then(/^I am returned my profile information$/, function(callback) {
    assert.deepEqual(user, profile);
    callback();
  });

};