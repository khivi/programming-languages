const _ = require('lodash');
const {getNumber, getCollection} = require('./file');

class Merge {
  constructor(filename) {
    this.filename = filename;
  }

  async* merge() {
    const findMin = (values) => {
      let minIdx = undefined;
      for (const idx of _.range(number)) {
        const v = values[idx];
        if (_.isUndefined(v)) {
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
    const collections = _.map(_.range(number), (i) => {
      return getCollection(this.filename, i);
    });
    const next = (i) => collections[i].next().then((x) => x.value);

    const initialValues = function* () {
      for (const i of _.range(number)) {
        yield next(i);
      }
    };
    const values = await Promise.all(initialValues());

    while (true) {
      if (_.every(values, (v) => _.isUndefined(v))) {
        break;
      }

      const minIdx = findMin(values);
      yield values[minIdx];
      values[minIdx] = await next(minIdx);
    }
  }
}

exports.Merge = Merge;
