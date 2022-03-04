const path = require('path');

module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-preset-craco',
    ],
    typescript: {
        reactDocgen: 'none',
    },
    webpackFinal: config => {
        config.module.rules.push({
            test: /\.wasm$/,
            use: ['wasm-loader'],
            include: path.resolve(__dirname, '../'),
            type: 'javascript/auto',
        });

        return config;
    },
};
