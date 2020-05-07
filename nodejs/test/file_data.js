const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');


test('read output from test', async (t) => {
  const expected = [1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21];
  t.plan(1);
  const data = file.getData(DATA.TEST, 'OUTPUT');
  let i = 0;
  for await (const n of data) {
    t.is(expected[i], n);
    i++;
  }
});

test('read output from err', (t) => {
  t.plan(1);
  const data = file.getData(DATA.ERR, 'OUTPUT');
  t.deepEqual([...data], [3]);
});

