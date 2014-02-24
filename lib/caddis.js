var _ = require('lodash');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var forever = require('forever');
require('colors');

var tmp = process.cwd() + '/.caddis-tmp';

var caddis = module.exports;
caddis.outlog = [tmp, 'forever.log'].join('/');
caddis.original = __dirname + '/caddis/server.js';

var checkRegistry = function checkRegistry(script, callback) {
  var timeout = 0;
  var findInList = function() {
    clearTimeout(timeout);
    forever.list(false, function(context, list) {
      var process = _.find(list, {file:script});
      if(process) {
        // console.log(('Found process: ' + JSON.stringify(process, null, 2)).cyan);
        callback();
      }
      else {
        timeout = setTimeout(findInList, 500);
      }
    });
  };
  findInList();
};

caddis.start = function(callback) {
  mkdirp.sync(tmp);
  forever.startDaemon(caddis.original, {
      logFile: caddis.outlog
    })
    .on('error', function(error) {
      callback(error);
    });
  checkRegistry(caddis.original, callback);
};

caddis.stop = function(callback) {
  rimraf(tmp, function(error) {
    if(error) {
      console.log(('Error in cleanup temporary files from ' + tmp + '.').red);
    }
  });
  forever.stop(caddis.original)
    .on('stop', function() {
      callback();
    })
    .on('error', function(err) {
      callback(err);
    });
};