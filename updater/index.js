'use strict';
var _ = require('lodash');
var restify = require('restify');
var http = require('http');
var ProcessRepo = require('./process');

const listenPort = 8010;

var server = restify.createServer({
  name: 'nosaj-updater',
  version: '0.0.2'
});

server.post('/', function (req, res) {
  if (! _.has(req.headers, 'x-github-event')) {
    res.send(400);
    return;
  }

  // Clone the repo then run the ingestor to harvest the content
  var process = new ProcessRepo('https://github.com/jasonhowmans/writing.git');
  process.run();

  res.send(200, '^^');
});

// We want to listen for update events, which trigger the ingestor to update
server.listen( listenPort, 'localhost', function connected () {
  console.log('%s listening at %s', server.name, server.url);
});
