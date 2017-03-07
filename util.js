// Takes a string and outputs a copy where numbers are rounded
function formatRoundFrac(string) {
  return parseFormula(string).map(function(elem) {
    if (typeof elem === 'number') return roundFrac(elem);
    else return elem;
  }).join('');
}

// Log to the html console. If a regex is provided, highlight the regex in white
function log(string, color, regex=null) {
  console.log(string);
  var spans = [],
      br = document.createElement('br'),
      cons = document.getElementById('console');

  if (regex === null)
    spans.push(string);
  else {
    spans.push(string.split(regex)[0]);
    spans.push(regex.exec(string)[0]);
    spans.push(string.split(regex)[1]);
  }

  spans.forEach(function(string, i) {
    var span = document.createElement('span'),
        text = document.createTextNode(formatRoundFrac(string));
    if (i == 1) span.style.color = 'white';
    else        span.style.color = color;
    span.appendChild(text);
    cons.appendChild(span);
  });

  cons.appendChild(br);
}

// Takes an evaluation and outputs string with brackets around operation
function evalString(arr, pos) {
  var copy = arr.slice();
  copy[pos-1] = '(' + copy[pos-1];
  copy[pos+1] += ')';
  return copy.join('');
}

function found(arr, elem) {
  return arr.indexOf(elem) != -1;
}
