'use strict';
var _ = require('lodash');
var storage = require('node-persist');
var augmenters = require('../../augmenters');

module.exports = function postHandler (req, res, next) {
  storage.initSync({
    dir: '../../persist'
  });

  var slug = req.params.slug;
  var posts = storage.values();
  var post = _.find(posts, function (p) {
    return p.meta.slug === slug;
  });

  if (! post) {
    res.send(404, { post: {} });
    console.warn(`[404] posts/${slug}`);
    return;
  }

  var index = post.index;
  post = augmenters.run(posts, index, 'writtenOn', 'romanNumerals', 'neighbours');

  res.send( { post: post } );
};
