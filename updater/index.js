var http = require('http');
var ProcessRepo = require('./process');

const listenPort = 8010;

var webhookListener = http.createServer(
function (req, res) {

  // Clone the repo then run the ingestor to read posts from github into
  // persisted JSON
  var process = new ProcessRepo('git@github.com:jasonhowmans/writing.git');
  process.run();

  res.writeHead(200);
  res.end('^^');
});

// We want to listen for update events, which trigger the ingestor to update
webhookListener.listen( listenPort, 'localhost' );
console.log(`Updater is listening at http://localhost:${listenPort}`);
