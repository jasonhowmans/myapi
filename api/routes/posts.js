'use strict';
var storage = require('node-persist');
var augmenters = require('../../augmenters');

module.exports = function postsHandler (req, res, next) {
  storage.initSync({
    dir: '../../persist',
    ttl: false
  });
  var posts = storage.values();
  if (! posts) {
    res.send( { posts: [] } );
    return;
  }

  posts = augmenters.map(posts, 'writtenOn', 'romanNumerals', 'neighbours');

  // Sort posts newest first
  posts = posts.sort( function (a, b) {
    return b.index > a.index;
  });

  res.send( { posts: posts } );
};
