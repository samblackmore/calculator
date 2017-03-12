// Imports
var constants = require('./constants');
var math = require('./math');
var util = require('./util');
var solve = require('./solve');
var testInputs = require('./tests');
var replaceLastChar = require('./calc');
var log = util.found;

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
    formula = '0';
    cons.innerHTML = 'hi';
    solved = false;
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
