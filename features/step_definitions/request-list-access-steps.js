/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;

var request = require('supertest');
var req = require('request');

module.exports = function() {
  'use strict';

  var calls;

  this.When(/^I make a GET request to caddis at "([^"]*)"$/, function(url, callback) {
    req.get(url, callback);
  });

  this.When(/^I access the calls list at "([^"]*)"$/, function(url, callback) {
    req.get(url, function(error, response, body) {
      if(error) {
        expect(false).to.equal(true, error);
      }
      else {
        calls = (typeof body === 'string') ? JSON.parse(body) : body;
      }
      callback();
    });
  });

  this.Then(/^I am returned:$/, function(payload, callback) {
    expect(calls).to.deep.equal(JSON.parse(payload));
    callback();
  });

};