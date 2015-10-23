var http = require('http');
var ProcessRepo = require('../process');

var webhookListener = http.createServer(
function (socket) {

  // Clone the repo then run the ingestor to read posts from github into
  // persisted JSON
  var process = new ProcessRepo('git@github.com:jasonhowmans/writing.git');
  process.run();
});

// We want to listen for update events, which trigger the ingestor to update
webhookListener.listen( 8080, 'localhost' );
