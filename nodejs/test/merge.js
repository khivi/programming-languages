const test = require('ava');
const {getOutput} = require('../src/file');
const DATA = require('./helpers/data');
const {Merge} = require('../src/merge');

const next = async (d) => (await d.next()).value;
const next2 = async (data1, data2) => {
  const d1 = await next(data1);
  const d2 = await next(data2);
  return [d1, d2];
};

async function equal(t, expected, actual) {
  while (true) {
    const [e, a] = await next2(expected, actual);
    t.is(e, a);
    if (e === undefined) {
      break;
    }
  }
}

async function notEqual(t, expected, actual) {
  while (true) {
    const [e, a] = await next2(expected, actual);
    t.pass();
    if (e == a) {
      if (e === undefined) {
        break;
      }
      continue;
    }
    break;
  }
}

test('merge test data', async (t) => {
  t.plan(14);
  const fileName = DATA.TEST;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();
  await equal(t, expected, actual);
});

test('merge err data', async (t) => {
  t.plan(1);
  const fileName = DATA.ERR;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();
  await notEqual(t, expected, actual);
});

test('merge zero data', async (t) => {
  t.plan(1);
  const fileName = DATA.ZERO;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();
  await equal(t, expected, actual);
});
