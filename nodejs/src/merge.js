const fp = require('lodash/fp');
const {getNumber, getCollection} = require('./file');

class Merge {
  constructor(filename) {
    this.filename = filename;
  }

  async* merge() {
    const findMin = (values) => {
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
    const collections = fp.map((i) => getCollection(this.filename, i))(fp.range(0, number));
    const next = (i) => collections[i].next().then((x) => x.value);

    const initialValues = function* () {
      for (const i of fp.range(0,number)) {
        yield next(i);
      }
    };
    const values = await Promise.all(initialValues());

    while (true) {
      if (fp.every(fp.isUndefined)(values)) {
        break;
      }

      const minIdx = findMin(values);
      yield values[minIdx];
      values[minIdx] = await next(minIdx);
    }
  }
}

exports.Merge = Merge;
