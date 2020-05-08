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

    let values = new Array(number).fill(null);
    while (true) {
      const updatedValues = _.map(values, async (v, i) => {
        if (_.isNull(v)) {
          v = await next(i);
        }
        return v;
      });
      values = await Promise.all(updatedValues);

      if (_.every(values, (v) => _.isUndefined(v))) {
        break;
      }

      const [min, minIdx] = findMin(values);
      values[minIdx] = null;
      yield min;
    }
  };
};

exports.Merge=Merge;