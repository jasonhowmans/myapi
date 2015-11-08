'use strict';
var storage = require('node-persist');
var augmentors = require('../augmentors');

module.exports = function postHandler (req, res, next) {
  storage.initSync({
    dir: '../../persist'
  });

  var slug = req.params.slug;
  var post = storage.getItem(`post:${slug}`);

  if (! post) {
    res.send(404, { post: {} });
    console.warn(`[404] posts/${slug}`);
    return;
  }

  post = augmentors.writtenOn(post);
  post = augmentors.romanNumerals(post);

  res.send( { post: post } );
};
