// Globals
var cConsoleDim = '#afcfaf',
    numbers = [0,1,2,3,4,5,6,7,8,9].map(function(n) {return String(n)}).reverse(),
    operators = ['*','/','+','-'],
    brackets = ['(', ')'],
    decimal = '.',
    solved = false,
    buttons = numbers.concat(operators).concat(brackets);

buttons.push(decimal);
buttons.push('C');
buttons.push('=');

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

function buttonClick(value) {
  var cons = document.getElementById('console');
  var formula = document.getElementById('display').textContent;

  if (solved) {
    formula = '';
    cons.innerHTML = 'hi';
    solved = false;
  }

  // If we pressed Clear...
  if (value === 'C')
    display.innerHTML = 0;

  else if (value === '=') {
    log(formula, cConsoleDim);
    try {
      cons.innerHTML = null;
      display.innerHTML = parseBrackets(formula);
      solved = true;
    } catch (e) {
      cons.innerHTML = e.message;
      throw e;
    }
  }

  // If we pressed number or operator
  else {
    if (replaceLastChar(formula, value))
      formula = formula.substring(0, formula.length - 1);

    display.innerHTML = formula + value;
  }
}
