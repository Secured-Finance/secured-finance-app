/** @type {import('next').NextConfig} */
const webpack = require('./webpack-config');

const commitHash = require('child_process')
    .execSync('git log --pretty=format:"%h" -n1')
    .toString()
    .trim();

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    trailingSlash: true,
    staticPageGenerationTimeout: 120,

    experimental: {
        esmExternals: false,
    },

    transpilePackages: ['wagmi', '@wagmi/core', '@web3modal/wagmi'],

    webpack: (config, options) => webpack.webpackOverride(config),

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        // The full policy is a <meta> tag (src/utils/csp.ts).
                        // frame-ancestors only works as a header.
                        value: "frame-ancestors 'none'; upgrade-insecure-requests",
                    },
                ],
            },
        ];
    },

    env: {
        SF_ENV: process.env.SF_ENV,
        COMMIT_HASH: commitHash,
    },
});
