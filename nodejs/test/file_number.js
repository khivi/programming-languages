const test = require('ava');
const path = require('path');
const file = require('../src/file');

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const TEST_TXT = path.resolve(DATA_DIR, 'test.txt');
const ERR_TXT = path.resolve(DATA_DIR, 'err.txt');
const BAD_TXT = path.resolve(DATA_DIR, 'bad.txt');

test('read number from test', (t) => {
  return file.getNumber(TEST_TXT).then((number) => {
    t.is(number, 3);
  });
});

test('read number from err', (t) => {
  return file.getNumber(ERR_TXT).then((number) => {
    t.is(number, 1);
  });
});

test('throw error from bad', async (t) => {
  const promise = file.getNumber(BAD_TXT);
  const e = await t.throwsAsync(promise);
  t.is(e.message, 'Number not found');
});
