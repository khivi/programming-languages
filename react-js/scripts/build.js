'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');


const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');

const configFactory = require('../config/webpack.config');
const {checkRequiredFiles, copyPublicFolder, emptyBuildFolder } = require('./helper');


if (!checkRequiredFiles()) {
  process.exit(1);
}


emptyBuildFolder();
copyPublicFolder();
build()
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    console.log(chalk.red("webpack failed"));
    process.exit(1);
  });

function build() {
  console.log('Creating an optimized production build...');

  const config = configFactory('production');
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        if (!err.message) {
          return reject(err);
        }
      }
      const messages = stats.toJson({ all: false, warnings: true, errors: true });
      let message;
      if (messages.errors.length) {
        message = messages.errors[0];
      }
      else if (messages.warnings.length) {
        message = messages.warnings[0];
      }
      if (message) {
        return reject({message: message});
      }

      return resolve();
    });
  });
}

