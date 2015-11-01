'use strict';
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var markdownParser = require('./util/mdParser');
var storage = require('node-persist');
var moment = require('moment');
var postModel = require('./postModel.json');

function IngestMd (ingestDir) {
  if (! _.isString(ingestDir)) {
    console.warn('ingestDir arg must be a string');
    return;
  }
  this.ingestDir = ingestDir;

  storage.initSync({
    dir: '../../persist'
  });

  // Clear persisted data
  storage.clearSync();
}


/**!
 * After the Ingestor has been configured, use `run` to set things going
 */
IngestMd.prototype.run = function () {
  this.crawlPostsDir( this.persistInserter );
};



/**!
 * Parser. It opens and parses the specified file
 * @param {String} filename - The full path to the file to open
 * @returns {Object<key, data>}
 */
IngestMd.prototype.parseFile = function (filename) {
  var self = this;

  return new Promise( function (resolve, reject) {
    fs.readFile( path.join(self.ingestDir, filename), 'utf8',
    function (err, body) {
      if (err) {
        reject(err);
      }
      resolve( markdownParser.parse(filename, body) );
    });
  });
};


/**!
 * The model object is stored as a json file. Here we want to merge the empty
 * model object and the data object together and augment the output.
 * @param {Object} data - The data object parsed from the file
 * @returns {Object} postObject
 */
IngestMd.prototype.augment = function (data) {
  if (! _.isObject(postModel)) {
    throw new Error('Can\t find posts model');
  }
  var postObject = _.extend(postModel, data);
  postObject.written_on = moment(data.meta.date).fromNow();
  return postObject;
};


/**!
 * Inserting the data into datastore should only be done with the insterter method
 * @param {String} key - The key that the data should be stored under
 * @param {*} data - The data to be inserted into storage. Can be anything UTF-8 friendly
 */
IngestMd.prototype.persistInserter = function (key, data) {
  if (! _.isObject(data)) {
    console.warn('`data` argument should be Object');
    return;
  }
  var value = this.augment(data);
  storage.setItem(key, value);
};


/**!
 * For crawling the posts directory and calling a
 */
IngestMd.prototype.crawlPostsDir = function (inserterMethod) {
  var self = this;
  const crawableDir = this.ingestDir;

  fs.readdir(crawableDir, function (err, dir) {
    if (err) {
      return console.error('The updater can\'t crawl the dir', err);
    }

    var files = _.filter(dir, markdownParser.test);

    files.forEach(function (filename) {
      self.parseFile( filename ).then(
      function runInserter (fileJson) {
        if (_.isFunction(inserterMethod)) {
          let slug = fileJson.meta.slug;
          inserterMethod.call(self, `post:${slug}`, fileJson);
        }
      }, console.error);
    });

    console.log('Ingest complete');
  });
};

module.exports = IngestMd;
