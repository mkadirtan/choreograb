const webpack = require('webpack');

module.exports = {
    mode: 'development',
    context: __dirname,
    entry: __dirname + '/app/index.js',
    output: {
        filename: 'index.js',
        path: __dirname + '/dist'},
    plugins: [
        new webpack.ProgressPlugin(),
        new webpack.ProvidePlugin({'earcut': 'earcut'})
        ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
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