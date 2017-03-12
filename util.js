var myMath = require('./math');
var roundFrac = myMath.roundFrac;

module.exports = {
  log: log,
  found: found,
  findCommonElement: findCommonElement,
  getOccurrences: getOccurrences,
  countOccurrences: countOccurrences
}

// Takes an array and outputs a string where numbers are rounded
function formatRoundFrac(arr) {
  return arr.map(function(elem) {
    if (typeof elem === 'number') return roundFrac(elem);
    else return elem;
  }).join('');
}

// Log to the html console, highlight elements in white if provided (start & end)
function log(arr, color, start=null, end=null) {

  if (typeof document === 'undefined')  // Mocha tests have no document
    return;

  var spans = [],
      br = document.createElement('br'),
      cons = document.getElementById('console');

  if (typeof arr === 'string')
    arr = arr.split('');

  console.log(arr.join(''));

  // If no highlighting
  if (start === null)
    spans.push({
        text: formatRoundFrac(arr),
        color: color
      });
  // If highlighting one element
  else if (end === null) {
    spans.push({
      text: formatRoundFrac(arr.slice(0, start)),
      color: color
    });
    spans.push({
      text: arr[start],
      color: 'white'
    });
    spans.push({
      text: formatRoundFrac(arr.slice(start+1, arr.length)),
      color: color
    });
  }
  // If highlighting a range
  else {
    spans.push({
      text: formatRoundFrac(arr.slice(0, start)),
      color: color
    });
    spans.push({
      text: formatRoundFrac(arr.slice(start, end+1)),
      color: 'white'
    });
    spans.push({
      text: formatRoundFrac(arr.slice(end+1, arr.length)),
      color: color
    });
  }

  spans.forEach(function(s) {
    var span = document.createElement('span');
    var txt;
    switch (typeof s.text) {
      case 'string': txt = s.text; break;
      case 'number': txt = roundFrac(s.text); break;
      case 'object': txt = formatRoundFrac(s.text); break;
    }
    var text = document.createTextNode(txt);
    span.style.color = s.color;
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

// Takes an evaluation and outputs the bit being evaluated
function evalSubString(arr, pos) {
  var copy = arr.slice();
  copy[pos-1] = '(' + copy[pos-1];
  copy[pos+1] += ')';
  return String(copy[pos-1] + copy[pos] + copy[pos+1]);
}

function found(src, item) {
  if (item instanceof RegExp)
    return item.test(src);
  if (item instanceof Object)
    return item.some(function(subItem) {
      return src.indexOf(subItem) != -1;
    });
  return src.indexOf(item) != -1;
}

// Finds an element shared between 2 arrays
function findCommonElement(arr1, arr2) {
  for (var i = 0; i < arr1.length; i++) {
    for (var j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j])
        return arr1[i];
    }
  }
  return false;
}

function getOccurrences(arr, match) {
  return arr.filter(function(elem) {
    return elem === match;
  });
}

function countOccurrences(arr, match) {
  return getOccurrences(arr, match).length;
}
