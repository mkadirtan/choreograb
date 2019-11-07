const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    context: __dirname,
    entry: __dirname + '/app/index.js',
    output: {
        filename: 'app.js',
        path: __dirname + '/dist'},
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.ProvidePlugin({'earcut': 'earcut'}),
        new HtmlWebpackPlugin({
            'template': __dirname + '/app/index.html',
            'filename': __dirname + '/dist/app.html',
            'favicon': __dirname + '/shared/textures/favicon.ico'})],
    module: {
        rules: [
            {
                test: /\.(png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/image/app/[name].[ext]'
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