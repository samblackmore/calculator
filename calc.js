module.exports = replaceLastChar;

var decimal = require('./constants').decimal;
var myMath = require('./math');
var isNumber = myMath.isNumber;
var isOperator = myMath.isOperator;

// Returns whether the user is currently typing a decimal
function inDecimal(string) {
  for (var i = string.length - 1; i >= 0; i--) {
    var c = string.charAt(i);
    if (c === decimal) return true;
    if (!isNumber(c)) return false;
  }
  return false;
}

// Returns whether or not to replace the last char with the current one
function replaceLastChar(string, newChar) {
  var lastCharPos = string.length - 1;
  var lastChar = string.charAt(lastCharPos);
  var penultimateChar = string.charAt(lastCharPos - 1);

  if (string === '0' && newChar !== decimal)
    return true;

  // Operator followed by another operator - choose the latest
  if (isOperator(lastChar) && isOperator(newChar))
    return true;

  /* If zero followed by a number, we can potentially remove the zero
     if the zero was not preceded by a number:
     e.g. +0 followed by 1 becomes +1  (remove the zero)
     and   0 followed by 1 becomes 1   (remove the zero)
     but  10 followed by 1 becomes 101 (keep the zero) */
  if (!inDecimal(string) && lastChar === '0' && isNumber(newChar)
      && (!isNumber(penultimateChar) || penultimateChar == ''))
    return true;

  return false;
}
