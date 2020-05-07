const path = require('path');

const _DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'data');
exports.TEST= path.resolve(_DATA_DIR, 'test.txt');
exports.ERR= path.resolve(_DATA_DIR, 'err.txt');
exports.BAD= path.resolve(_DATA_DIR, 'bad.txt');


// data is a async generator so we need to do for.await...of
async function fromData(data) {
  const actual = [];
  for await (const n of data) {
    actual.push(n);
  }
  return actual;
}

exports.fromData=fromData;
