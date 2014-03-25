var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var req = require('request');

module.exports = function() {
  'use strict';

  var response;

  this.hooks = require('../support/hooks');
  this.World = require('../support/world').World;

  this.Given(/^I have a reference to Caddis as a node module$/, function(callback) {
    expect(this.caddisModule).to.not.equal(undefined);
    callback();
  });

  this.When(/^I invoke start\(\) with port "([^"]*)"$/, function(port, callback) {
    this.caddisModule.start(parseInt(port, 10), callback);
  });

  this.When(/^I visit "([^"]*)"$/, function(url, callback) {
    req(url, function(error, res, body) {
      response = res;
      callback();
    });
  });

  this.Then(/^I am returned a (\d+)$/, function(statusCode, callback) {
    expect(response.statusCode).to.equal(parseInt(statusCode, 10));
    callback();
  });

};