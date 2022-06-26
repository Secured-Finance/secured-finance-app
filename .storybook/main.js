module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        'storybook-addon-performance',
        'storybook-addon-next',
    ],
    typescript: {
        reactDocgen: 'none',
    },
    framework: '@storybook/react',
    core: {
        builder: 'webpack5',
    },

    webpackFinal: async config => {
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

        const imageRule = config.module.rules.find(rule =>
            rule.test.test('.svg')
        );
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

        return config;
    },
};
