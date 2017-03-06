var numbers = [0,1,2,3,4,5,6,7,8,9].map(function(n) {return String(n)}).reverse();
var operators = ['*','/','+','-'];
var brackets = ['(', ')'];
var decimal = '.';
var buttons = numbers.concat(operators).concat(brackets);
buttons.push(decimal);
buttons.push('C');
buttons.push('=');

buttons.forEach(function(value) {
  var calculator = document.getElementById('calculator');
  var button = document.createElement('button');
  var text = document.createTextNode(value);
  button.appendChild(text);
  button.setAttribute('onclick', 'buttonClick("' + value + '")');
  calculator.appendChild(button);
});

function found(arr, elem) {
  return arr.indexOf(elem) != -1;
}

function isNumber(string) {
  var chars = string.split('');
  return chars.every(function(char) {
    return found(numbers, string);
  });
}

function isOperator(char) {
  return found(operators, char);
}

function needToResolve(val) {
  if (typeof val === 'number')
    return false;
  return operators.some(function(operator) {
    return found(val, operator);
  });
}

function stripLastChar(newChar, lastChar, penultimateChar) {
  // Operator followed by another operator - choose the latest
  if (isOperator(lastChar) && isOperator(newChar))
    return true;

  // If zero followed by a number, we can potentially remove the zero...
  if (lastChar === '0' && isNumber(newChar)
    /* If the zero was not preceded by a number:
       e.g. +0 followed by 1 becomes +1  (remove the zero)
       and   0 followed by 1 becomes 1   (remove the zero)
       but  10 followed by 1 becomes 101 (keep the zero)*/
    && (!isNumber(penultimateChar) || penultimateChar == ''))
    return true;

  return false;
}

function canOperate(formula, operator) {
  // Check operator found in formula and formula can be split in 2
  // TODO: Issue #3 - operator at start or end of formula should return false
  return found(formula, operator) && formula.split(operator, 2).length === 2;
}

function resolver(formula, operator) {
  var split = formula.split(operator, 2);
  return evaluate(operator, split[0], split[1]);
}

function resolve(formula) {
  if (!needToResolve(formula))
    return formula;

  console.log('Resolving ' + formula);

  if (canOperate(formula, '*'))
    return resolver(formula, '*');
  else if (canOperate(formula, '/'))
    return resolver(formula, '/');
  else if (canOperate(formula, '+'))
    return resolver(formula, '+');
  else if (canOperate(formula, '-'))
    return resolver(formula, '-');
}

function toInt(n) {
  if (typeof n === 'number')
    return n;
  if (found(n, '.'))
    return parseFloat(n);
  return parseInt(n);
}

function evaluate(operator, lhs, rhs) {
  lhs = toInt(lhs);
  rhs = toInt(rhs);
  switch (operator) {
    case '*': return lhs * rhs;
    case '/': return lhs / rhs;
    case '+': return lhs + rhs;
    case '-': return lhs - rhs;
  }
}

function evaluateRecursive(operator, lhs, rhs) {
  if (!needToResolve(lhs) && !needToResolve(rhs)) {
    return evaluate(operator, lhs, rhs);
  }
  return evaluateRecursive(operator, resolve(lhs), resolve(rhs));
}

// Takes a string and returns an array where
// each element is a number or an operator
function parseFormula(string) {
  var result = [string.charAt(0)];
  for (var i = 1; i < string.length; i++) {
    var char = string.charAt(i);
    var last = string.charAt(i-1);
    if ((char === '.' || isNumber(char)) && (last === '.' || isNumber(last)))
      result[result.length-1] += char;
    else result.push(char);
  }
  return result;
}

function solver(arr, operator) {
  while (found(arr, operator)) {
    var pos = arr.indexOf(operator);
    arr[pos] = evaluate(operator, arr[pos-1], arr[pos+1]);
    delete arr[pos-1];
    delete arr[pos+1];
    return arr.filter(function(elem) {
      return elem != undefined;
    });
  }
}

function solve(arr) {
  arr = solver(arr, '*');
  arr = solver(arr, '/');
  arr = solver(arr, '+');
  arr = solver(arr, '-');
  return arr;
}

function buttonClick(value) {
  var formula = document.getElementById('display').textContent;
  var lastCharPos = formula.length - 1;
  var lastChar = formula.charAt(lastCharPos);
  var penultimateChar = formula.charAt(lastCharPos - 1);

  // If we pressed Clear...
  if (value === 'C') {
    display.innerHTML = 0;
    return;
  }

  if (value === '=') {
    display.innerHTML = solve(parseFormula(formula));
    return;
  }

  if (stripLastChar(value, lastChar, penultimateChar))
    formula = formula.substring(0, lastCharPos);

  display.innerHTML = formula + value;
}
