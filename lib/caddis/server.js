'use strict';
var http = require('http');
var port = 3001;

var routeMap = {};
var routeSupport = ['get', 'post', 'put', 'delete'];
var callHistory = [];

var ROOT_ENDPOINT = /^\/$/i;
var API_ENDPOINT = /\/api/i;
var CALL_HISTORY_ENDPOINT = /\/_call_requests/i;
var COLON_TOKEN = /(:[^:\/]+)[^\/]?/gi;
var COLON_REPLACE = '[^\/]+';
var QUERY_PARAM_TOKEN = /[\\?&]*=([^&]*)?/gi;
var QUERY_PARAM_REPLACE = '=[^&]+';

var print = function(message) {
  console.log([new Date(), message].join(':: '));
};

var requestIsRoot = function(req) {
  return req.length === 0 || req.url.match(ROOT_ENDPOINT);
};

var requestIsHistory = function(req) {
  return req.length === 0 || req.url.match(CALL_HISTORY_ENDPOINT);
};

var requestIsAPIRoute = function(req) {
  return req.method.toLowerCase() === 'post' && req.url.match(API_ENDPOINT);
};

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

var tokenizeURI = function(uri) {
  uri = uri.replace(COLON_TOKEN, COLON_REPLACE);
  uri = uri.replace('?', '\\?');
  uri = uri.replace(QUERY_PARAM_TOKEN, QUERY_PARAM_REPLACE);
  return '^' + uri.replace(COLON_TOKEN, COLON_REPLACE) + '$';
};

var addRoute = function(route) {
  var normalizedMethod = route.method.toLowerCase();
  if(routeMap.hasOwnProperty(normalizedMethod)) {
    route.regexStr = tokenizeURI(route.uri);
    route.regex = new RegExp(route.regexStr);
    route.match = function(uri) {
      print('Attempt to match: ' + this.regexStr + ', ' + uri);
      return uri.match(this.regex);
    };
    routeMap[normalizedMethod].push(route);
  }
};

var addToCallHistory = function(request, response) {
  var callEntry = {
    request: (typeof request === 'string') ? JSON.parse(request) : request,
    response: (typeof response === 'string') ? JSON.parse(response) : response
  };
  callHistory.push(callEntry);
  print('Added to history: ' + JSON.stringify(callEntry, null, 2));
};

var findRouteFromRequest = function(req) {
  var routeList = routeMap[req.method.toLowerCase()];
  var route;
  var index;
  if(routeList) {
    index = routeList.length;
    while(--index > -1) {
      route = routeList[index];
      if(route.match(req.url)) {
        return route;
      }
    }
  }
  return undefined;
};

// Solution coutesy of:
// http://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
var bodyParser = function(value) {
  var data = value;
  // Check if issuer passed as params.
  if(!data.match(/^{(.*)/)) {
    print('Recieved response payload as param string.');
    data = JSON.parse('{"' + value.replace(/"/g, '\\"').replace(/&/g, '","').replace(/\=/g,'":"') + '"}');
    data.response = JSON.parse(data.response.replace(/\\"/g, '"'));
    print('Parsed and formatted to ' + JSON.stringify(data, null, 2));
  }
  // If not, assuming as json string.
  else {
    print('Received response payload as proper JSON string.');
    data = JSON.parse(data);
    print('Parsed and formatted as: ' + JSON.stringify(data, null, 2));
  }
  return data;
};

var establishRouteMap = function() {
  while(routeSupport.length > 0) {
    routeMap[routeSupport.shift()] = [];
  }
};

var server = http.createServer(function(request, response) {
  var data = '';
  var body;

  // Cross Domain.
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  request.setEncoding('utf8');
  request.on('data', function(chunk) {
    data += chunk;
  });

  if(request.method === 'OPTIONS') {
    request.on('end', function() {
      response.writeHead(200);
      response.end('\n');
      print('OPTIONS request.');
    });
  }
  else if(requestIsRoot(request)) {
    request.on('end', function() {
      body = JSON.stringify({result: 'hello, caddis!'}) + '\n';
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      });
      response.end(body);
      print('Root request.');
    });
  }
  else if(requestIsHistory(request)) {
    request.on('end', function() {
      body = JSON.stringify(callHistory) + '\n';
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      });
      response.end(body);
      print('Call history request.');
      print('Response: ' + body);
    });
  }
  else if(requestIsAPIRoute(request)) {
    request.on('end', function() {
      var route = bodyParser(decodeURIComponent(data));
      addRoute(route);
      body = JSON.stringify({result: true}) + '\n';
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      });
      response.end(body);
      print('Route added to ' + route.method + '.');
      print(JSON.stringify(route, null, 2));
    });
  }
  else {
    request.on('end', function() {
      var route;
      var delay;
      var statusCode;
      var timeout;
      var respond;

      route = findRouteFromRequest(request);
      if(route !== undefined) {
        delay = validateDelay(route.delay);
        statusCode = validateStatusCode(route.status);
        body = JSON.stringify(route.response) + '\n';
        respond = function() {
          response.writeHead(!isNaN(statusCode) ? statusCode : 200, {
            'Content-Type': 'application/json',
            'Content-Length': body.length
          });
          response.end(body);

          addToCallHistory({
            method: request.method,
            url: request.url,
            statusCode: request.statusCode ? request.statusCode : 200,
            body: data && data.length > 0 ? data : null
          }, body);
        };
        print('Stored route found.');
        print('Returning: ' + body +
                    'after ' + (!isNaN(delay) ? delay : 0) +
                    ' milliseconds with status ' + (!isNaN(statusCode) ? statusCode : 200));
        if(!isNaN(delay)) {
          timeout = setTimeout(function() {
            clearTimeout(timeout);
            respond();
          }, delay);
        }
        else {
          respond();
        }
      }
      else {
        body = JSON.stringify({
          message: request.url + ' not implemented.'
        }) + '\n';
        response.writeHead(501, { 
          'Content-Type': 'application/json',
          'Content-Length': body.length
        });
        response.end(body);
      }
    });
  }
});

establishRouteMap();
server.listen(port);

print(new Date() + ':: Caddis started on port ' + port + '.');