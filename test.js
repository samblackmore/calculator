var assert = require('assert');
var solve = require('./solve');
var errors = require('./error');
var roundPlaces = require('./math').roundPlaces;
var UnequalBracketsError = errors.UnequalBracketsError;
var EndWithOperatorError = errors.EndWithOperatorError;
var BracketsNotValidError = errors.BracketsNotValidError;
var BracketsEmptyError = errors.BracketsEmptyError;

var third = 0.333333333333333333;
var twoThirds = 0.666666666666666667;
var testAccuracy = 7;  // Number of decimal places tests should be accurate to

function test(str, num) {
  var solution = solve(str);
  var expected = roundPlaces(num, testAccuracy);
  var actual = roundPlaces(solution, testAccuracy);
  assert.equal(expected, actual);
}

describe('#solve()', function() {
  it('should do addition', function() {
    test('1+2', 3);                // Simple test
    test('-5+3', -2);              // Negative
    test('2000+3000', 5000);       // Big numbers
    test('0.001+0.01', 0.011);     // Floats
  });

  it('should do subtraction', function() {
    test('6-2', 4);                // Simple test
    test('-5-6', -11);             // Negative
    test('-6000-4000', -10000);    // Big numbers
    test('0.01-0.001', 0.009);     // Floats
  });

  it('should do multiplication', function() {
    test('3*5', 15);               // Simple test
    test('-2*4', -8);              // Negative
    test('4000*5000', 20000000);   // Big numbers
    test('0.05*0.05', 0.0025);     // Floats
  });

  it('should do division', function() {
    test('12/4', 3);               // Simple test
    test('-10/2', -5);             // Negative
    test('20000/5000', 4);         // Big numbers
    test('0.03/0.02', 1.5);        // Floats
  });

  it('should respect the order of operations', function() {
    // Plus first
    test('1+2-3*4/5', 0.6);
    test('1+2-3/4*5', -0.75);
    test('1+2*3-4/5', 6.2);
    test('1+2*3/4-5', -2.5);
    test('1+2/3*4-5', -(1 + third));
    test('1+2/3-4*5', -(18 + third));
    // Minus first
    test('1-2+3*4/5', 1.4);
    test('1-2+3/4*5', 2.75);
    test('1-2*3+4/5', -4.2);
    test('1-2*3/4+5', 4.5);
    test('1-2/3+4*5', 20 + third);
    test('1-2/3*4+5', 3 + third);
    // Times first
    test('1*2+3-4/5', 4.2);
    test('1*2+3/4-5', -2.25);
    test('1*2-3+4/5', -0.2);
    test('1*2-3/4+5', 6.25);
    test('1*2/3+4-5', -third);
    test('1*2/3-4+5', 1 + twoThirds);
    // Divide first
    test('1/2+3-4*5', -16.5);
    test('1/2+3*4-5', 7.5);
    test('1/2*3+4-5', 0.5);
    test('1/2*3-4+5', 2.5);
    test('1/2-3+4*5', 17.5);
    test('1/2-3*4+5', -6.5);
  });

  it('should infer multiplication', function() {
    test('2(3)', 6);
    test('(3)2', 6);
    test('2(3+4)', 14);
    test('(3+4)2', 14);
    test('(2)(3)', 6);
    test('((2)(3))(4)', 24);
  });

  it('should handle valid brackets', function() {
    test('(1-2)+(3+4)', 6);
    test('(1-2)-(3+4)', -8);
    test('(1-2)*(3+4)', -7);
    test('(1-2)/(3+4)', -0.142857143);
    test('(1-2)(3+4)', -7);
    test('2*(3/(1-(5)/6)+4)', 44);
    test('2*(3/(1-(5-2)/6)+4)', 20);
    test('2*(3/(1-2(5)/6)+4)', -1);
    test('2*(3/(1-(2)(5)/6)+4)', -1);
    test('1-2*(3-(1+2-(3/4)+(4/5+(5/6+6/7))/8))', 0.122619048);
  });

  it('should not accept unequal numbers of brackets', function() {
    var e = UnequalBracketsError;
    assert.throws(function() {solve('(')}, e);
    assert.throws(function() {solve(')')}, e);
    assert.throws(function() {solve('((())()')}, e);
    assert.throws(function() {solve('2*)')}, e);
    assert.throws(function() {solve('2*(3/(1-(5)/6)+4')}, e);
  });

  it('should not accept closing brackets without opening', function() {
    var e = BracketsNotValidError;
    assert.throws(function() {solve(')(')}, e);
    assert.throws(function() {solve(')))))(((((')}, e);
    assert.throws(function() {solve('2)(')}, e);
    assert.throws(function() {solve('2*)(')}, e);
  });

  it('should not accept empty brackets', function() {
    var e = BracketsEmptyError;
    assert.throws(function() {solve('()')}, e);
    assert.throws(function() {solve('(((((((())))))))')}, e);
    assert.throws(function() {solve('()()()()()()()()')}, e);
    assert.throws(function() {solve('2()')}, e);
    assert.throws(function() {solve('1+()+2')}, e);
    assert.throws(function() {solve('1+(2*())')}, e);
  });

  it('should not accept formulas ending with an operator', function() {
    var e = EndWithOperatorError;
    // No numbers
    assert.throws(function() {solve('+')}, e);
    assert.throws(function() {solve('(*)')}, e);
    assert.throws(function() {solve('(+)(-)(*)(/)')}, e);
    // With numbers
    assert.throws(function() {solve('1+')}, e);
    assert.throws(function() {solve('1+2*')}, e);
    assert.throws(function() {solve('(1+2*)')}, e);
    assert.throws(function() {solve('(1*2)(1+2*)')}, e);
  });
});
