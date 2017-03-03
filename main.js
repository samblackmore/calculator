var buttons = [];

// ASCII codes for all the buttons on our calculator
// plus a pesky comma
for (var i = 40; i <= 57; i++) {
    buttons.push(String.fromCharCode(i));
}
buttons.splice(buttons.indexOf(','), 1);
buttons = buttons.reverse();

buttons.forEach(function(value) {
  var calculator = document.getElementById('calculator');
  var button = document.createElement('button');
  var text = document.createTextNode(value);
  button.appendChild(text);
  button.setAttribute('onclick', 'buttonClick("' + value + '")');
  calculator.appendChild(button);
});

function buttonClick(value) {
  var display = document.getElementById('display');
  display.innerHTML = value;
}
