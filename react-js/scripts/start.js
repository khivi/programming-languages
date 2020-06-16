'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');


const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const {checkRequiredFiles} = require('./helper');

const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

if (!checkRequiredFiles()) {
  process.exit(1);
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const config = configFactory('development');
const compiler = webpack(config);

const serverConfig = createDevServerConfig();
const devServer = new WebpackDevServer(compiler, serverConfig);

devServer.listen(DEFAULT_PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }
});

['SIGINT', 'SIGTERM'].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close();
    process.exit();
  });
});

