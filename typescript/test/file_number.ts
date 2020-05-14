import test from 'ava';
import {getNumber} from '../src/file';
import * as DATA from './helpers/data';

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
  const error = await t.throwsAsync(promise);
  t.is(error.message, 'Number not found');
});
