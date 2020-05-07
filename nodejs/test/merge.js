const test = require('ava');
const {getOutput} = require('../src/file');
const DATA = require('./helpers/data');
const {Merge} = require('../src/merge');

test('merge test data', async (t) => {
  t.pass(13);
  const fileName = DATA.TEST;
  const expected = getOutput(fileName);
  const actual = new Merge(fileName).merge();

  const next = async (data) => (await data.next()).value;
  while (true) {
    const e = await next(expected);
    const a = await next(actual);
    t.assert((e === undefined && a == undefined) ||
             (e !== undefined && a != undefined));
    t.is(e, a);
    if (e == undefined) {
      break;
    }
  }
});
