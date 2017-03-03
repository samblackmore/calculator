var numbers = [0,1,2,3,4,5,6,7,8,9].map(function(n) {return String(n)}).reverse();
var operators = ['+','-','*','/'];
var brackets = ['(', ')'];
var decimal = '.';
var buttons = numbers.concat(operators).concat(brackets);
buttons.push(decimal);
buttons.push('C');

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

function isOperator(char) {
  return found(operators, char);
}

function isNumber(char) {
  return found(numbers, char);
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

function buttonClick(value) {
  var formula = document.getElementById('display').textContent;
  var lastCharPos = formula.length - 1;
  var lastChar = formula.charAt(lastCharPos);
  var penultimateChar = formula.charAt(lastCharPos - 1);

  // If we pressed Clear...
  if (value === 'C') {
    display.innerHTML = initialMessage;
    return;
  }

  if (stripLastChar(value, lastChar, penultimateChar))
    formula = formula.substring(0, lastCharPos);

  display.innerHTML = formula + value;
}
