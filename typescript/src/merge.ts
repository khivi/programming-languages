import fp from 'lodash/fp';
import {getNumber, getCollection} from './file';

export class Merge {
  readonly filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  async * merge() {
    const findMin = (values: readonly number[]): number|undefined => {
      let minIdx;
      for (const idx of fp.range(0, values.length)) {
        const v = values[idx];
        if (v === undefined) {
          continue;
        }

        minIdx = minIdx === undefined ? idx : minIdx;
        if (v < values[minIdx]) {
          minIdx = idx;
        }
      }

      return minIdx;
    };

    const count: number = await getNumber(this.filename);
    const collections: Array<AsyncGenerator<number>> = fp.map((i: number) => getCollection(this.filename, i))(fp.range(0, count));
    const next = async (i: number): Promise<number> => collections[i].next().then(x => x.value);

    const initialValues: Array<Promise<number>> = fp.map(async (i: number) => next(i))(fp.range(0, count));
    const values: number[] = await Promise.all(initialValues);

    while (true) {
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
