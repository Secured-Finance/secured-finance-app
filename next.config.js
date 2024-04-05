/** @type {import('next').NextConfig} */
const webpack = require('./webpack-config');
const withTM = require('next-transpile-modules')(['@0xsquid/widget']);

const commitHash = require('child_process')
    .execSync('git log --pretty=format:"%h" -n1')
    .toString()
    .trim();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withTM(
    withBundleAnalyzer({
        reactStrictMode: true,
        trailingSlash: true,
        staticPageGenerationTimeout: 1000,

        experimental: {
            esmExternals: false,
        },

        webpack: (config, options) => webpack.webpackOverride(config),

        env: {
            SF_ENV: process.env.SF_ENV,
            COMMIT_HASH: commitHash,
        },
    })
);
