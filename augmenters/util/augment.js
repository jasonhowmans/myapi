var _ = require('lodash');

function findByIndex (posts, index) {
  var post = _.find(posts, p => p.index === index);

  if (! _.isObject(post) ) {
    throw new TypeError(`Post [${index}] can't be found in posts`)
    return null;
  }
  return post;
}

module.exports = Object.freeze({
  findByIndex: findByIndex
});
