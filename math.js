var operators = ['*','/','+','-'];

// Solve each operator in order
function solve(arr) {
  arr = solver(arr, '*');
  arr = solver(arr, '/');
  arr = solver(arr, ['+', '-']);
  if (!arr.length) return 0;
  return arr;
}

// Evaluate all occurrences of given operator
function solver(arr, operator) {
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
    copy.unshift('=');
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
  if (!string) return [];
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

// Returns location of first pair of brackets
function findBrackets(arr) {
  var open;
  for (var i = 0; i < arr.length; i++) {
    var elem = arr[i];
    if (elem === '(') open = i;
    if (elem === ')' && open) return [open, i];
  }
  return false;
}

function parseBrackets(arr) {
  // Before starting, check equal number of brackets
  if (countOccurrences(arr, '(') !== countOccurrences(arr, ')'))
    throw {
      name: 'UnequalBracketsError',
      message: 'Please provide an equal number of opening and closing brackets'
    }

  if (found(operators, arr[arr.length-1]))
    throw {
      name: 'EndWithOperatorError',
      message: 'Formula ends with an operator :('
    }

  while (findBrackets(arr)) {
    var open = findBrackets(arr)[0],
        close = findBrackets(arr)[1],
        formula = arr.slice(open+1, close),     // Elements between brackets
        lhs = arr.slice(0, open),               // Elements outside left
        rhs = arr.slice(close+1, arr.length);   // Elements outside right
    log(arr, cConsoleDim, open, close);         // Log before solve
    var solution = solve(formula);              // Solve it
    arr = lhs.concat(solution).concat(rhs);     // Replace brackets with solution
    log(arr, cConsoleDim, lhs.length);          // Log solution
  }
  // If brackets still found after solving
  if (countOccurrences(arr, '(') || countOccurrences(arr, ')'))
    throw {
      name: 'BracketsNotClosedError',
      message: "Remaining brackets didn't make sense"
    }
  // Success
  //log('=' + solve(arr), 'white');
  return solve(arr);
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
