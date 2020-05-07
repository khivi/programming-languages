const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');

test('read number from test', async (t) => {
  t.plan(1);
  const number = await file.getNumber(DATA.TEST);
  t.is(number, 3);
});

test('read number from err', async (t) => {
  t.plan(1);
  const number = await file.getNumber(DATA.ERR);
  t.is(number, 1);
});

test('throw error from bad', async (t) => {
  t.plan(2);
  const promise = file.getNumber(DATA.BAD);
  const e = await t.throwsAsync(promise);
  t.is(e.message, 'Number not found');
});
