import path from 'path';
import process = require('process');

const _DATA_DIR = path.resolve(process.cwd(), '..', 'data');
export const TEST = path.resolve(_DATA_DIR, 'test.txt');
export const ERR = path.resolve(_DATA_DIR, 'err.txt');
export const BAD = path.resolve(_DATA_DIR, 'bad.txt');
export const ZERO = path.resolve(_DATA_DIR, 'zero.txt');

export async function fromData(data: AsyncIterable<number>): Promise<number[]> {
  const actual = [];
  for await (const n of data) {
    actual.push(n);
  }

  return actual;
}

