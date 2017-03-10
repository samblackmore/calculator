var solve = require('./math');
var assert = require('assert');

var fudge = 0.0000000000000001;
var third = 0.333333333333333333;
var twoThirds = 0.666666666666666667;

describe('#solve()', function() {
  it('should do addition', function() {
    assert.equal(solve('1+2'), 3);                // Simple test
    assert.equal(solve('-5+3'), -2);              // Negative
    assert.equal(solve('2000+3000'), 5000);       // Big numbers
    assert.equal(solve('0.001+0.01'), 0.011);     // Floats
  });
  it('should do subtraction', function() {
    assert.equal(solve('6-2'), 4);                // Simple test
    assert.equal(solve('-5-6'), -11);             // Negative
    assert.equal(solve('-6000-4000'), -10000);    // Big numbers
    assert.equal(solve('0.01-0.001'), 0.009);     // Floats
  });
  it('should do multiplication', function() {
    assert.equal(solve('3*5'), 15);               // Simple test
    assert.equal(solve('-2*4'), -8);              // Negative
    assert.equal(solve('4000*5000'), 20000000);   // Big numbers
    assert.equal(solve('0.05*0.05'), 0.0025);     // Floats
  });
  it('should do division', function() {
    assert.equal(solve('12/4'), 3);               // Simple test
    assert.equal(solve('-10/2'), -5);             // Negative
    assert.equal(solve('20000/5000'), 4);         // Big numbers
    assert.equal(solve('0.03/0.02'), 1.5);        // Floats
  });
  it('should respect the order of operations', function() {
    // Plus first
    assert.equal(solve('1+2-3*4/5'), 0.6 + fudge);
    assert.equal(solve('1+2-3/4*5'), -0.75);
    assert.equal(solve('1+2*3-4/5'), 6.2);
    assert.equal(solve('1+2*3/4-5'), -2.5);
    assert.equal(solve('1+2/3*4-5'), -(1 + third));
    assert.equal(solve('1+2/3-4*5'), -(18 + third));
    // Minus first
    assert.equal(solve('1-2+3*4/5'), 1.4);
    assert.equal(solve('1-2+3/4*5'), 2.75);
    assert.equal(solve('1-2*3+4/5'), -4.2);
    assert.equal(solve('1-2*3/4+5'), 4.5);
    assert.equal(solve('1-2/3+4*5'), 20 + third);
    assert.equal(solve('1-2/3*4+5'), 3 + third);
    // Times first
    assert.equal(solve('1*2+3-4/5'), 4.2);
    assert.equal(solve('1*2+3/4-5'), -2.25);
    assert.equal(solve('1*2-3+4/5'), -0.2);
    assert.equal(solve('1*2-3/4+5'), 6.25);
    assert.equal(solve('1*2/3+4-5'), -third);
    assert.equal(solve('1*2/3-4+5'), 1 + twoThirds);
    // Divide first
    assert.equal(solve('1/2+3-4*5'), -16.5);
    assert.equal(solve('1/2+3*4-5'), 7.5);
    assert.equal(solve('1/2*3+4-5'), 0.5);
    assert.equal(solve('1/2*3-4+5'), 2.5);
    assert.equal(solve('1/2-3+4*5'), 17.5);
    assert.equal(solve('1/2-3*4+5'), -6.5);
  });
});
