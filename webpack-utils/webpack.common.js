const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonPaths = require('./common-paths');
const webpack = require('webpack');

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
      loader: 'babel-loader',
      exclude: /(node_modules)/
    },{
      test: /\.html$/,
      loader: 'html-loader'
    },{
      test: /\.(woff2?|ttf|eot|txt)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }],
      exclude: /node_modules/
    },{
      test: /\.(jpe?g|png|gif|svg)$/,
      use: [{
        loader:'url-loader',
        options: {
          name: '[name].[ext]',
          limit: 10000
        }
      }]
    }]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      alwaysWriteToDisk: true
    })
  ]
}
