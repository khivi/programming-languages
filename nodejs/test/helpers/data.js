const path = require('path');

const _DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'data');
const TEST= path.resolve(_DATA_DIR, 'test.txt');
const ERR= path.resolve(_DATA_DIR, 'err.txt');
const BAD= path.resolve(_DATA_DIR, 'bad.txt');

async function from_data(data) {
  const actual = [];
  for await (const n of data) {
    actual.push(n);
  }
  return actual;
}

exports.TEST=TEST;
exports.ERR=ERR;
exports.BAD=BAD;
exports.from_data=from_data;
