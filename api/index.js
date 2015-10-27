'use strict';
var restify = require('restify');

const listenPort = 8000;

var server = restify.createServer({
  name: 'nosaj-api',
  version: '0.0.1'
});

server.use( function cors (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

var routes = [
  {
    path: '/posts',
    handler: require('./routes/posts')
  },
  {
    path: '/posts/:slug',
    handler: require('./routes/post')
  }
];

// Configure restify routes with routes array
routes.forEach( function (route) {
  server.get.call(server, route.path, route.handler);
  console.log(`Configured route for ${route.path}`);
});

server.listen(listenPort, 'localhost', function connected () {
  console.log(`API is listening at http://localhost:${listenPort}`);
});
