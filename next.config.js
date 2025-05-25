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
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.amplitude.com https://api.amplitude.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: https: blob:",
                            "connect-src 'self' https://*.secured.finance https://api.amplitude.com https://*.amplitude.com https://www.google-analytics.com https://rpc.ankr.com https://*.alchemy.com https://*.alchemyapi.io https://*.walletconnect.org https://*.walletconnect.com wss: https:",
                            "frame-src 'self' https://studio.squidrouter.com https://verify.walletconnect.org https://verify.walletconnect.com",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "frame-ancestors 'none'",
                            'upgrade-insecure-requests',
                        ].join('; '),
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
