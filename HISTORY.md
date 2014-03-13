0.4.3 / 2014-03-13
==================
  * support for tokenized query parameters.
  * spec for multuple param uri.
  * added help notification to README

0.4.2 / 2014-03-04
==================
  * allow for special characters in uri param values.

0.4.1 / 2014-03-03
==================
  * support for return of call history through /_call_requests. closes https://github.com/bustardcelly/caddis/issues/4

0.4.0 / 2014-03-03
==================
  * lightweight body parser to accept param string and JSON.
  * perhaps some support for request param parse on body.
  * support for port option!
  * proper termination on regex matching for uri on add route.
  * update to forever runner on caddis to preseved session-only logging at HOME for developer debugging purposes.
  * light logging in caddis server.
  * experimental removal of express to allow custom ports.
  * up of node version dependency.

0.3.6 / 2014-02-26
==================
  * delay response support. closes [#3](https://github.com/bustardcelly/caddis/issues/3)