const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = [{
  entry: {
    'openar': './src/index.js',
    'openar.min': './src/index.js'
  },
  output: {
    libraryTarget: 'umd',
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    publicPath: '/dist',
    contentBase: [path.join(__dirname, "docs")],
    inline: true,
    port: 8080
  },
  plugins: [
    new UglifyJSPlugin({
      test: /\.min\.js$/
    })
  ]
}];
