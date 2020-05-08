const _ = require('lodash');
const assert = require('assert').strict;
const {getNumber, getCollection} = require('./file');


class Merge {
  constructor(filename) {
    this.filename = filename;
  };


  async* merge() {
    const findMin = (values) => {
      let min = undefined;
      let minIdx = undefined;
      for (const idx of _.range(number)) {
        const v = values[idx];
        assert.ok(!_.isNull(v));
        if (_.isUndefined(v)) {
          continue;
        }
        if (minIdx === undefined || v < min) {
          min = v;
          minIdx = idx;
        }
      };
      return [min, minIdx];
    };

    const number = await getNumber(this.filename);
    const collections = _.map(_.range(number), (i) => {
      return getCollection(this.filename, i);
    });
    const next = async (i) => (await collections[i].next()).value;

    const initialValues = _.map(_.range(number), async (i) => {
      return await next(i);
    });
    const values = await Promise.all(initialValues);

    while (true) {
      if (_.every(values, (v) => _.isUndefined(v))) {
        break;
      }

      const [min, minIdx] = findMin(values);
      yield min;
      values[minIdx] = await next(minIdx);
    }
  };
};

exports.Merge=Merge;
