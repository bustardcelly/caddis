var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var forever = require('forever');
require('colors');

var tmp = process.cwd() + '/.caddis-tmp';

var caddis = module.exports;
caddis.outlog = [tmp, 'forever.log'].join('/');
caddis.original = __dirname + '/caddis/server.js';

caddis.start = function(callback) {
  var timeout;
  mkdirp.sync(tmp);
  forever.startDaemon(caddis.original, {
      logFile: caddis.outlog
    })
    .on('error', function(error) {
      clearTimeout(timeout);
      callback(error);
    });
  // TODO: get rid of setTimeout. find event from forever.
  timeout = setTimeout(function() {
    clearTimeout(timeout);
    // TODO: list here and check available.
    callback();
  }, 1000);
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