/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const isProduction = process.env.NODE_ENV == 'production'

const config = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      React: 'react',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: /(node_modules)/,
        use: [
          {
            loader: require.resolve('swc-loader'),
            options: {
              jsc: {
                transform: {
                  react: {
                    development: !isProduction,
                    refresh: !isProduction,
                  },
                },
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    fallback: {
      'buffer': require.resolve('buffer'),
    },
  },
}

const prodConfig = {
  mode: 'production',
  plugins: [
    new Dotenv({ path: '.env', systemvars: true }),
    new WorkboxWebpackPlugin.GenerateSW(),
    new CompressionPlugin(),
  ]
}

const devConfig = {
  mode: 'development',
  devServer: {
    // open: true,
    host: 'localhost',
    port: 8760,
  },
  plugins: [
    new Dotenv({ path: '.env.development' }),
    new ReactRefreshPlugin(),
  ]
}

module.exports = () => merge(config, isProduction ? prodConfig : devConfig)
