const path = require("path");
var webpack = require('webpack');
const fs = require("fs");
const WebpackOnBuildPlugin = require('on-build-webpack');

module.exports = {
    entry: {
        content: __dirname + "/src/content.js",
        background: __dirname + "/src/background.js",
        popup: __dirname + "/src/popup/popup.js"
    },
    output: {
        path: __dirname + "/dist",
        filename: '[name].js'
    },
    resolve: {
        extensions:['.js','.scss']
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
        new webpack.optimize.OccurrenceOrderPlugin(),
        new WebpackOnBuildPlugin((stats) =>{
            // move `popup.js` into the popup directory
            let oldPath = __dirname + "/dist/popup.js";
            let newPath = __dirname + "/dist/popup/popup.js";
            fs.stat(oldPath,(err,stats) =>{
                if(err == null){
                    fs.rename(oldPath,newPath);
                }
            })
        })
    ],
    cache:true
};