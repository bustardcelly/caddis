var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var map = require('map-stream');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var forever = require('forever');
require('colors');

var portLine = /^var port/i;
var tmp = process.cwd() + '/.caddis-tmp';

var caddis = module.exports;
caddis.server = [tmp, 'server.js'].join('/');
caddis.original = __dirname + '/caddis/server.js';

var portTemp = function portTemp(port) {
  mkdirp.sync(tmp);
  fs.createReadStream(caddis.original)
    .pipe(map(function(file, cb) {
      var contents = file.toString();
      var lines = contents.split('\n');
      lines = _.map(lines, function(line) {
        if(line.match(portLine)) {
          return 'var port = ' + port.toString() + ';';
        }
        return line;
      });
      cb(null, lines.join('\n'));
    }))
    .pipe(fs.createWriteStream(caddis.server));
    return caddis.server;
};

var cleanTemp = function cleanTemp(cb) {
  fs.exists(caddis.server, function(exists) {
    if(exists) {
      rimraf(path.dirname(caddis.server), cb);
    }
  });
};

caddis.start = function(port, callback) {
  var timeout;
  caddis.server = portTemp(port ? port : 3001);
  forever.startDaemon(caddis.server, {})
    .on('error', function(error) {
      clearTimeout(timeout);
      callback(error);
    });
  // TODO: get rid of setTimeout. find event from forever.
  timeout = setTimeout(function() {
    clearTimeout(timeout);
    callback();  
  }, 1000);
};

caddis.stop = function(callback) {
  cleanTemp(function(error) {
    if(error) {
      console.log(('Error in cleaning up temp server script: ' + error).red);
    }
  });
  forever.stop(caddis.server)
    .on('stop', function() {
      callback();
    })
    .on('error', function(err) {
      callback(err);
    });
};