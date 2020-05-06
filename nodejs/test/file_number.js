const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');

test('read number from test', (t) => {
  t.plan(1);
  return file.getNumber(DATA.TEST).then((number) => {
    t.is(number, 3);
  });
});

test('read number from err', (t) => {
  t.plan(1);
  return file.getNumber(DATA.ERR).then((number) => {
    t.is(number, 1);
  });
});

test('throw error from bad', async (t) => {
  t.plan(2);
  const promise = file.getNumber(DATA.BAD);
  const e = await t.throwsAsync(promise);
  t.is(e.message, 'Number not found');
});
