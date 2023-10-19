/** @type {import('next').NextConfig} */
const webpack = require('./webpack-config');

// BigInt.prototype.toJSON = function () {
//     return this.toString();
// };

const commitHash = require('child_process')
    .execSync('git log --pretty=format:"%h" -n1')
    .toString()
    .trim();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: true,
});

module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    trailingSlash: true,
    staticPageGenerationTimeout: 120,

    webpack: (config, options) => webpack.webpackOverride(config),

    env: {
        SF_ENV: process.env.SF_ENV,
        COMMIT_HASH: commitHash,
    },
});
