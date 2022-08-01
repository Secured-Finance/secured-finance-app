/** @type {import('next').NextConfig} */
const webpack = require('./webpack-config');

module.exports = {
    reactStrictMode: true,

    webpack: (config, options) => webpack.webpackOverride(config),

    env: {
        SF_ENV: 'development',
    },
};
