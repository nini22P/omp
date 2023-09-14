/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV == 'production'
const stylesHandler = 'style-loader'

const config = {
    entry: './src/main.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: 8760,
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'public' }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
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

module.exports = () => {
    if (isProduction) {
        config.mode = 'production'
        config.plugins.push(new Dotenv({ path: './.env', systemvars: true }))
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW())
        config.plugins.push(new CompressionPlugin())
    } else {
        config.mode = 'development'
        config.plugins.push(new Dotenv({ path: './.env.development' }))
    }
    return config
}
