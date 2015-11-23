'use strict';
var augmentUtil = require('../util/augment');

/**!
 * Stolen from <http://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript>
 */
function romanise (num) {
  if (! +num) {
    return false;
  }
  var digits = String(+num).split('');
  var key = ['','C','CC','CCC','CD','D','DC','DCC','DCCC','CM',
            '','X','XX','XXX','XL','L','LX','LXX','LXXX','XC',
            '','I','II','III','IV','V','VI','VII','VIII','IX'];
  var roman = '';
  var i = 3;
  while (i--) {
    roman = (key[+digits.pop() + (i * 10)] || '') + roman;
  }
  return new Array( + digits.join('') + 1).join('M') + roman;
}

module.exports = function romanNumerals (postJson, index) {
  var post = augmentUtil.findByIndex(postJson, index);
  post.numeral = romanise(post.index+1);
  return post;
};
