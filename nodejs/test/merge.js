const test = require('ava');
const {getOutput} = require('../src/file');
const DATA = require('./helpers/data');
const {Merge} = require('../src/merge');


async function next2(data1, data2) {
  const next = async (d) => (await d.next()).value;
  const d1 = await next(data1);
  const d2 = await next(data2);
  return [d1, d2];
}

test('merge test data', async (t) => {
  t.plan(14);
  const fileName = DATA.TEST;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();

  while (true) {
    const [e, a] = await next2(expected, actual);
    t.is(e, a);
    if (e === undefined) {
      break;
    }
  }
});
