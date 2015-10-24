var restify = require('restify');

var server = restify.createServer({
  name: 'nosaj-api',
  version: '0.0.1'
});

console.log('listening on 7792');
server.listen(7792);
