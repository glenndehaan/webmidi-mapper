var webpack = require('webpack');
var path = require('path');

//Get path so every environment works
var projectPath = path.resolve(__dirname, '..');

module.exports = {
    entry: projectPath + '/js/src/main.js',
    output: {
        path: projectPath + '/js/build',
        filename: 'final.js'
    },
    devtool: 'eval',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-es2015-modules-commonjs', 'transform-es2015-modules-commonjs'].map(function(name) { return require.resolve("babel-plugin-"+name) }),
                    presets: ['es2015'].map(function(name) { return require.resolve("babel-preset-"+name) }),
                    sourceMaps: 'inline'
                }
            }
        ]
    },
    resolve: {
        fallback: [path.join(__dirname, 'node_modules')],
        alias: {
            "TweenLite": "gsap/src/uncompressed/TweenLite",
            "TweenMax": "gsap/src/uncompressed/TweenMax"
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, 'node_modules')]
    }
};
