// SKIP import fp = require('lodash/fp');
// SKIP const fp = require('lodash/fp');
import fp from 'lodash/fp';
import {getNumber, getCollection} from './file';

export class Merge {
  readonly filename: string;
  constructor(filename: string) {
    this.filename = filename;
  }

  async * merge() {
    const findMin = (values: readonly number[]) => {
      let minIdx;
      for (const idx of fp.range(0, values.length)) {
        const v = values[idx];
        if (fp.isUndefined(v)) {
          continue;
        }

        minIdx = minIdx === undefined ? idx : minIdx;
        if (v < values[minIdx]) {
          minIdx = idx;
        }
      }

      return minIdx;
    };

    const count = await getNumber(this.filename);
    const collections = fp.map(i => getCollection(this.filename, i))(fp.range(0, count));
    const next = async (i: number) => collections[i].next().then((x: IteratorResult<number>) => x.value);

    const initialValues = function * () {
      for (const i of fp.range(0, count)) {
        yield next(i);
      }
    };

    const values = await Promise.all(initialValues());

    while (true) {
      if (fp.every(x => fp.isUndefined(x))(values)) {
        break;
      }

      const minIdx = findMin(values);
      if (minIdx === undefined) {
        break;
      }

      yield values[minIdx];
      /* eslint-disable no-await-in-loop */ values[minIdx] = await next(minIdx); /* eslint-enable no-await-in-loop */
    }
  }
}

exports.Merge = Merge;
