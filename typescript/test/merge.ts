import test, {ExecutionContext} from 'ava';
import {getOutput} from '../src/file';
import * as DATA from './helpers/data';
import {Merge} from '../src/merge';

const next2 = (data1: AsyncIterator<number>, data2: AsyncIterator<number>) => {
  const next = (d: AsyncIterator<number>) => d.next().then(x => x.value);
  const d1 = next(data1);
  const d2 = next(data2);
  return Promise.all([d1, d2]);
};

async function isEqual(t: ExecutionContext, expected: AsyncIterator<number>, actual: AsyncIterator<number>) {
  while (true) {
    const [e, a] = await next2(expected, actual);
    if (e != a) {
      return false;
    }

    if (e === undefined) {
      return true;
    }

    t.pass();
  }
}

async function equal(t: ExecutionContext, expected: AsyncIterator<number>, actual: AsyncIterator<number>) {
  t.truthy(await isEqual(t, expected, actual));
}

async function notEqual(t: ExecutionContext, expected: AsyncIterator<number>, actual: AsyncIterator<number>) {
  t.falsy(await isEqual(t, expected, actual));
}

test('merge test data', async t => {
  t.plan(14);
  const fileName = DATA.TEST;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();
  await equal(t, expected, actual);
});

test('merge err data', async t => {
  t.plan(1);
  const fileName = DATA.ERR;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();
  await notEqual(t, expected, actual);
});

test('merge zero data', async t => {
  t.plan(1);
  const fileName = DATA.ZERO;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();
  await equal(t, expected, actual);
});
