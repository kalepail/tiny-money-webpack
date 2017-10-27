const webpackMerge = require('webpack-merge');
const webpack = require('webpack');

module.exports = (env) => {
  if (!env)
    env = 'development';

  const commonConfig = require('./webpack-utils/webpack.common');
  const envConfig = require(`./webpack-utils/webpack.${env}`);

  return webpackMerge({
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    ]
  }, commonConfig, envConfig);
}
