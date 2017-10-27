const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonPaths = require('./common-paths');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: commonPaths.outputPath,
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.s?css$/,
      exclude: /(node_modules)/,
      loader: 'import-glob'
    },{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    },{
      test: /\.html$/,
      exclude: /node_modules/,
      use: {
        loader: 'html-loader',
        options: {
          root: path.resolve(__dirname, 'images'),
          attrs: ['link:href']
        }
      }
    },{
      test: /\.(woff2?|ttf|eot|txt)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[hash].[name].[ext]'
        }
      }]
    },{
      test: /\.(jpe?g|png|gif|svg)$/,
      exclude: /node_modules/,
      use: [{
        loader:'file-loader',
        options: {
          name: '[hash].[name].[ext]'
        }
      },{
        loader: 'image-webpack-loader',
        query: {}
      }]
    }]
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      alwaysWriteToDisk: true
    })
  ]
}
