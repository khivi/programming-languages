const test = require('ava');
const {getOutput} = require('../src/file');
const DATA = require('./helpers/data');
const {fromData} = require('./helpers/data');


function output(filename) {
  const data = getOutput(filename);
  return fromData(data);
}

test('read output from test', async (t) => {
  t.plan(1);
  const expected = [1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21];
  const actual = await output(DATA.TEST);
  t.deepEqual(actual, expected);
});

test('read output from err', async (t) => {
  t.plan(1);
  const expected = [10, 200, 3000];
  const actual = await output(DATA.ERR);
  t.deepEqual(actual, expected);
});

test('read output from bad', async (t) => {
  t.plan(1);
  const expected = [];
  const actual = await output(DATA.BAD);
  t.deepEqual(actual, expected);
});

