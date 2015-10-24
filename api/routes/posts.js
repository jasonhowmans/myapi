'use strict';
var storage = require('node-persist');

module.exports = function postsHandler (req, res, next) {
  storage.initSync({
    dir: '../../persist'
  });
  var posts = storage.values();
  if (! posts) {
    res.send([]);
    return;
  }
  res.send(posts);
};
