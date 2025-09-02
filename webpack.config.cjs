/* eslint-disable @typescript-eslint/no-require-imports */
const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production'
const isTauriBuild = process.env.TAURI_ENV_PLATFORM !== undefined

const config = {
  entry: './src/main.tsx',
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
    new Dotenv({
      path: isProduction ? '.env' : '.env.development',
      systemvars: true,
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
      'process/browser': require.resolve('process/browser')
    },
  },
}

const prodConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          reuseExistingChunk: true,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-window|react-virtualized)[\\/]/,
          name: 'react',
          priority: 0,
        },
        mui: {
          test: /[\\/]node_modules[\\/](@mui)[\\/]/,
          name: 'mui',
          priority: 1,
        },
        azure: {
          test: /[\\/]node_modules[\\/](@azure)[\\/]/,
          name: 'azure',
          priority: 2,
        },
        musicMetadata: {
          test: /[\\/]node_modules[\\/](music-metadata)[\\/]/,
          name: 'music-metadata',
          priority: 3,
        },
        fontSouce: {
          test: /[\\/]node_modules[\\/](@fontsource)[\\/]/,
          name: 'fontsource',
          priority: 4,
        },
        pinyinPro: {
          test: /[\\/]node_modules[\\/](pinyin-pro)[\\/]/,
          name: 'pinyin-pro',
          priority: 5,
        },
      },
    },
  },
  plugins: [
    ...(
      isTauriBuild ? [] : [
        new WorkboxWebpackPlugin.GenerateSW(),
        new CompressionPlugin(),
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: 'bundle-report.html',
        }),
      ]
    )
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
    new ReactRefreshPlugin(),
  ]
}

module.exports = () => merge(config, isProduction ? prodConfig : devConfig)
