const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackConfig = require('./webpack.interface.config');
const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

module.exports = {
    app
};