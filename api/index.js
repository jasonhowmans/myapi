'use strict';
var config = require('./api-config.json');
var restify = require('restify');

const listenPort = 8000;

var server = restify.createServer({
  name: config.appName,
  version: config.version
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
  },
  {
    path: '/latest',
    handler: require('./routes/latest')
  },
  {
    path: '/rss',
    handler: require('./routes/rss')
  }
];

// Configure restify routes with routes array
routes.forEach( function (route) {
  server.get.call(server, route.path, route.handler);
  console.log('Configured route for %s', route.path);
});

server.listen(listenPort, 'localhost', function connected () {
  console.log('%s listening at %s', server.name, server.url);
});
