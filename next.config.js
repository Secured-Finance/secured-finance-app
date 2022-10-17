/** @type {import('next').NextConfig} */
const webpack = require('./webpack-config');

module.exports = {
    reactStrictMode: true,
    trailingSlash: true,

    webpack: (config, options) => webpack.webpackOverride(config),

    env: {
        SF_ENV: process.env.SF_ENV,
    },
};
