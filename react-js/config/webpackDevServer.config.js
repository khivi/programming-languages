'use strict';

const paths = require('./paths');

module.exports = function() {
  return {
    compress: true,
    contentBase: paths.appPublic,
  };
};
