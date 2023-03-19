const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'node',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    externals: [nodeExternals()],
    externalsPresets: {
        node: true // in order to ignore built-in modules like path, fs, etc. 
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {   
            async_hooks: false,
        },
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 4000
    }
};