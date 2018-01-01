const path = require("path");
var webpack = require('webpack');

module.exports = {
    entry: __dirname + "/src/js/scripts.js",
    output: {
        path: __dirname + "/dist",
        filename: path.join("js","scripts.min.js")
    },
    resolve: {
        extensions:['.js','.scss'],
        alias: {
            'morris.js': 'morris.js/morris.min.js',
            "raphael" : "raphael/raphael.min.js"
        }
    },
    module: {
        loaders:[
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                  cacheDirectory: true,
                  presets: ['react', 'es2015']
                }
            },
            {
                test:/\.scss$/,
                exclude:/node_modules/,
                use:['style-loader','css-loader','sass-loader']
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                  cacheDirectory: true,
                  presets: ['react', 'es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin()
    ],
    cache:true
};