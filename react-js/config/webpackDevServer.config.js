'use strict';

const paths = require('./paths');

const host = process.env.HOST || '0.0.0.0';

module.exports = function() {
  return {
    compress: true,
    contentBase: paths.appPublic,
    contentBasePublicPath: paths.publicUrlOrPath,
    publicPath: paths.publicUrlOrPath.slice(0, -1),
  };
};
