'use strict';

const path = require('path');
const paths = require('./paths');
const resolve = require('resolve');


/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getWebpackAliases(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      src: paths.appSrc,
    };
  }
}

/**
 * Get jest aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getJestAliases(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      '^src/(.*)$': '<rootDir>/src/$1',
    };
  }
}

function getModules() {
  const ts = require(resolve.sync('typescript', {
    basedir: paths.appNodeModules,
  }));
  let config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;

  config = config || {};
  const options = config.compilerOptions || {};

  return {
    webpackAliases: getWebpackAliases(options),
    jestAliases: getJestAliases(options)
  };
}

module.exports = getModules();
