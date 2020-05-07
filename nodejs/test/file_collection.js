const test = require('ava');
const file = require('../src/file');
const DATA = require('./helpers/data');


function collection(filename, num) {
  async function _actual(data) {
    const actual = [];
    for await (const n of data) {
      actual.push(n);
    }
    return actual;
  }
  const data = file.getData(filename, 'COLLECTION' + num);
  return _actual(data);
}

test('read collection', async (t) => {
  t.plan(1);
  const expected = [2, 4, 6, 9, 20];
  const actual = await collection(DATA.TEST, 1);
  t.deepEqual(actual, expected);
});


test('read collection not found', async (t) => {
  t.plan(1);
  const expected = [];
  const actual = await collection(DATA.TEST, 5);
  t.deepEqual(actual, expected);
});

test('read output from err', async (t) => {
  t.plan(2);
  const data = file.getData(DATA.ERR, 'COLLECTION0');
  const next = async () => (await data.next()).value;
  t.deepEqual(1, await next());
  t.deepEqual(1, await next());
});

