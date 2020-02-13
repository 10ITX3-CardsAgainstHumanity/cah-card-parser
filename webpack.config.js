const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/parser.ts',
    devtool: 'inline-source-map',
    target: "node",
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    externals: [nodeExternals()]
};
