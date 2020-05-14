import test from 'ava';
import {getOutput} from '../src/file';
import * as DATA from './helpers/data';
import {fromData} from './helpers/data';

async function output(filename: string) {
  const data = getOutput(filename);
  return fromData(data);
}

test('read output from test', async t => {
  t.plan(1);
  const expected = [1, 1, 2, 2, 3, 4, 4, 6, 7, 9, 9, 20, 21];
  const actual = await output(DATA.TEST);
  t.deepEqual(actual, expected);
});

test('read output from err', async t => {
  t.plan(1);
  const expected = [10, 200, 3000];
  const actual = await output(DATA.ERR);
  t.deepEqual(actual, expected);
});

test('read output from bad', async t => {
  t.plan(1);
  const expected: number[] = [];
  const actual = await output(DATA.BAD);
  t.deepEqual(actual, expected);
});
