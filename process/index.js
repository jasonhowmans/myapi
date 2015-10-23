var _ = require('lodash');
var rimraf = require('rimraf');
var git = require('gift');
var Ingestor = require('./ingestMarkdown');


function ProcessRepo (url) {
  if (! _.isString(url)) {
    console.warn('url arg must be a string');
  }

  this.repoUrl = url;
  this.clonePath = `${__dirname}/_temp_repo`;
}


ProcessRepo.prototype.run = function () {
  const ingestPath = this.clonePath;

  console.log('cleaning dir and cloning repo...');
  this.clone().then(
  function (err, repo) {
    console.log('starting ingestor...');
    var ingestMarkdown = new Ingestor( ingestPath );
    ingestMarkdown.run();
  });
};


/**!
 * Clone the given repo
 */
ProcessRepo.prototype.clone = function () {
  var self = this;
  const repoUrl = this.repoUrl;
  const clonePath = this.clonePath;

  return new Promise( function (resolve, reject) {
    self.clean().then( function () {
      git.clone(repoUrl, clonePath, resolve);
    });
  });
};


/**!
 * Cleans the working directory of any old repo directories hanging around,
 * should always be run as a safety mechanism before cloning.
 */
ProcessRepo.prototype.clean = function () {
  const clonePath = this.clonePath;

  return new Promise( function (resolve, reject) {
    rimraf(clonePath, resolve);
  });
};

module.exports = ProcessRepo;
