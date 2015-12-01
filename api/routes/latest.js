'use strict';
var _ = require('lodash');
var storage = require('node-persist');
var augmentors = require('../augmentors');

module.exports = function latestHandler (req, res, next) {
  storage.initSync({
    dir: '../../persist'
  });

  var posts = storage.values();

  // Order posts by their assigned index
  posts = posts.sort( function (a, b) {
    return b.index > a.index;
  });

  var post = posts[0];

  if (! post) {
    res.send(404, { post: {} });
    console.warn(`[404] /latest`);
    return;
  }

  post = augmentors.run(posts, post.index, 'writtenOn', 'romanNumerals', 'neighbours');

  res.send( { post: post } );
};
