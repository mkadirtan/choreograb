var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'development',
    context: __dirname,
    plugins: [
        new webpack.ProvidePlugin({
            'earcut': 'earcut'
        })
    ],
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [
            {
                test: /\.(mp3)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/music/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(babylon|manifest)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/babylon/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/image/[name].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                    }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
    }
};