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

  // Replace the last character if...
  // it was an operator and this is also an operator e.g. + becomes -
  // it was a zero not following a number e.g. 01 becomes 1
  // it was a zero on its own
  if ((isOperator(value) && isOperator(lastChar))
    || (lastChar === '0' && !isNumber(penultimateChar))
    || (lastChar === '0' && penultimateChar == ''))
    {
      formula = formula.substring(0, lastCharPos);
    }

  display.innerHTML = formula + value;
}
