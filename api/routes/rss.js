'use strict';
var config = require('../api-config.json');
var storage = require('node-persist');
var RSS = require('rss');

module.exports = function feedHandler (req, res, next) {
  var feedOptions = {
    title: config.hostname,
    description: 'A blog about making things with technology',
    feed_url: `http://rss.${config.hostname}`,
    site_url: `http://${config.hostname}`,
    ttl: 15
  };

  var storageOptions = {
    dir: '../../persist',
    ttl: false
  };

  var feed = new RSS( feedOptions );
  storage.initSync( storageOptions );

  var posts = storage.values();

  if (! posts) {
    console.error('Posts returned empty for rss endpoint');
    res.writeHead(204);
    return res.end();
  }

  // Sort posts newest first
  posts = posts.sort( function (a, b) {
    return b.index > a.index;
  });

  posts.forEach( function (post) {
    var feedItem = {
      title: post.title,
      description: post.body,
      link: `http://${config.hostname}/#/${post.meta.slug}`,
      author: 'jason@nosaj.io',
      date: new Date(post.meta.date)
    };

    if (post.image) {
      feedItem.image = image;
    }

    feed.item( feedItem );
  });


  res.setHeader('Content-Type', 'application/rss+xml');
  res.end( feed.xml() );
}
