'use strict';
var express = require('express');
var app = express();
var port = 3001;
app.use(express.bodyParser());

var isValidInt = function(value) {
  var n = parseInt(value, 10);
  return !isNaN(n) && value % 1 === 0;
};

var validateStatusCode = function(value) {
  // Enhancement: Validate as proper HTTP status code.
  return isValidInt(value) ? parseInt(value, 10) : Number.NaN;
};

var validateDelay = function(value) {
  // Enhancement: Validate as proper timespan.
  return isValidInt(value) ? parseInt(value, 10) : Number.NaN;
};

var convertToJSONHash = function(objectOrString) {
  return typeof objectOrString === 'string' ? JSON.parse(objectOrString) : objectOrString;
};

// ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(express.logger());

app.get('/', function(req, res) {
  res.json({hello: 'world'});
});

app.post('/api', function(req, res) {
  var config = req.body;
  if(config) {

    var delay = validateDelay(config.delay);
    var statusCode = validateStatusCode(config.status);
    var jsonResponse = convertToJSONHash(config.response);
    app[config.method.toLowerCase()](config.uri, function(request, response) {

      var timeout;
      var respond = function() {
        if(!isNaN(statusCode)) {
          response.status(statusCode).json(jsonResponse);
        }
        else {
          response.json(jsonResponse);
        }
      };

      if(!isNaN(delay)) {
        timeout = setTimeout(function() {
          clearTimeout(timeout);
          respond();
        }, delay);
      }
      else {
        respond();
      }

    });

    res.json({result:true});
  }
  else {
    res.json({error:'Must post JSON for modification of API.'});
  }
});

app.listen(port);
console.log('Caddis started on port ' + port + '.');