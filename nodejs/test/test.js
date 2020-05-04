const test = require('ava');
const first = require('../src/first');


test('should return -1 when the value is not present', (t) => {
  t.assert([1, 2, 3].indexOf(4) == -1);
});

test('testing first', (t) => {
  t.assert(first.foo(1) == 2);
});

