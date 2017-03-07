// Solve each operator in order
function solve(arr) {
  arr = solver(arr, '*');
  arr = solver(arr, '/');
  arr = solver(arr, '+');
  arr = solver(arr, '-');
  return arr;
}

// Evaluate all occurrences of given operator
function solver(arr, operator) {
  while (found(arr, operator)) {
    var pos = arr.indexOf(operator);

    log(evalString(arr, pos), cConsoleDim, /\(.+\)/);

    arr[pos] = evaluate(operator, arr[pos-1], arr[pos+1]);
    delete arr[pos-1];
    delete arr[pos+1];

    log('=' + arr.join(''), cConsoleDim, new RegExp(arr[pos]));

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
