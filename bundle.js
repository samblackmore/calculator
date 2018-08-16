(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./constants":2,"./math":5}],2:[function(require,module,exports){
module.exports = {
  numbers: [0,1,2,3,4,5,6,7,8,9].map(function(n) {return String(n)}).reverse(),
  operators: ['*','/','+','-'],
  brackets: ['(', ')'],
  decimal: '.',
  clear: 'C',
  equals: '='
}

},{}],3:[function(require,module,exports){
module.exports = {
  UnequalBracketsError: UnequalBracketsError,
  EndWithOperatorError: EndWithOperatorError,
  BracketsNotValidError: BracketsNotValidError,
  BracketsEmptyError: BracketsEmptyError
}

function EndWithOperatorError(message) {
  this.name = 'EndWithOperatorError';
  this.message = message || 'Formula ends with an operator';
  this.stack = (new Error()).stack;
}
UnequalBracketsError.prototype = Object.create(Error.prototype);
UnequalBracketsError.prototype.constructor = UnequalBracketsError;

function UnequalBracketsError(message) {
  this.name = 'UnequalBracketsError';
  this.message = message || 'Please provide an equal number of opening and closing brackets';
  this.stack = (new Error()).stack;
}
UnequalBracketsError.prototype = Object.create(Error.prototype);
UnequalBracketsError.prototype.constructor = UnequalBracketsError;

function BracketsNotValidError(message) {
  this.name = 'BracketsNotValidError';
  this.message = message || 'Brackets closed without being opened';
  this.stack = (new Error()).stack;
}
BracketsNotValidError.prototype = Object.create(Error.prototype);
BracketsNotValidError.prototype.constructor = BracketsNotValidError;

function BracketsEmptyError(message) {
  this.name = 'BracketsEmptyError';
  this.message = message || 'Cannot evaluate empty brackets';
  this.stack = (new Error()).stack;
}
BracketsEmptyError.prototype = Object.create(Error.prototype);
BracketsEmptyError.prototype.constructor = BracketsEmptyError;

},{}],4:[function(require,module,exports){
// Imports
var constants = require('./constants');
var math = require('./math');
var util = require('./util');
var solve = require('./solve');
var testInputs = require('./tests');
var replaceLastChar = require('./calc');
var log = util.log;
var found = util.found;

// Globals
var solved = false;
var cConsoleDim = '#afcfaf';
var cons = document.getElementById('console');
var display = document.getElementById('display');
var buttons = constants.numbers
  .concat(constants.operators)
  .concat(constants.brackets)
  .concat(constants.decimal)
  .concat(constants.clear)
  .concat(constants.equals);

// Add buttons to calculator
buttons.forEach(function(value) {
  var calculator = document.getElementById('calculator');
  var button = document.createElement('button');
  var text = document.createTextNode(value);
  button.appendChild(text);
  button.className = 'button';
  button.addEventListener('click', function() {
    buttonClick(value)
  });
  calculator.appendChild(button);
});

testInputs.forEach(function(value) {
  var container = document.getElementById('test-container');
  var button = document.createElement('button');
  var text = document.createTextNode(value);
  button.appendChild(text);
  button.className = 'test';
  button.addEventListener('click', function() {
    testClick(value)
  });
  container.appendChild(button);
});

document.onkeypress = function(e) {
  var val = String.fromCharCode(e.which);
  if (found(buttons, val)) buttonClick(val);
  if (e.which === 13) buttonClick(constants.equals);
}
document.onkeydown = function(e) {
  if (e.which === 46) buttonClick(constants.clear);
}

function testClick(value) {
  // Take focus away from the clicked button
  var dummy = document.getElementById('dummyFocus');
  dummy.focus(); dummy.blur();
  cons.innerHTML = 'press equals';
  display.innerHTML = value;
  solved = false;
}

function buttonClick(value) {
  var formula = display.textContent;

  if (solved) {
    solved = false;
    if (!math.isOperator(value)) {
      formula = '0';
      cons.innerHTML = 'hi';
    }
  }

  // If we pressed Clear...
  if (value === constants.clear)
    display.innerHTML = 0;

  else if (value === constants.equals) {
    try {
      cons.innerHTML = null;
      log(formula, cConsoleDim);
      display.innerHTML = solve(formula);
      solved = true;
    } catch (e) {
      cons.innerHTML += e.message;
      throw e;
    }
  }

  // If we pressed number, operator, decimal or brackets
  else {
    if (replaceLastChar(formula, value))
      formula = formula.substring(0, formula.length - 1);

    display.innerHTML = formula + value;
  }
}

},{"./calc":1,"./constants":2,"./math":5,"./solve":6,"./tests":7,"./util":8}],5:[function(require,module,exports){
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

},{"./constants":2,"./util":8}],6:[function(require,module,exports){
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
var BracketsEmptyError = errors.BracketsEmptyError;
var UnequalBracketsError = errors.UnequalBracketsError;
var EndWithOperatorError = errors.EndWithOperatorError;
var BracketsNotValidError = errors.BracketsNotValidError;

function solve(string) {
  var solution = solveBrackets(parseFormula(string));
  return roundPlaces(solution, 10); // Round to 10 dec places
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
  return r;
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

function solveBrackets(arr) {
  checkEqualBrackets(arr);
  checkNotEndWithOperator(arr);

  while (findBrackets(arr)) {
    //console.log(arr);
    var open = findBrackets(arr)[0];
    var close = findBrackets(arr)[1];
    var preceding = arr[open-1];
    var following = arr[close+1];
    var formula = arr.slice(open+1, close);         // Elements between brackets

    checkNotEmpty(formula);
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

function checkNotEmpty(arr) {
  if (arr.length === 0) {
    throw new BracketsEmptyError();
  }
}

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

},{"./constants":2,"./error":3,"./math":5,"./util":8}],7:[function(require,module,exports){
module.exports = [
  '123',
  '+',
  '1+2',
  '-1+3',
  '1+2+',
  '/1+3',
  '1/0',
  '1+2*3/4-5',
  '5/6+6/7',
  '0.01-0.001',
  '1.001+2.56*3.90/0.004-0.5',
  '2*(3/(1-(5)/6)+4',
  '2*)(',
  '2*()',
  '2(3)',
  '(3)2',
  '2*)',
  '2)(',
  '2()',
  '(2)',
  '()',
  '(1+2*)',
  '(1*2)(1+2*)',
  '(1-2)(1+2)',
  '(-1-2)(-2)',
  '(1)(2)',
  '))((())(',
  '(((((((())))))))',
  '()()()()()()()()',
  '1+2*(3-(1+2-(3/4)+(4/5+(5/6+6/7))/8))'
]

},{}],8:[function(require,module,exports){
var myMath = require('./math');
var roundPlaces = myMath.roundPlaces;

module.exports = {
  log: log,
  found: found,
  findCommonElement: findCommonElement,
  getOccurrences: getOccurrences,
  countOccurrences: countOccurrences
}

// Takes an array and outputs a string where numbers are rounded
function formatRound(arr) {
  return arr.map(function(elem) {
    if (typeof elem === 'number') return roundPlaces(elem, 3);
    else return elem;
  }).join('');
}

// Log to the html console, highlight elements in white if provided (start & end)
function log(arr, color, start=null, end=null) {

  if (typeof document === 'undefined')  // Mocha tests have no document
    return;

  var spans = [],
      br = document.createElement('br'),
      cons = document.getElementById('console');

  if (typeof arr === 'string')
    arr = arr.split('');

  console.log(arr.join(''));

  // If no highlighting
  if (start === null)
    spans.push({
        text: formatRound(arr),
        color: color
      });
  // If highlighting one element
  else if (end === null) {
    spans.push({
      text: formatRound(arr.slice(0, start)),
      color: color
    });
    spans.push({
      text: formatRound(arr.slice(start, start+1)),
      color: 'white'
    });
    spans.push({
      text: formatRound(arr.slice(start+1, arr.length)),
      color: color
    });
  }
  // If highlighting a range
  else {
    spans.push({
      text: formatRound(arr.slice(0, start)),
      color: color
    });
    spans.push({
      text: formatRound(arr.slice(start, end+1)),
      color: 'white'
    });
    spans.push({
      text: formatRound(arr.slice(end+1, arr.length)),
      color: color
    });
  }

  spans.forEach(function(s) {
    var span = document.createElement('span');
    var txt;
    switch (typeof s.text) {
      case 'string': txt = s.text; break;
      case 'number': txt = roundPlaces(s.text); break;
      case 'object': txt = formatRound(s.text); break;
    }
    var text = document.createTextNode(txt);
    span.style.color = s.color;
    span.appendChild(text);
    cons.appendChild(span);
  });

  cons.appendChild(br);
}

// Takes an evaluation and outputs string with brackets around operation
function evalString(arr, pos) {
  var copy = arr.slice();
  copy[pos-1] = '(' + copy[pos-1];
  copy[pos+1] += ')';
  return copy.join('');
}

// Takes an evaluation and outputs the bit being evaluated
function evalSubString(arr, pos) {
  var copy = arr.slice();
  copy[pos-1] = '(' + copy[pos-1];
  copy[pos+1] += ')';
  return String(copy[pos-1] + copy[pos] + copy[pos+1]);
}

function found(src, item) {
  if (item instanceof RegExp)
    return item.test(src);
  if (item instanceof Object)
    return item.some(function(subItem) {
      return src.indexOf(subItem) != -1;
    });
  return src.indexOf(item) != -1;
}

// Finds an element shared between 2 arrays
function findCommonElement(arr1, arr2) {
  for (var i = 0; i < arr1.length; i++) {
    for (var j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j])
        return arr1[i];
    }
  }
  return false;
}

function getOccurrences(arr, match) {
  return arr.filter(function(elem) {
    return elem === match;
  });
}

function countOccurrences(arr, match) {
  return getOccurrences(arr, match).length;
}

},{"./math":5}]},{},[4]);
