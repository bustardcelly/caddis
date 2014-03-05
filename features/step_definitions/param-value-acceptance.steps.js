/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;

var req = require('request');

module.exports = function() {
  'use strict';

  var response;

  this.When(/^I follow\-up a GET request to caddis at "([^"]*)"$/, function(url, callback) {
    req.get(url, function(error, res, body) {
      response = (typeof body === 'string') ? JSON.parse(body) : body;
      callback();
    });
  });

  this.Then(/^The response from the follow\-up is:$/, function(jsonString, callback) {
    expect(response).to.deep.equal(JSON.parse(jsonString));
    callback();
  });

};