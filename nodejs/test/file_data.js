const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');


async function _actual(data) {
  let actual = []
  for await (const n of data) {
    actual.push(n);
  }
  return actual;
}

test('read output from test', async (t) => {
  t.plan(1);
  const expected = [1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21];
  const data = file.getData(DATA.TEST, 'OUTPUT');
  let actual = await _actual(data);
  t.deepEqual(actual, expected);
});

test('read output from err', async (t) => {
  t.plan(1);
  const expected = [10, 200, 3000];
  const data = file.getData(DATA.ERR, 'OUTPUT');
  let actual = await _actual(data);
  t.deepEqual(actual, expected);
});

test('read output from bad', async (t) => {
  t.plan(1);
  const expected = [];
  const data = file.getData(DATA.BAD, 'OUTPUT');
  let actual = await _actual(data);
  t.deepEqual(actual, expected);
});

