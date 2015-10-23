var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var markdownParser = require('./util/mdParser');
var storage = require('node-persist');

function IngestMd (ingestDir) {
  if (! _.isString(ingestDir)) {
    console.warn('ingestDir arg must be a string');
    return;
  }
  this.ingestDir = ingestDir;
}


/**!
 * After the Ingestor has been configured, use `run` to set things going
 */
IngestMd.prototype.run = function () {
  this.crawlDir( this.persistentInserter );
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
      console.log(`${body.length}bytes loaded`);
      resolve( markdownParser.parse(filename, body) );
    });
  });
};


/**!
 * Inserting the data into datastore should only be done with the insterter method
 * @param {String} key - The key that the data should be stored under
 * @param {*} data - The data to be inserted into redis. Can be anything UTF-8 friendly
 */
IngestMd.prototype.persistentInserter = function (key, data) {
  if (! _.isObject(data)) {
    return;
  }

  storage.initSync();
  console.log(key);
  storage.setItem(key, data);
  console.log(storage.values());
};


/**!
 * For crawling the posts directory and calling a
 */
IngestMd.prototype.crawlDir = function (inserterMethod) {
  var self = this;
  const crawableDir = this.ingestDir;

  fs.readdir(crawableDir, function (err, dir) {
    if (err) {
      return console.error(err);
    }

    var files = _.filter(dir, markdownParser.test);

    var index = 1;
    files.forEach(function (filename) {
      self.parseFile( filename ).then(
      function (fileJson) {
        if (_.isFunction(inserterMethod)) {
         inserterMethod(`post:${index ++}`, fileJson);
        }
      }, console.error);
    });
  });
};

module.exports = IngestMd;
