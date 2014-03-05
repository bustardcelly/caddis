Caddis
---
> On-The-Fly Mock JSON Server

![caddis npm](https://nodei.co/npm/caddis.png)

Installation
---
```
$ npm install -g caddis
```

```
$ caddis -h

usage: caddis [action] [port]

Starts a server at http://localhost:<port> as a daemon, exposing an api to post JSON to in order to mock a RESTful service.
Defaults to port 3001 unless --port option provided.

actions:
  start               Start Caddis at http://localhost:<port>
  stop                Stop a previously started Caddis daemon
options:
  -h                  Display this help menu
  -p                  Desired port to start server on localhost
```

Usage
---
```
$ caddis start
$ curl -X POST -d '{"method":"GET", "uri":"/foo", "response":{"bar":"baz"}}' http://localhost:3001/api --header "Content-Type:application/json"
```

Visit [http://localhost:3001/foo](http://localhost:3001/foo), prints:

```
{
  bar: 'baz'
}
```

```
$ caddis stop
```

Visit [http://localhost:3001/foo](http://localhost:3001/foo), Not Found.

What?
---
![Caddis Fly Lure](http://custardbelly.com/images/caddis.jpg)  
A caddis is a moth-like insect often used as models for fly lures in fishing.

The [caddis](https://github.com/bustardcelly/caddis) CLI tool is used to start and stop a RESTful JSON service with the ability to POST route configuration and responses, on-the-fly, for mocking and testing purposes.

_It may be a stretch, but there's wit in there somewhere..._

Why?
---
There are other projects I have been a part of, such as [madmin](https://github.com/infrared5/madmin), that allow for dynamically creating RESTful APIs through a User Interface and allows for persistance through I/O.

Recently, I was involved with mocking a service layer for unit testing purposes and found that the manual curation of such an API was too tedious for the task at hand - I wanted the process to be much more fluid and simple.

In this particular instance I needed to:

1. Start a server in setup/before
2. Dynamically add a route to the service with mock JSON response
3. Run the test
4. Shut down the server in teardown/after

Fairly simple, and most of all I didnt want any artifacts lying around - in other words I didn't need for any routes that I dynamically created to stick around on my local disk after the tests were done.

As such, [caddis](https://github.com/bustardcelly/caddis) was born.

How
---
As mentioned briefly above, [caddis](https://github.com/bustardcelly/caddis) is a CLI tool. It is recommended to install globally:

```
$ npm install -g caddis
```
_: you may need to `sudo`_

Once installed, you can start the service (currently defaults to [http://localhost:3001](http://localhost:3001)) and begin POSTing route configurations in JSON. Here is an example using cUrl that dynamically adds a GET route at `/foo` with a simple JSON payload of `{"bar":"baz"}`:

```
$ curl -X POST -d '{"method":"GET", "uri":"/foo", "response":{"bar":"baz"}}' http://localhost:3001/api --header "Content-Type:application/json"
```

You are not confiuned to cUrl - you can use whatever networking library in whatever language you are writing your tests in and the server can handle all modern RESTful methods:

* GET
* POST
* PUT
* DELETE

When you are finished, simply stop the [caddis](https://github.com/bustardcelly/caddis) server:

```
$ caddis stop
```

## Post Data
The post body data that is sent to [caddis](https://github.com/bustardcelly/caddis) has the following properties:

* __method__: The REST method
* __uri__: The endpoint of the service to hit (requires prepended '/')
* __response__: The JSON object to return on request
* __statusCode__: [Optional] Status code to return. Defaults to 200
* __delay__: [Optional] Time delay, in milliseconds, to delay response. Defaults to NaN

Tests
---

```
$ npm run test
```

License
---
Copyright (c) 2014 Todd Anderson

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
