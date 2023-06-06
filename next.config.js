/** @type {import('next').NextConfig} */
const webpack = require('./webpack-config');

const commitHash = require('child_process')
    .execSync('git log --pretty=format:"%h" -n1')
    .toString()
    .trim();

module.exports = {
    reactStrictMode: true,
    trailingSlash: true,

    webpack: (config, options) => webpack.webpackOverride(config),

    env: {
        SF_ENV: process.env.SF_ENV,
        COMMIT_HASH: commitHash,
    },
};
