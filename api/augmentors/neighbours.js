'use strict';
var augmentUtil = require('../util/augment');

module.exports = function neighbours (postJson, index) {
  var post = augmentUtil.findByIndex(postJson, index);

  if (index > 0) {
    post.previous = postJson[index-1].meta.slug;
  } else {
    post.previous = null;
  }

  if (index < (postJson.length - 1)) {
    post.next = postJson[index+1].meta.slug;
  } else {
    post.next = null;
  }

  return post;
};
