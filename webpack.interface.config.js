const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const asd = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    context: __dirname,
    entry: __dirname + '/interface/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'interface.js'
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new asd(),
        new HtmlWebpackPlugin({
            'template': __dirname + '/interface/index.html',
            'filename': __dirname + '/dist/interface.html',
            'favicon': __dirname + '/shared/textures/favicon.ico'})
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.vue?$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]

    }
};