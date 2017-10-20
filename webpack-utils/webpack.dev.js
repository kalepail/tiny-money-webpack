const webpack = require('webpack');
const commonPaths = require('./common-paths');

const config = {
  devtool: 'eval-source-map',
  devServer: {
    port: 8010,
    hot: true,
    contentBase: commonPaths.outputPath,
    host: '192.168.0.4'
  },
  output: {
    publicPath: 'http://192.168.0.4:8010/'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config;
