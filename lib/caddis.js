var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var mkdirp = require('mkdirp');
var forever = require('forever');
var map = require('map-stream');
require('colors');

var PORT_ENTRY = /^var port = (\d+);$/;

var tmp = path.normalize([process.env.HOME, '.caddis'].join(path.sep));
var caddis = module.exports;

caddis.outlog = [tmp, 'caddis.log'].join(path.sep);
caddis.original = [__dirname, 'caddis', 'server.js'].join(path.sep);
caddis.server = [tmp, 'server.js'].join(path.sep);

var replacePort = function replacePort(port, original, out) {
  fs.createReadStream(original)
    .pipe(map(function(file, cb) {
      var contents = file.toString();
      var lines = contents.split('\n');
      lines = _.map(lines, function(line) {
        if(line.match(PORT_ENTRY)) {
          return 'var port = ' + port.toString() + ';';
        }
        return line;
      });
      cb(null, lines.join('\n'));
    }))
    .pipe(fs.createWriteStream(out));
};

var generateServerScript = function generateServerScript(port, originalScript, outScript) {
  var previousScript = fs.existsSync(outScript);
  replacePort(port, originalScript, outScript);
};

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

caddis.start = function(port, callback) {
  
  mkdirp.sync(tmp);
  
  if(fs.existsSync(caddis.outlog)) {
    fs.writeFileSync(caddis.outlog, '', 'utf8');
  }

  generateServerScript(port, caddis.original, caddis.server);

  forever.startDaemon(caddis.server, {
      logFile: caddis.outlog,
      append: false
    })
    .on('error', function(error) {
      callback(error);
    });
  checkRegistry(caddis.server, callback);

};

caddis.stop = function(callback) {
  forever.stop(caddis.server)
    .on('stop', function() {
      callback();
    })
    .on('error', function(err) {
      callback(err);
    });
};