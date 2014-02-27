var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var mkdirp = require('mkdirp');
var forever = require('forever');
require('colors');

var tmp = path.normalize([process.env.HOME, '.caddis'].join(path.sep));
var caddis = module.exports;

caddis.outlog = [tmp, 'caddis.log'].join(path.sep);
caddis.original = [__dirname, 'caddis', 'server.js'].join(path.sep);

var checkRegistry = function checkRegistry(script, callback) {
  var timeout = 0;
  var findInList = function() {
    clearTimeout(timeout);
    forever.list(false, function(context, list) {
      var process = _.find(list, {file:script});
      if(process) {
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
  if(fs.existsSync(caddis.outlog)) {
    fs.writeFileSync(caddis.outlog, '', 'utf8');
  }
  forever.startDaemon(caddis.original, {
      logFile: caddis.outlog,
      append: false
    })
    .on('error', function(error) {
      callback(error);
    });
  checkRegistry(caddis.original, callback);
};

caddis.stop = function(callback) {
  forever.stop(caddis.original)
    .on('stop', function() {
      callback();
    })
    .on('error', function(err) {
      callback(err);
    });
};