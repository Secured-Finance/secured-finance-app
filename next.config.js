/** @type {import('next').NextConfig} */
const extensionRules = require('./webpack-extensions');

module.exports = {
    reactStrictMode: true,

    webpack: (config, options) => {
        config.resolve.fallback = {
            fs: false,
            path: false,
            stream: false,
            constants: false,
        };

        extensionRules.forEach(rule => config.module.rules.push(rule));

        config.module.rules.push({
            test: /\.(png|jpe?g|gif)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        publicPath: 'public',
                    },
                },
            ],
        });

        return config;
    },

    async rewrites() {
        return [
            {
                source: '/:any*',
                destination: '/',
            },
        ];
    },
};
