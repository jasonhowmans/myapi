'use strict';
var _ = require('lodash');

/**!
 * Run a sequence of augmentor methods on the data
 * @param {Object} data – The data object to run the augmentors on
 * @param {Integer} index – Index of the item being modified
 * @param {String} ...augmentors – A list of augmentors to run on the data
 */
function runAugmentors (/* arguments */) {
  var data = Array.prototype.shift.call(arguments);
  var index = Array.prototype.shift.call(arguments);

  if (! _.isObject(data)) {
    console.warn(new TypeError('data should be a Object'));
    return;
  }
  if (! _.isNumber(index)) {
    console.warn(new TypeError('data should be a Object'));
    return;
  }
  if (! _.isArguments(arguments)) {
    console.warn(new TypeError('no augmentors present'));
    return;
  }

  var post;
  var augmentors = Array.from(arguments);
  augmentors.forEach( augFile => {
    post = null;
    var augmentor = runAugmentors.prototype.safeLoad(augFile);
    if (_.isFunction(augmentor)) {
      post = augmentor(data, index);
    }
  });
  return post;
}

/**!
 * Run a the sequence of augmentor methods as a map
 * @param {Array} data – The data array to run the augmentors on
 * @param {String} ...augmentors – A list of augmentors to run on the data
 */
runAugmentors.prototype.mapAugmentors = function (/* arguments */) {
  var self = this;
  var data = Array.prototype.shift.call(arguments);
  var augmentors = Array.from(arguments);

  var index = 0;
  return data.map( function (item) {
    var args = [data, index++].concat(augmentors);
    return runAugmentors.apply(self, args);
  });
};


/**!
 * Basically a proxy fer try catching require statements
 */
runAugmentors.prototype.safeLoad = function (augmentor) {
  if (! _.isString(augmentor)) {
    console.warn(new TypeError('augmentor is not a string'));
    return;
  }

  try {
    return require(`./${augmentor}`);
  } catch (e) {
    console.warn(`./augmentors/${augmentor}.js doesn't exist`);
    console.log(e);
  }
};

module.exports = Object.freeze({
   run: runAugmentors,
   map: runAugmentors.prototype.mapAugmentors
});
