// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const readPackageUp = require('read-pkg-up');
const merge = require('webpack-merge');
const packageJson = require('./package.json');
const process = require('process');
const StatsPlugin = require('stats-webpack-plugin');
const webpack = require('webpack');

/* eslint-enable @typescript-eslint/no-var-requires */
const bannerText = `${packageJson.name} ${packageJson.version}`;

const readVersion = (packageName) =>
  readPackageUp.sync({
    cwd: path.dirname(require.resolve(packageName)),
  })?.packageJson.version;

/**
 * @type {webpack.Configuration}
 */
const config = {
  devtool:
    process.env.NODE_ENV === 'development'
      ? 'eval-cheap-module-source-map'
      : 'source-map',
  entry: {
    'mtn-feature-hub-integrator-csr': path.join(
      __dirname,
      './src/feature-hub-integrator.ts',
    ),
  },
  externals: {
    'react-dom/server': 'react-dom/server',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: 'ts-loader' },
      },
    ],
  },
  output: {
    library: 'mtn-feature-hub-integrator',
    libraryTarget: 'umd',
    publicPath: 'auto',
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
    new webpack.DefinePlugin({
      'process.env.AXIOS_VERSION': JSON.stringify(readVersion('axios')),
      'process.env.FEATURE_HUB_VERSION': JSON.stringify(
        readVersion('@feature-hub/core'),
      ),
      'process.env.REACT_DOM_VERSION': JSON.stringify(readVersion('react-dom')),
      'process.env.REACT_VERSION': JSON.stringify(readVersion('react')),
      'process.env.STYLED_COMPONENTS_VERSION': JSON.stringify(
        readVersion('styled-components'),
      ),
    }),
    new webpack.BannerPlugin({
      banner: bannerText,
    }),
    // @ts-ignore
    new StatsPlugin('stats.json', {
      chunkModules: true,
      errorDetails: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.mjs', '.json', '.ts', '.tsx']
  },
};

const configs = [
  merge.merge(config, {
    mode: 'production',
    output: {
      chunkFilename: 'csr-[name]-[chunkhash].js',
      filename: '[name].js',
    },
  }),
  merge.merge(config, {
    mode: 'development',
    output: {
      chunkFilename: 'dev-csr-[name]-[chunkhash].js',
      filename: '[name].dev.js',
    },
  }),
];

module.exports = configs;
