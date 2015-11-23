var _ = require('lodash');

function findByIndex (posts, index) {
  return _.find(posts, p => p.index === index);
}

module.exports = Object.freeze({
  findByIndex: findByIndex
});
