const path = require('path');

const _DATA_DIR = path.resolve(__dirname, '..', '..', '..', 'data');
const TEST= path.resolve(_DATA_DIR, 'test.txt');
const ERR= path.resolve(_DATA_DIR, 'err.txt');
const BAD= path.resolve(_DATA_DIR, 'bad.txt');

exports.TEST=TEST;
exports.ERR=ERR;
exports.BAD=BAD;
