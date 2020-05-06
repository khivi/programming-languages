const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');


test('read output from test', async (t) => {
  t.plan(1);
  const data = file.getData(DATA.TEST, 'OUTPUT');
  for await (const n of data) {
    t.deepEqual(n, 2);
  }
});

test('read output from err', async (t) => {
  t.plan(1);
  const data = await file.getData(DATA.ERR, 'OUTPUT');
  t.deepEqual([...data], [3]);
});
