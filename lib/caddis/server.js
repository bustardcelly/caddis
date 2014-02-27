'use strict';
var http = require('http');
var port = 3001;

var routeMap = {};
var routeSupport = ['get', 'post', 'put', 'delete'];

var ROOT_ENDPOINT = /^\/$/i;
var API_ENDPOINT = /\/api/i;
var COLON_TOKEN = /(:\w+)/gi;
var COLON_REPLACE = '(' + '\\' + 'w+)';

var print = function(message) {
  console.log([new Date(), message].join(':: '));
};

var requestIsRoot = function(req) {
  return req.length === 0 || req.url.match(ROOT_ENDPOINT);
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
  return '^' + uri.replace(COLON_TOKEN, COLON_REPLACE) + '$';
};

var addRoute = function(route) {
  var normalizedMethod = route.method.toLowerCase();
  if(routeMap.hasOwnProperty(normalizedMethod)) {
    route.regex = new RegExp(tokenizeURI(route.uri));
    route.match = function(uri) {
      return uri.match(this.regex);
    };
    routeMap[normalizedMethod].push(route);
  }
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
  else if(requestIsAPIRoute(request)) {
    request.on('end', function() {
      var route = JSON.parse(data);
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