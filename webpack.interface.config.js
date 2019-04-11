const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname),
    entry: [
        path.join(path.resolve(__dirname), '/interface/index.js'),
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'
    ],
    output: {
        path: path.join(path.resolve(__dirname), '/dist'),
        filename: 'interface.js',
        publicPath: "/"
    },
    devtool: '#source-map',
    plugins: [
        new webpack.ProgressPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: './style/[name].css',
            chunkFilename: './style/[id].css'
        }),
        new HtmlWebpackPlugin({
            'template': path.join(path.resolve(__dirname), '/interface/index.html'),
            'filename': path.join(path.resolve(__dirname), '/dist/interface.html'),
            'favicon': path.join(path.resolve(__dirname), '/shared/textures/favicon.ico')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
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
                use: [
                    'css-hot-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            publicPath: __dirname + '/dist'
                        }
                    },
                    'css-loader'
                    ]
            },
            {
                test: /\.vue?$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.jpe?g$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: '/image/interface/[name].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            enforce: 'pre',
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]

    }
};