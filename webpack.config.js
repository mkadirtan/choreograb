const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.(mp3|babylon|manifest)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    externals: {
        oimo: 'OIMO',
        cannon: 'CANNON',
        earcut: 'EARCUT'
    }
};