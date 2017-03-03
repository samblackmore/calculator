var buttons = [];

// ASCII codes for all the buttons on our calculator
// plus a pesky comma
for (var i = 40; i <= 57; i++) {
    buttons.push(String.fromCharCode(i));
}
buttons.splice(buttons.indexOf(','), 1);

buttons.forEach(function(button) {
  document.write('<button>' + button + '</button>');
});
