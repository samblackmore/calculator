module.exports = {
  isNumber: isNumber,
  isOperator: isOperator,
  toNumber: toNumber,
  roundFrac: roundFrac
}

var util = require('./util');
var found = util.found;
var operators = ['*','/','+','-'];

function isNumber(string) {
  return !isNaN(parseFloat(string));
}

function isOperator(char) {
  return found(operators, char);
}

function toNumber(n) {
  if (typeof n === 'number')
    return n;
  if (found(n, '.'))
    return parseFloat(n);
  return parseInt(n);
}

function roundFrac(num) {
   /*
   Proof:
   1.234 * 100  = 123.4
   123.4 + 0.5  = 123.9
   123.9 to int = 123
   123 / 100    = 1.23
   */
   var places = 1000;
   return parseInt(num * places + 0.5) / places;
}
