'use strict';
var storage = require('node-persist');

module.exports = function postHandler (req, res, next) {
  storage.initSync({
    dir: '../../persist'
  });

  var post = storage.getItem(`post:${req.params.slug}`);

  if (! post) {
    res.send(404, {});
    return;
  }

  res.send(post);
};
