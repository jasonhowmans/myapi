'use strict';
var frontmatter = require('front-matter');
var marked = require('marked');
var titleCase = require('to-title-case');
var _ = require('lodash');


/**!
 * Just feed this method frontmatter headed markdown and it spits it out as a
 * good ol' JS object
 * @param {String} filename - The raw filename of the markdown file
 * @param {String} filebody - The raw body of a markdown file
 */
function markdownParser (filename, filebody) {
  var proto = markdownParser.prototype;
  var filenameJson =  proto.filenameExtract(filename);
  var bodyJson = proto.parseBody(filebody);
  bodyJson.meta = filenameJson;

  // Set options to the marked parser
  marked.setOptions({
    gfm: true,
    smartypants: true
  });

  return bodyJson;
}


// This is the pattern that the parser uses to validate and parse a filename
// ✔︎ "how-to-debug-javascript-2015-10-12.md"
// ✘ "a_random-post-filename"
markdownParser.prototype.filenameRegex = /(.*)-(\d{4}-\d{1,2}-\d{1,2})(.*)?/g;


/**!
 * For taking the raw body and parsing frontmatter and markdown, then returning
 * a complete body object
 * @param {String} filebody - Raw source of a file
 * @returns {Object}
 */
markdownParser.prototype.parseBody = function (filebody) {
  var parsed = frontmatter(filebody);
  var bodyHtml = marked(parsed.body);
  return _.assign(parsed.attributes, {
    body: bodyHtml
  });
};


/**!
 * Check whether this filename is valid or not
 * @param {String} filename
 * @returns {Bool}
 */
markdownParser.prototype.test = function (filename) {
  var proto = markdownParser.prototype;
  filename = filename.replace('.md', '');

  if ( filename.match(proto.filenameRegex) ) {
    return true;
  }
  return false;
};


/**!
 * For stripping the slug and date out of the filename
 * @param {String} filename
 * @returns {Object <title: {String}, slug: {String}, date: {Date}> | false} will return object
 *          if the filename is valid, otherwise returns `false`
 */
markdownParser.prototype.filenameExtract = function (filename) {
  if (! _.isString(filename)) {
    return console.warn('filename must be a string');
  }

  var proto = markdownParser.prototype;
  var date, slug, title;

  if (! proto.test(filename)) {
    console.warn(`Cant parse ${filename}`);
    return null;
  }

  var parsed = proto.filenameRegex.exec( filename );

  // Convert title into more friendly string
  slug = parsed[1];
  title = parsed[1].replace(/-/gi, ' ');
  title = titleCase(title);

  // Convert date from string to a js date
  date = new Date(parsed[2]);

  return {
    slug: slug,
    date: date,
    title: title
  };
};

module.exports = Object.freeze({
  filenameExtract: markdownParser.prototype.filenameExtract,
  test: markdownParser.prototype.test,
  parse: markdownParser
});
