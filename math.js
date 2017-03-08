// Solve each operator in order
function solve(arr) {
  arr = solver(arr, '*');
  arr = solver(arr, '/');
  arr = solver(arr, /\+|-/);
  return arr.toString();
}

// Evaluate all occurrences of given operator
function solver(arr, operator) {
  while (found(arr, operator)) {
    var pos;
    if (operator instanceof RegExp)
      pos = arr.indexOf(operator.exec(arr)[0]);
    else
      pos = arr.indexOf(operator);

    log(evalString(arr, pos), cConsoleDim, evalSubString(arr, pos));

    arr[pos] = evaluate(arr[pos], arr[pos-1], arr[pos+1]);
    delete arr[pos-1];
    delete arr[pos+1];

    log('=' + arr.join(''), cConsoleDim, arr[pos]);

    arr = arr.filter(function(elem) {
      return elem != undefined;
    });
  }
  return arr;
}

// Does the math
function evaluate(operator, lhs, rhs) {
  lhs = toNumber(lhs);
  rhs = toNumber(rhs);
  switch (operator) {
    case '*': return lhs * rhs;
    case '/': return lhs / rhs;
    case '+': return lhs + rhs;
    case '-': return lhs - rhs;
  }
}

// Takes a string and returns an array where each element is a number or an operator
function parseFormula(string) {
  if (typeof string === 'number')
    return string;
  var result = [string.charAt(0)];
  for (var i = 1; i < string.length; i++) {
    var char = string.charAt(i);
    var last = string.charAt(i-1);
    if ((char === '.' || isNumber(char)) && (last === '.' || isNumber(last)))
      result[result.length-1] += char;
    else result.push(char);
  }
  return result.map(function(elem) {
    if (isNumber(elem))
      return toNumber(elem);
    return elem;
  });
}

function parseBrackets(string) {
  if (getOccurrences(string, /\(/) !== getOccurrences(string, /\)/))
    throw {
      name: 'UnequalBracketsError',
      message: 'Please provide an equal number of opening and closing brackets'
    }
  var open, wave = 1;
  while (found(string, '(')) {
    console.log('Parsing phase ' + wave++);
    for (var i = 0; i < string.length; i++) {
      var char = string.charAt(i);
      if (char === '(') open = i;
      if (char === ')') {
        var formula = string.slice(open+1, i);
        log(string, cConsoleDim, '(' + formula + ')');
        var solution = solve(parseFormula(formula));
        string = string.replace('(' + formula + ')', solution);
        log(string, cConsoleDim, solution);
        break;
      }
    }
  }
  log('=' + solve(parseFormula(string)), 'white');
  return solve(parseFormula(string));
}

function isOperator(char) {
  return found(operators, char);
}

function isNumber(string) {
  return !isNaN(parseFloat(string));
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
   1.234 * 100  = 123.4
   123.4 + 0.5  = 123.9
   123.9 to int = 123
   123 / 100    = 1.23
   */
   var places = 1000;
   return parseInt(num * places + 0.5) / places;
}
