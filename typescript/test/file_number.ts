import test from 'ava';
const {getNumber} = require('../src/file');
const DATA = require('./helpers/data');

test('read number from test', async t => {
  t.plan(1);
  const number = await getNumber(DATA.TEST);
  t.is(number, 3);
});

test('read number from err', async t => {
  t.plan(1);
  const number = await getNumber(DATA.ERR);
  t.is(number, 1);
});

test('throw error from bad', async t => {
  t.plan(2);
  const promise = getNumber(DATA.BAD);
  const e = await t.throwsAsync(promise);
  t.is(e.message, 'Number not found');
});
