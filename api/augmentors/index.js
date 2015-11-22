var _ = require('lodash');

/**!
 * Run a sequence of augmentor methods on the data
 * @param {Object} data – The data object to run the augmentors on
 * @param {String} ...augmentors – A list of augmentors to run on the data
 */
function runAugmentors (/* arguments */) {
  var data = Array.prototype.shift.call(arguments);

  if (! _.isObject(data)) {
    console.warn(new TypeError('data should be a Object'));
    return;
  }
  if (! _.isArguments(arguments)) {
    console.warn(new TypeError('no augmentors present'));
    return;
  }

  var augmentors = Array.from(arguments);
  augmentors.forEach( function (augFile) {
    var augmentor = runAugmentors.prototype.safeLoad(augFile);
    data = augmentor(data);
  });

  return data;
}


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
   run: runAugmentors
});
