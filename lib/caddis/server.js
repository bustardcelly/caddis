'use strict';
var http = require('http');
var port = 3001;

var routeMap = {};
var routeSupport = ['get', 'post', 'put', 'delete'];

var API_ENDPOINT = /\/api/i;
var COLON_TOKEN = /(:\w+)/g;
var COLON_REPLACE = '(' + '\\' + 'w+)';

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

var convertToJSONHash = function(objectOrString) {
  return typeof objectOrString === 'string' ? JSON.parse(objectOrString) : objectOrString;
};

var tokenizeURI = function(uri) {
  return '^' + uri.replace(COLON_TOKEN, COLON_REPLACE);
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
    });
  }
  else if(requestIsAPIRoute(request)) {
    request.on('end', function() {
      addRoute(JSON.parse(data));
      body = JSON.stringify({result: true}) + '\n';
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      });
      response.end(body);
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
            response.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': body.length
          });
          response.end(body);
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
server.listen(3001);

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
// app.use(allowCrossDomain);
// app.use(express.logger());

// app.get('/', function(req, res) {
//   res.json({hello: 'world'});
// });

// app.post('/api', function(req, res) {
//   var config = req.body;
//   if(config) {

//     var delay = validateDelay(config.delay);
//     var statusCode = validateStatusCode(config.status);
//     var jsonResponse = convertToJSONHash(config.response);
//     app[config.method.toLowerCase()](config.uri, function(request, response) {

//       var timeout;
//       var respond = function() {
//         if(!isNaN(statusCode)) {
//           response.status(statusCode).json(jsonResponse);
//         }
//         else {
//           response.json(jsonResponse);
//         }
//       };

//       if(!isNaN(delay)) {
//         timeout = setTimeout(function() {
//           clearTimeout(timeout);
//           respond();
//         }, delay);
//       }
//       else {
//         respond();
//       }

//     });

//     res.json({result:true});
//   }
//   else {
//     res.json({error:'Must post JSON for modification of API.'});
//   }
// });

// app.listen(port);
console.log('Caddis started on port ' + port + '.');