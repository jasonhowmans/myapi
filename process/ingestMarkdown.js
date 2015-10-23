var _ = require('lodash');
var fs = require('fs');
var markdownParser = require('./util/mdParser');

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
  this.crawlDir( this.redisInserter ).then(
  function () {

  });
};



/**!
 * Parser. It opens and parses the specified file
 * @param {String} filename - The full path to the file to open
 * @returns {Object<key, data>}
 */
IngestMd.prototype.parseFile = function (filename) {
  var self = this;

  return new Promise( function (resolve, reject) {
    fs.readFile(`${self.ingestDir}/${filename}`, 'utf8',
    function (err, body) {
      if (err) {
        console.error(err);
      }
      markdownParser.parse(filename, body);
    });
  });
};


/**!
 * Inserting the data into redis should only be done with the insterter method
 * @param {String} key - The key that the data should be stored under
 * @param {*} data - The data to be inserted into redis. Can be anything UTF-8 friendly
 */
IngestMd.prototype.redisInserter = function (key, data) {

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
    files.forEach(function (filename) {
      self.parseFile( filename ).then(
      function () {
        if (_.isFunction(inserterMethod)) {
         inserterMethod();
        }
      });
    });
  });
};

module.exports = IngestMd;
