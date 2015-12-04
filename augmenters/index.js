'use strict';
var _ = require('lodash');

/**!
 * Run a sequence of augmenter methods on the data
 * @param {Object} data – The data object to run the augmenters on
 * @param {Integer} index – Index of the item being modified
 * @param {String} ...augmenters – A list of augmenters to run on the data
 */
function runAugmenters (/* arguments */) {
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
    console.warn(new TypeError('no augmenters present'));
    return;
  }

  var post;
  var augmenters = Array.from(arguments);
  augmenters.forEach( augFile => {
    post = null;
    var augmenter = runAugmenters.prototype.safeLoad(augFile);
    if (_.isFunction(augmenter)) {
      post = augmenter(data, index);
    }
  });
  return post;
}

/**!
 * Run a the sequence of augmenter methods as a map
 * @param {Array} data – The data array to run the augmenters on
 * @param {String} ...augmenters – A list of augmenters to run on the data
 */
runAugmenters.prototype.mapaugmenters = function (/* arguments */) {
  var self = this;
  var data = Array.prototype.shift.call(arguments);
  var augmenters = Array.from(arguments);

  var index = 0;
  return data.map( function (item) {
    var args = [data, index++].concat(augmenters);
    return runAugmenters.apply(self, args);
  });
};


/**!
 * Basically a proxy fer try catching require statements
 */
runAugmenters.prototype.safeLoad = function (augmenter) {
  if (! _.isString(augmenter)) {
    console.warn(new TypeError('augmenter is not a string'));
    return;
  }

  try {
    return require(`./${augmenter}`);
  } catch (e) {
    console.warn(`./augmenters/${augmenter}.js doesn't exist`);
    console.log(e);
  }
};

module.exports = Object.freeze({
   run: runAugmenters,
   map: runAugmenters.prototype.mapaugmenters
});
