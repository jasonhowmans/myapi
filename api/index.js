var restify = require('restify');

const listenPort = 8000;

var server = restify.createServer({
  name: 'nosaj-api',
  version: '0.0.1'
});

var routes = [
  {
    path: '/posts',
    handler: require('./routes/posts')
  },
  {
    path: '/post',
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
