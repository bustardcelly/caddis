/*jshint unused:false*/
var chai = require('chai'),
    expect = chai.expect;
    
module.exports = function() {
  'use strict';

  this.When(/^I submit a "([^"]*)" request with response JSON:$/, function(method, json, callback) {
    this.postAPI(JSON.parse(json), function(error) {
      if(error) {
        expect(false).to.equal(true, error);
      }
      callback();
    });
  });

};