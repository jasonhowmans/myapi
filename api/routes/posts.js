'use strict';
var storage = require('node-persist');
var augmentors = require('../augmentors');

module.exports = function postsHandler (req, res, next) {
  storage.initSync({
    dir: '../../persist'
  });
  var posts = storage.values();
  if (! posts) {
    res.send( { posts: [] } );
    return;
  }

  // Order posts by their assigned index
  posts = posts.sort( function (a, b) {
    return b.index > a.index;
  });

  posts = posts.map( augmentors.writtenOn );
  posts = posts.map( augmentors.romanNumerals );

  res.send( { posts: posts } );
};
