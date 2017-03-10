var testInputs = [
  '123',
  '1+2',
  '1+2+',
  '1/0',
  '1+2*3/4-5',
  '5/6+6/7',
  '1.001+2.56*3.90/0.004-0.5',
  '2*(3/(1-(5)/6)+4',
  '2*)(',
  '2*()',
  '2*)',
  '2)(',
  '2()',
  '(2)',
  '()',
  '(1+2*)',
  '(1*2)(1+2*)',
  '(1-2)(1+2)',
  '(1)(2)',
  '))((())(',
  '(((((((())))))))',
  '()()()()()()()()',
  '1+2*(3-(1+2-(3/4)+(4/5+(5/6+6/7))/8))'
]

var solve = require('./math');

var assert = require('assert');
  describe('#solve()', function() {
    it('should do addition', function() {
      assert.equal(3, solve('1+2'));                // Simple test
      assert.equal(-2, solve('-5+3'));              // Negative
      assert.equal(5000, solve('2000+3000'));       // Big numbers
      assert.equal(0.011, solve('0.001+0.01'));     // Floats
    });
    it('should do subtraction', function() {
      assert.equal(4, solve('6-2'));                // Simple test
      assert.equal(-11, solve('-5-6'));             // Negative
      assert.equal(-10000, solve('-6000-4000'));    // Big numbers
      assert.equal(0.009, solve('0.01-0.001'));     // Floats
    });
    it('should do multiplication', function() {
      assert.equal(15, solve('3*5'));               // Simple test
      assert.equal(-8, solve('-2*4'));              // Negative
      assert.equal(20000000, solve('4000*5000'));   // Big numbers
      assert.equal(0.0025, solve('0.05*0.05'));     // Floats
    });
    it('should do division', function() {
      assert.equal(3, solve('12/4'));               // Simple test
      assert.equal(-5, solve('-10/2'));             // Negative
      assert.equal(4, solve('20000/5000'));         // Big numbers
      assert.equal(1.5, solve('0.03/0.02'));        // Floats
    });
});
