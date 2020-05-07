const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');


async function output(filename) { 
  async function _actual(data) {
    let actual = []
    for await (const n of data) {
      actual.push(n);
    }
    return actual;
  }
  const data = file.getData(filename, 'OUTPUT');
  return await _actual(data);
}

test('read output from test', async (t) => {
  t.plan(1);
  const expected = [1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21];
  let actual = await output(DATA.TEST);
  t.deepEqual(actual, expected);
});

test('read output from err', async (t) => {
  t.plan(1);
  const expected = [10, 200, 3000];
  let actual = await output(DATA.ERR);
  t.deepEqual(actual, expected);
});

test('read output from bad', async (t) => {
  t.plan(1);
  const expected = [];
  let actual = await output(DATA.BAD);
  t.deepEqual(actual, expected);
});

