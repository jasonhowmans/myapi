'use strict';
var augmentUtil = require('./util/augment');

module.exports = function neighbours (postJson, index) {
  var post = augmentUtil.findByIndex(postJson, index);

  if (index === 0) {
    post.previous = null;
  } else {
    post.previous = augmentUtil.findByIndex(postJson, index-1).meta.slug;
  }

  if (index === postJson.length - 1) {
    post.next = null;
  } else {
    post.next = augmentUtil.findByIndex(postJson, index+1).meta.slug;
  }

  return post;
};
