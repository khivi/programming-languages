'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const webpack = require('webpack');

const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');


if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}


// Generate configuration
const config = configFactory('production');

fs.emptyDirSync(paths.appBuild);
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

function checkRequiredFiles(files) {
  var currentFilePath;
  try {
    files.forEach(filePath => {
      currentFilePath = filePath;
      fs.accessSync(filePath, fs.F_OK);
    });
    return true;
  } catch (err) {
    var dirName = path.dirname(currentFilePath);
    var fileName = path.basename(currentFilePath);
    console.log(chalk.red('Could not find a required file.'));
    console.log(chalk.red('  Name: ') + chalk.cyan(fileName));
    console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName));
    return false;
  }
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
