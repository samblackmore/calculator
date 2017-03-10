var solve = require('./math');

var assert = require('assert');
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
});
