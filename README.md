Caddis
---
> On-The-Fly Mock JSON Server

Installation
---
```
$ npm install -g caddis
```

Usage
---
```
$ caddis start
$ curl -X POST -d '{"method":"GET", "uri":"/foo", "response":{\"bar\":\"baz\"}}' http://localhost:3001/api --header "Content-Type:application/json"
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