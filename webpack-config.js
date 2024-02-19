const webpack = require('webpack');
const path = require('path');

module.exports = { webpackOverride };

function webpackOverride(config) {
    // disable whatever is already set to load SVGs
    config.module.rules
        .filter(rule => rule.test && rule.test.test?.('.svg'))
        .forEach(rule => (rule.exclude = /\.svg$/i));

    config.module.rules.push({
        test: /\.svg$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    icon: true,
                },
            },
        ],
    });

    config.resolve.fallback = {
        fs: false,
        path: require.resolve('path-browserify'),
        constants: false,
        crypto: require.resolve('crypto-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
    };

    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    );

    config.resolve.alias = {
        ...config.resolve.alias,
        '.storybook': path.resolve(__dirname, './.storybook/'),
    };

    return config;
}
