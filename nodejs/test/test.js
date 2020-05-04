const test = require('ava');


test('should return -1 when the value is not present', t => {
    t.assert([1, 2, 3].indexOf(4) == -1);
})


