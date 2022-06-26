module.exports = { webpackOverride };

function webpackOverride(config) {
    config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        constants: false,
    };

    // remove the existing svg rule. This is specific for Storybook
    const imageRule = config.module.rules.find(rule => rule.test.test('.svg'));
    imageRule.exclude = /\.svg$/;

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
        stream: false,
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

    return config;
}
