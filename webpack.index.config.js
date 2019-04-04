const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './interface/reactive_index.js',
    mode: 'development',
    output: {
        path: __dirname + '/dist',
        filename: 'interface.js'
    },
    context: __dirname,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.jsx', '.js']
                },
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react']
                        }
                    }
                ]
            }
        ]

    }
};