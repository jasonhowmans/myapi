'use strict';
module.exports = function neighbours (postJson, index) {
  var post = postJson[index];

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
