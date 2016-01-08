'use strict';
var storage = require('node-persist');
var RSS = require('rss');


module.exports = function feedHandler (req, res, next) {
  var feedOptions = {
    title: 'nosaj.io',
    description: 'A blog about making things with technology',
    feed_url: 'http://rss.nosaj.io',
    site_url: 'http://nosaj.io',
    ttl: 15
  };
  var feed = new RSS( feedOptions );

  res.setHeader('Content-Type', 'application/rss+xml');
  res.end( feed.xml() );
}
