'use strict';
var moment = require('moment');
var augmentUtil = require('../util/augment');

/**!
 * Add a written_on value to the post output, for a readable time
 * @param {Object || Array} postJson – The raw json object to be sent as a response
 */
module.exports = function (postJson, index) {
  var post = augmentUtil.findByIndex(postJson, index);

  post.written_on = moment(post.meta.date).fromNow();
  return post;
};
