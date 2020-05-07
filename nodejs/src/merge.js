const {getOutput} = require('./file');


class Merge {
  constructor(filename) {
    this.filename = filename;
  };


  async * merge() {
    yield* await getOutput(this.filename);
  };
};

exports.Merge=Merge;
