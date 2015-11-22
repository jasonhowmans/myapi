'use strict';
var _ = require('lodash');
var rimraf = require('rimraf');
var git = require('gift');
var Ingestor = require('./ingestMarkdown');


function ProcessRepo (url) {
  if (! _.isString(url)) {
    throw new Error('url arg must be a string');
  }

  this.repoUrl = url;
  this.clonePath = `${__dirname}/_temp_repo`;
}


/**!
 * Start the process. Requires `this.repoUrl` & `this.clonePath` to be set
 */
ProcessRepo.prototype.run = function () {
  const ingestPath = this.clonePath;

  console.log('cleaning dir and cloning repo...');
  this.clone().then(
  function success (err, repo) {
    if (err) {
      return console.error(err);
    }
    console.log('starting ingestor...');
    var ingestMarkdown = new Ingestor( ingestPath );
    ingestMarkdown.run();
  }, console.error).catch(console.error);
};


/**!
 * Clone the repo given to the constructor on init
 */
ProcessRepo.prototype.clone = function () {
  var self = this;
  const repoUrl = this.repoUrl;
  const clonePath = this.clonePath;

  return new Promise( function (resolve, reject) {
    self.clean().then( function () {
      git.clone(repoUrl, clonePath, resolve);
    }, reject).catch(reject);
  });
};


/**!
 * Cleans the working directory of any old repo clones hanging around. Should
 * always be run as a safety mechanism before cloning.
 */
ProcessRepo.prototype.clean = function () {
  const clonePath = this.clonePath;
  return new Promise( function (resolve, reject) {
    rimraf(clonePath, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

module.exports = ProcessRepo;
