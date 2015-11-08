var moment = require('moment');

/**!
 * Add a written_on value to the post output, for a readable time
 * @param {Object || Array} postJson – The raw json object to be sent as a response
 */
module.exports = function (postJson) {
  postJson.written_on = moment(postJson.meta.date).fromNow();
  return postJson;
};
