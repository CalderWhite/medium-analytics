const path = require("path");
var webpack = require('webpack');
const fs = require("fs");
const WebpackOnBuildPlugin = require('on-build-webpack');

module.exports = {
    entry: {
        content: __dirname + "/src/js/content.js",
        background: __dirname + "/src/js/background.js",
        popup: __dirname + "/src/js/popup/popup.js",
        scripts: __dirname + "/src/js/app/scripts.js",
        verifyPage: __dirname + "/src/js/app/verifyPage.js"
    },
    output: {
        path: __dirname + "/dist",
        filename: '[name].js'
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
                test:/\.css$/,
                exclude:/node_modules/,
                use:['style-loader','css-loader']
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
            const moveFile = (oldPath,newPath) =>{
                fs.stat(__dirname + oldPath,(err,stats) =>{
                    if(err == null){
                        fs.rename(__dirname + oldPath,__dirname + newPath);
                    }
                })
            }
            // move `popup.js` into the popup directory
            moveFile('/dist/popup.js','/dist/popup/popup.js');
            moveFile('/dist/scripts.js','/dist/app/js/scripts.min.js');
            moveFile('/dist/verifyPage.js','/dist/app/js/verifyPage.min.js')
        })
    ],
    cache:true
};