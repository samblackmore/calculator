// Globals
var cConsoleDim = '#afcfaf';
var numbers = [0,1,2,3,4,5,6,7,8,9].map(function(n) {return String(n)}).reverse();
var operators = ['*','/','+','-'];
var brackets = ['(', ')'];
var decimal = '.';
var solved = false;
var buttons = numbers.concat(operators).concat(brackets).concat(decimal).concat('C').concat('=');
var cons = document.getElementById('console');
var display = document.getElementById('display');

// Add buttons to calculator
buttons.forEach(function(value) {
  var calculator = document.getElementById('calculator');
  var button = document.createElement('button');
  var text = document.createTextNode(value);
  button.appendChild(text);
  button.className = 'button';
  button.setAttribute('onclick', 'buttonClick("' + value + '")');
  calculator.appendChild(button);
});

testInputs.forEach(function(value) {
  var container = document.getElementById('test-container');
  var button = document.createElement('button');
  var text = document.createTextNode(value);
  button.appendChild(text);
  button.className = 'test';
  button.setAttribute('onclick', 'testClick("' + value + '")');
  container.appendChild(button);
});

document.onkeypress = function(e) {
  var val = String.fromCharCode(e.which);
  if (buttons.indexOf(val) !== -1) buttonClick(val);
  if (e.which === 13) buttonClick('=');
}
document.onkeydown = function(e) {
  if (e.which === 46) buttonClick('C');
}

function testClick(value) {
  cons.innerHTML = 'press equals';
  display.innerHTML = value;
  solved = false;
}

function buttonClick(value) {
  var formula = display.textContent;

  if (solved) {
    formula = '0';
    cons.innerHTML = 'hi';
    solved = false;
  }

  // If we pressed Clear...
  if (value === 'C')
    display.innerHTML = 0;

  else if (value === '=') {
    try {
      cons.innerHTML = null;
      log(formula, cConsoleDim);
      display.innerHTML = parseBrackets(parseFormula(formula));
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
