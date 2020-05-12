import test, {ExecutionContext} from 'ava';
const {getCollection} = require('../src/file');
const DATA = require('./helpers/data');
const {fromData} = require('./helpers/data');

function collection(filename: string, num: number) {
  const data = getCollection(filename, num);
  return fromData(data);
}

test('read collection', async (t) => {
  t.plan(1);
  const expected = [2, 4, 6, 9, 20];
  const actual = await collection(DATA.TEST, 1);
  t.deepEqual(actual, expected);
});

test('read collection not found', async (t) => {
  t.plan(1);
  const expected: number[] = [];
  const actual = await collection(DATA.TEST, 5);
  t.deepEqual(actual, expected);
});

test('read collection from err', async (t) => {
  t.plan(2);
  const data = getCollection(DATA.ERR, 0);
  const next = () => data.next().then((x: IteratorResult<number>) => x.value);
  t.is(1, await next());
  t.is(1, await next());
});
