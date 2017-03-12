module.exports = {
  isNumber: isNumber,
  isOperator: isOperator,
  toNumber: toNumber,
  roundPlaces: roundPlaces
}

var constants = require('./constants');
var util = require('./util');
var found = util.found;

function isNumber(string) {
  return !isNaN(parseFloat(string));
}

function isOperator(char) {
  return found(constants.operators, char);
}

function toNumber(n) {
  if (typeof n === 'number')
    return n;
  if (found(n, constants.decimal))
    return parseFloat(n);
  return parseInt(n);
}

/*
Proof:
places = 2, p = 100
1.234 * 100  = 123.4
123.4 + 0.5  = 123.9
123.9 to int = 123
123 / 100    = 1.23
*/
function roundPlaces(num, places) {
  var sign = (num < 0 ? -1 : 1);
  var p = 10;                           // p = 10 ^ places
  for (var i = 1; i < places; i++) {    // Raise 10 places times
    p *= 10;
  }

  return parseInt(num * p + (sign * 0.5)) / p;
}
