/** @type {import('next').NextConfig} */
const webpack = require('./webpack-config');

module.exports = {
    reactStrictMode: true,
    compiler: {
        // The regexes defined here are processed in Rust so the syntax is different from
        // JavaScript `RegExp`s. See https://docs.rs/regex.
        reactRemoveProperties: { properties: ['^data-cy$', '^data-test$'] },
    },

    webpack: (config, options) => webpack.webpackOverride(config),
};
