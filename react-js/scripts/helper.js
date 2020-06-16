
const path = require('path');
const fs = require('fs-extra');
const paths = require('../config/paths');
const chalk = require('react-dev-utils/chalk');

exports.checkRequiredFiles = function (files = [paths.appHtml, paths.appIndexJs]) {
    for (const filePath of files) { 
      const fileName = path.basename(filePath);
      console.log(chalk.green('  Checking: ') + chalk.cyan(fileName));
      try  {
        fs.accessSync(filePath, fs.F_OK);
      } catch (err) { 
        console.log(chalk.red('Could not find a required file.'));
        console.log(chalk.red('  Name: ') + chalk.cyan(filePath));
        return false;
      }
    }
    return true;
}

exports.copyPublicFolder = function () {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

exports.emptyBuildFolder = function() { 
  fs.emptyDirSync(paths.appBuild);
}
