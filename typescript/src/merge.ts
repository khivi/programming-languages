import fp = require('lodash/fp');
const {getNumber, getCollection} = require('./file');

class Merge {
  filename: string;
  constructor(filename: string) {
    this.filename = filename;
  }

  async* merge() {
    const findMin = (values: number[]) => {
      let minIdx = undefined;
      for (const idx of fp.range(0, number)) {
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

    const number = await getNumber(this.filename);
    const collections = fp.map((i) => getCollection(this.filename, i))(
        fp.range(0, number),
    );
    const next = (i: number) => collections[i].next().then((x: IteratorResult<number>) => x.value);

    const initialValues = function* () {
      for (const i of fp.range(0, number)) {
        yield next(i);
      }
    };
    const values = await Promise.all(initialValues());

    while (true) {
      if (fp.every(fp.isUndefined)(values)) {
        break;
      }

      const minIdx = findMin(values);
      if (minIdx === undefined) {
          break;
      }
      yield values[minIdx];
      values[minIdx] = await next(minIdx);
    }
  }
}

exports.Merge = Merge;
