const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');


test('read output from test', (t) => {
  return file.getNumber(DATA.TEST).then((number) => {
    t.is(number, 3);
  });
});

test('read output from err', (t) => {
  return file.getNumber(DATA.ERR).then((number) => {
    t.is(number, 1);
  });
});

