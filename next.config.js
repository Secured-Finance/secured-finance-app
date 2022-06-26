/** @type {import('next').NextConfig} */
const extensionRules = require('./webpack-extensions');
const webpack = require('./webpack-config');

module.exports = {
    reactStrictMode: true,

    webpack: (config, options) => webpack.webpackOverride(config),

    async rewrites() {
        return [
            {
                source: '/:any*',
                destination: '/',
            },
        ];
    },
};
