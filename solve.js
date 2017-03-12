module.exports = solve;

var math = require('./math');
var util = require('./util');
var errors = require('./error');
var constants = require('./constants');

var cConsoleDim = '#afcfaf';

var log = util.log;
var found = util.found;
var isNumber = math.isNumber;
var toNumber = math.toNumber;
var isOperator = math.isOperator;
var roundPlaces = math.roundPlaces;
var countOccurrences = util.countOccurrences;
var findCommonElement = util.findCommonElement;
var UnequalBracketsError = errors.UnequalBracketsError;
var EndWithOperatorError = errors.EndWithOperatorError;
var BracketsNotValidError = errors.BracketsNotValidError;

function solve(string) {
  return parseBrackets(parseFormula(string));
}

// Solve each operator in order
function solveOperators(arr) {
  arr = solveOperator(arr, ['*', '/']);
  arr = solveOperator(arr, ['+', '-']);
  if (!arr.length) return 0;
  return arr[0];
}

// Evaluate all occurrences of given operator
function solveOperator(arr, operator) {
  while (found(arr, operator)) {
    var pos;
    if (operator instanceof Object) {             // If array of operators
      var foundOperator = findCommonElement(arr, operator);
      pos = arr.indexOf(foundOperator);
    } else pos = arr.indexOf(operator);

    log(arr, cConsoleDim, pos);

    arr[pos] = evaluate(arr[pos], arr[pos-1], arr[pos+1]);
    delete arr[pos-1];
    delete arr[pos+1];

    var copy = arr.slice('');
    copy.unshift(constants.equals);
    copy = copy.filter(function(elem) {
      return elem != undefined;
    });

    log(copy, cConsoleDim, pos);

    arr = arr.filter(function(elem) {
      return elem != undefined;
    });
  }
  return arr;
}

// Does the math
function evaluate(operator, lhs, rhs) {
  if (typeof lhs === 'undefined') lhs = 0;
  if (typeof rhs === 'undefined') rhs = 0;
  lhs = toNumber(lhs);
  rhs = toNumber(rhs);
  var r;
  switch (operator) {
    case '*': r = lhs * rhs; break;
    case '/': r = lhs / rhs; break;
    case '+': r = lhs + rhs; break;
    case '-': r = lhs - rhs; break;
  }
  return roundPlaces(r, 9);
  //return r;
}

// Takes a string and returns an array where each element is a number or an operator
function parseFormula(string) {
  if (!string) return [];
  var result = [string.charAt(0)];
  for (var i = 1; i < string.length; i++) {
    var char = string.charAt(i);
    var last = string.charAt(i-1);
    if ((char === constants.decimal || isNumber(char))
    && (last === constants.decimal || isNumber(last)))
      result[result.length-1] += char;
    else result.push(char);
  }
  return result.map(function(elem) {
    if (isNumber(elem))
      return toNumber(elem);
    return elem;
  });
}

// Returns location of first pair of brackets
function findBrackets(arr) {
  var open;
  for (var i = 0; i < arr.length; i++) {
    var elem = arr[i];
    if (elem === '(') open = i;
    if (elem === ')' && open !== undefined) return [open, i];
  }
  return false;
}

function parseBrackets(arr) {
  checkEqualBrackets(arr);
  checkNotEndWithOperator(arr);

  while (findBrackets(arr)) {
    //console.log(arr);
    var open = findBrackets(arr)[0];
    var close = findBrackets(arr)[1];
    var preceding = arr[open-1];
    var following = arr[close+1];
    var formula = arr.slice(open+1, close);         // Elements between brackets

    checkNotEndWithOperator(formula);

    if (isNumber(preceding) || preceding === ')') {
      arr.splice(open, 0, '*');
      open++; close++;                              // Shift after inserting *
    }

    if (isNumber(following))
      arr.splice(close+1, 0, '*');

    log(arr, cConsoleDim, open, close);             // Log before solve
    var solution = solveOperators(formula);         // Solve it
    arr.splice(open, formula.length+2, solution);   // +2 accounts for brackets
    log(arr, cConsoleDim, open);                    // Log solution
  }
  checkBracketsValid(arr);
  // Success
  //console.log(arr);
  return solveOperators(arr);
}

// Exceptions

function checkEqualBrackets(arr) {
  if (countOccurrences(arr, '(') !== countOccurrences(arr, ')'))
    throw new UnequalBracketsError();
}

function checkNotEndWithOperator(arr) {
  if (found(constants.operators, arr[arr.length-1]))
    throw new EndWithOperatorError();
}

function checkBracketsValid(arr) {
  if (!findBrackets(arr) && (countOccurrences(arr, '(') || countOccurrences(arr, ')')))
    throw new BracketsNotValidError();
}
